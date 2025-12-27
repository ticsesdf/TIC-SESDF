
import { GoogleGenAI } from "@google/genai";
import { SurveyState } from "../types";

export const analyzeSurveyRoutine = async (data: SurveyState) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Analise a rotina de um gestor de saúde da SES-DF (APS) com base nos dados:
    Cargo na GSAP: ${data.profile.cargoGsap}
    UBS Vinculadas: ${data.profile.quantidadeUbs}
    Região: ${data.profile.regiaoGsap}
    Sistemas: ${data.selectedSystems.join(", ")}
    Confiança média nos dados (1-5): ${
      Object.values(data.evaluations).length > 0 
        ? (Object.values(data.evaluations).reduce((acc, curr) => acc + curr.confianca, 0) / Object.values(data.evaluations).length).toFixed(1)
        : "N/A"
    }
    Internet: ${data.profile.internetAcesso}
    Hardware: ${data.profile.computadoresQtd} (${data.profile.computadoresSuficiencia})
    Barreiras identificadas: ${Object.keys(data.barreiras).filter(k => data.barreiras[k] > 3).join(", ")}
    
    Forneça um parágrafo curto (3-4 linhas) em português com um insight estratégico sobre o nível de fragmentação tecnológica e uma recomendação de priorização para este gestor específico.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Obrigado pela participação. Seus dados ajudarão no diagnóstico da gestão digital do DF.";
  }
};
