import { GoogleGenAI, GenerateContentResponse, Schema } from "@google/genai";

// SINGLETON PATTERN to prevent "White Screen" crash on import
let aiInstance: GoogleGenAI | null = null;

const getGeminiClient = (): GoogleGenAI => {
  if (aiInstance) return aiInstance;

  // Hybrid Key Detection:
  const apiKey = process.env.API_KEY || (import.meta as any).env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    console.error("CRITICAL: No Gemini API Key found. Please set VITE_GEMINI_API_KEY.");
    // We return a dummy client that throws on usage to prevent immediate crash, 
    // but the app should handle the error gracefully when calling methods.
    throw new Error("Carmelita está dormida (Falta API Key).");
  }

  aiInstance = new GoogleGenAI({ apiKey });
  return aiInstance;
};

// --- Carmelita's Brain Functions ---

export const askCarmelita = async (
  prompt: string, 
  context: string = "general"
): Promise<string> => {
  try {
    const ai = getGeminiClient();
    const modelName = context === 'complex' ? 'gemini-3-pro-preview' : 'gemini-2.5-flash';

    // UPDATED PERSONA: Professional, Empathetic, Peer-to-Peer
    const systemInstruction = `
      Eres Carmelita, una consultora financiera senior y mentora de negocios para mujeres emprendedoras en México.
      Tu tono es:
      1. Profesional pero cercano (como una socia experimentada).
      2. Empoderador: Tratas a la usuaria como una empresaria capaz, no como una niña.
      3. Directo y Estratégico: Te enfocas en la rentabilidad, el orden y el crecimiento.
      4. Mexicano Neutro: Usas modismos de negocios locales (SAT, facturas, flujo) con naturalidad.
      
      PROHIBIDO: Usar diminutivos condescendientes como "mi niña", "chiquita", "mi vida".
      EN SU LUGAR USA: "Socia", "Colega", "Emprendedora", o simplemente háblale de tú con respeto.
      
      Contexto actual: ${context}.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "Hubo un problema de conexión, socia. Intenta de nuevo.";

  } catch (error) {
    console.error("Gemini Error:", error);
    return "El sistema está en mantenimiento (Error de conexión).";
  }
};

export const generateAgencyImage = async (prompt: string): Promise<string | null> => {
  try {
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
       if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
       }
    }
    return null;
  } catch (e) {
    console.error("Image gen error", e);
    throw e;
  }
};

export const generateAgencyVideo = async (prompt: string): Promise<string> => {
  try {
    const ai = getGeminiClient();
    
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '9:16'
      }
    });

    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({operation});
    }

    const uri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!uri) throw new Error("No video URI");
    
    const key = process.env.API_KEY || (import.meta as any).env.VITE_GEMINI_API_KEY;
    return `${uri}&key=${key}`;

  } catch (e) {
    console.error("Video gen error", e);
    throw e;
  }
};

// --- New Specialized Tools ---

export const generateMarketingStrategy = async (product: string): Promise<any> => {
  try {
    const ai = getGeminiClient();
    
    const prompt = `Actúa como directora de marketing.
    Diseña una estrategia profesional para vender: "${product}".
    Dame la respuesta en JSON estrictamente.
    La estructura debe tener:
    - objetivo (string): Objetivo KPI SMART.
    - segmentacion (object): { perfil: string, intereses: string[], dolor: string (Pain Point) }
    - tono (string): Voz de marca sugerida.
    - canales (string[]): Canales de distribución.
    - pasos (string[]): 5 hitos tácticos para la ejecución.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("No data");
  } catch (e) {
    console.error("Strategy Gen Error", e);
    return null;
  }
}

export const analyzeCreditRisk = async (loanDetails: string): Promise<{risk: 'LOW'|'MEDIUM'|'HIGH', advice: string}> => {
  try {
    const ai = getGeminiClient();
    const prompt = `Analiza este crédito empresarial: ${loanDetails}. Evalúa riesgo financiero (Bajo/Medio/Alto) y da una recomendación ejecutiva corta. Formato: RIESGO|CONSEJO`;
    const response = await ai.models.generateContent({
       model: 'gemini-2.5-flash',
       contents: prompt
    });
    const text = response.text || "";
    const [riskRaw, advice] = text.split('|');
    let risk: any = 'HIGH';
    if (riskRaw?.includes('Bajo') || riskRaw?.includes('LOW')) risk = 'LOW';
    if (riskRaw?.includes('Medio') || riskRaw?.includes('MEDIUM')) risk = 'MEDIUM';
    
    return { risk, advice: advice || text };
  } catch (e) {
    return { risk: 'HIGH', advice: "No pude analizarlo, mejor espera." };
  }
};

export const generateClientMessage = async (clientName: string, situation: string): Promise<string> => {
  return askCarmelita(`Redacta un mensaje de WhatsApp profesional y persuasivo para el cliente ${clientName}. Objetivo: ${situation}. Tono: Negocios pero amable.`, "ventas");
};