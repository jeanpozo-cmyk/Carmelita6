import { getApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";

// --- CLIENTE SEGURO (Backend Proxy) ---
// Ya no usamos GoogleGenAI directamente aquí para no exponer VITE_API_KEY.
// Todo pasa por la Cloud Function 'generateSecureContent'.

const callSecureAI = async (payload: any): Promise<any> => {
  try {
    // Obtener la instancia de funciones asociada a la App inicializada en authService
    const functions = getFunctions(getApp()); 
    const generateSecure = httpsCallable(functions, 'generateSecureContent');
    
    const result: any = await generateSecure(payload);
    return result.data;
  } catch (error: any) {
    console.error("Secure AI Error:", error);
    // Manejo de errores amigable para la UI
    if (error.code === 'unauthenticated') {
      throw new Error("Sesión expirada. Por favor recarga.");
    }
    throw new Error("Carmelita está tomando una siesta (Error de conexión).");
  }
};

// --- Carmelita's Brain Functions ---

export const askCarmelita = async (
  prompt: string, 
  context: string = "general"
): Promise<string> => {
  try {
    const modelName = context === 'complex' ? 'gemini-3-pro-preview' : 'gemini-2.5-flash';

    const systemInstruction = `
      Eres Carmelita, una emprendedora experta en finanzas que ayuda a otras mujeres en México.
      
      TU PERSONALIDAD:
      - Eres esa amiga que "le sabe" a los números y te explica las cosas con un café en la mano.
      - Hablas de IGUAL a IGUAL. No eres un banco (aburrido), ni una tía regañona (condescendiente).
      - Tu misión es dar paz mental y claridad, quitando el miedo al dinero.

      CÓMO HABLAS:
      - Lenguaje: Súper claro, coloquial y mexicano (pero educado). Ej: "Oye, aquí hay un tema", "Vamos a cuadrar esto", "No te me agüites", "Echale ojo a esto".
      - CERO "PALABRAS DE BANCO": Evita términos como "optimización de pasivos", "índice de morosidad". Mejor di: "bajarle a las deudas", "pagos atrasados".
      
      Contexto actual: ${context}.
    `;

    const data = await callSecureAI({
      type: 'text',
      model: modelName,
      prompt: prompt,
      systemInstruction: systemInstruction
    });

    return data.text || "Oye, se me fue la señal. ¿Me lo repites?";

  } catch (error) {
    return "Ando en mantenimiento un ratito (Error de conexión).";
  }
};

export const generateAgencyImage = async (prompt: string): Promise<string | null> => {
  try {
    const data = await callSecureAI({
      type: 'image',
      prompt: prompt
    });
    return data.imageBase64 || null;
  } catch (e) {
    console.error("Image gen error", e);
    return null;
  }
};

export const generateAgencyVideo = async (prompt: string): Promise<string> => {
  try {
    const data = await callSecureAI({
      type: 'video',
      prompt: prompt
    });
    return data.videoUri; // La URI ya viene firmada desde el backend
  } catch (e) {
    console.error("Video gen error", e);
    throw e;
  }
};

// --- Specialized Tools ---

export const generateMarketingStrategy = async (product: string): Promise<any> => {
  try {
    const prompt = `Actúa como una estratega de marketing digital muy crack.
    Diseña una estrategia para vender: "${product}".
    Dame la respuesta en JSON.
    La estructura debe tener:
    - objetivo (string): Objetivo claro y alcanzable.
    - segmentacion (object): { perfil: string, intereses: string[], dolor: string }
    - tono (string): Cómo hablarles.
    - canales (string[]): Dónde poner los anuncios.
    - pasos (string[]): 5 pasos prácticos.
    `;

    const data = await callSecureAI({
      type: 'json',
      model: 'gemini-2.5-flash',
      prompt: prompt
    });

    if (data.text) {
      // Limpieza básica por si el modelo devuelve markdown ```json ... ```
      const cleanText = data.text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanText);
    }
    throw new Error("No data");
  } catch (e) {
    console.error("Strategy Gen Error", e);
    return null;
  }
}

export const analyzeCreditRisk = async (loanDetails: string): Promise<{risk: 'LOW'|'MEDIUM'|'HIGH', advice: string}> => {
  try {
    const prompt = `Analiza este préstamo como una amiga experta en finanzas: ${loanDetails}.
    Evalúa si conviene (Riesgo Bajo/Medio/Alto) y da un consejo corto y directo, sin palabras raras. Formato: RIESGO|CONSEJO`;
    
    const data = await callSecureAI({
      type: 'text',
      model: 'gemini-2.5-flash',
      prompt: prompt
    });

    const text = data.text || "";
    const [riskRaw, advice] = text.split('|');
    let risk: any = 'HIGH';
    if (riskRaw?.includes('Bajo') || riskRaw?.includes('LOW')) risk = 'LOW';
    if (riskRaw?.includes('Medio') || riskRaw?.includes('MEDIUM')) risk = 'MEDIUM';
    
    return { risk, advice: advice || text };
  } catch (e) {
    return { risk: 'HIGH', advice: "No pude revisarlo bien, mejor espera un poco." };
  }
};

export const generateClientMessage = async (clientName: string, situation: string): Promise<string> => {
  return askCarmelita(`Ayúdame a escribir un WhatsApp para mi cliente ${clientName}. La situación es: ${situation}. Que suene profesional pero con buena onda, para vender sin ser pesada.`, "ventas");
};