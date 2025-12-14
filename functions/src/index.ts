import { onCall, onRequest, HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { defineSecret } from "firebase-functions/params";
import { GoogleGenAI } from "@google/genai";
import * as admin from "firebase-admin";
import Stripe from "stripe";

// Initialize Firebase Admin
admin.initializeApp();

// 1. DEFINICIÓN DE SECRETO (Seguridad V2)
// Esto evita usar process.env inseguros. Se configura con: firebase functions:secrets:set GEMINI_API_KEY
const geminiApiKey = defineSecret("GEMINI_API_KEY");
const stripeSecret = defineSecret("STRIPE_SECRET_KEY");
const stripeWebhookSecret = defineSecret("STRIPE_WEBHOOK_SECRET");

// Lazy initialization of AI with the Secret
const getAI = (apiKey: string) => {
  return new GoogleGenAI({ apiKey });
};

/**
 * GENERATE SECURE CONTENT (AI Proxy)
 * Maneja Texto, Imágenes y Video desde el servidor para no exponer llaves.
 */
export const generateSecureContent = onCall(
  { 
    secrets: [geminiApiKey],
    timeoutSeconds: 300, // Aumentamos timeout para videos (5 min)
    memory: "1GiB"
  }, 
  async (request) => {
  try {
    // Verificar Autenticación
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Debes iniciar sesión para usar la magia de Carmelita.");
    }

    const { type, model, prompt, systemInstruction, config } = request.data;
    const apiKey = geminiApiKey.value();
    const ai = getAI(apiKey);

    // 1. TEXTO / JSON / CHAT
    if (type === 'text' || type === 'json') {
      const selectedModel = model || "gemini-2.5-flash";
      const response = await ai.models.generateContent({
        model: selectedModel,
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: type === 'json' ? 'application/json' : 'text/plain',
          ...config
        }
      });
      return { text: response.text };
    }

    // 2. IMÁGENES (Imagen 3)
    if (type === 'image') {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }]
        }
      });
      
      // Extraer Base64 de la respuesta
      const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
      if (part && part.inlineData) {
        return { imageBase64: `data:image/png;base64,${part.inlineData.data}` };
      }
      throw new HttpsError("internal", "No se pudo generar la imagen.");
    }

    // 3. VIDEO (Veo)
    if (type === 'video') {
      // Nota: Veo devuelve una operación que debe ser monitoreada.
      // Hacemos polling en el servidor para simplificarle la vida al frontend.
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '9:16'
        }
      });

      // Server-side polling loop
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        operation = await ai.operations.getVideosOperation({ operation });
      }

      const uri = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (!uri) throw new HttpsError("internal", "Falló la generación del video.");
      
      // Retornamos la URI con la llave adjunta para que el frontend pueda descargarla/verla
      // NOTA: Esto expone la llave temporalmente en la URL del video, pero es necesario para que el navegador lo cargue.
      // En una app bancaria real, descargaríamos el video al Storage y daríamos una URL firmada.
      return { videoUri: `${uri}&key=${apiKey}` };
    }

    throw new HttpsError("invalid-argument", "Tipo de generación no soportado.");

  } catch (error: any) {
    logger.error("AI Generation Error", error);
    throw new HttpsError("internal", error.message || "Error al consultar a Carmelita.");
  }
});

/**
 * STRIPE WEBHOOK
 */
export const stripeWebhook = onRequest(
  { secrets: [stripeSecret, stripeWebhookSecret] },
  async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = stripeWebhookSecret.value();
  const stripeKey = stripeSecret.value() || "sk_test_placeholder";

  const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

  let event: Stripe.Event;

  try {
    if (!sig || !endpointSecret) throw new Error("Missing Signature or Secret");
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err: any) {
    logger.error("Webhook Signature Error", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.client_reference_id;
    const paymentLinkId = session.payment_link as string;

    if (userId) {
      let creditsToAdd = 0;
      // Mapeo simple de Links a Créditos
      if (paymentLinkId === "plink_1SddBpED6vGk6VyxOUWQexul") creditsToAdd = 50;
      if (paymentLinkId === "plink_1SddEUED6vGk6VyxGJsp4UBm") creditsToAdd = 150;
      if (paymentLinkId === "plink_1Sdd6XED6vGk6VyxvL5pTv3c") creditsToAdd = 300;
      if (paymentLinkId === "plink_1Sdd8XED6vGk6VyxAfkq8TI9") creditsToAdd = 500;

      if (creditsToAdd > 0) {
         const userRef = admin.firestore().collection("users").doc(userId);
         await userRef.set({ 
            credits: admin.firestore.FieldValue.increment(creditsToAdd) 
         }, { merge: true });
         logger.info(`Credits added: ${creditsToAdd} to ${userId}`);
      }
    }
  }

  res.status(200).send("Recibido");
});