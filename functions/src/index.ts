import { onCall, onRequest, HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { GoogleGenAI } from "@google/genai";
import Stripe from "stripe";

// Initialize Stripe (Backend only)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2023-10-16", // Matching ^14.0.0 approximately
});

// Lazy initialization of AI to prevent global scope errors
const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("Missing API_KEY in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Secure AI Generation (Backend Proxy)
 * Used when we don't want to expose keys on the client or need heavy processing.
 */
export const generateSecureContent = onCall(async (request) => {
  try {
    const { model, prompt, config } = request.data;
    
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Debes iniciar sesión, mi niña.");
    }

    const ai = getAI();
    // Default to flash for backend tasks for speed/cost
    const selectedModel = model || "gemini-2.5-flash"; 
    
    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: prompt,
      config: config || {}
    });

    return { text: response.text };

  } catch (error: any) {
    logger.error("AI Generation Error", error);
    throw new HttpsError("internal", error.message);
  }
});

/**
 * Create Stripe Checkout Session for Credits
 */
export const createCheckoutSession = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Inicia sesión para comprar créditos.");
  }

  const { priceId, quantity } = request.data;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: quantity || 1,
        },
      ],
      success_url: "https://carmelita-app.web.app/success",
      cancel_url: "https://carmelita-app.web.app/cancel",
      metadata: {
        userId: request.auth.uid,
      }
    });

    return { url: session.url };
  } catch (error: any) {
    throw new HttpsError("internal", error.message);
  }
});
