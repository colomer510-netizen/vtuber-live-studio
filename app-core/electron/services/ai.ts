import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI: GoogleGenerativeAI | null = null;

export function initializeAI(apiKey: string) {
  genAI = new GoogleGenerativeAI(apiKey);
}

export async function generateAutoPilotResponse(context: string, userMessage: string) {
  if (!genAI) return "IA no inicializada.";

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });
    const prompt = `Eres un Avatar de VTuber interactivo. Contexto del stream: ${context}. El usuario dice: ${userMessage}. Responde de forma corta (1 oración) y amigable.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Error:", error);
    return "Error en la IA.";
  }
}
