
import { openai } from '../openai/client';
import { toast } from 'sonner';

export interface PartTechnicalInfo {
  function: string;
  installation: string;
  symptoms: string;
  maintenance: string;
  compatibleEquipment: string[];
}

export async function getPartInfo(partNumber: string, contextInfo?: string): Promise<PartTechnicalInfo> {
  try {
    console.log(`Recherche d'informations pour la pièce: ${partNumber}`);
    if (contextInfo) {
      console.log(`Contexte additionnel: ${contextInfo}`);
    }
    
    // Construction du prompt avec contexte si disponible
    const userPrompt = `Fournissez toutes les informations disponibles sur la pièce agricole avec référence "${partNumber}"${
      contextInfo ? ` (${contextInfo})` : ''
    }.
    
    Incluez:
    1. Sa fonction et utilisation
    2. Les étapes détaillées d'installation
    3. Les symptômes de défaillance qui indiquent qu'elle doit être remplacée
    4. Les recommandations d'entretien et de maintenance
    5. Les équipements compatibles
    
    Si vous n'avez pas d'information précise sur cette référence, utilisez votre expertise pour analyser le format du numéro
    et suggérer de quel type de pièce il pourrait s'agir, et pour quel fabricant.`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Vous êtes un expert en pièces détachées agricoles avec une connaissance approfondie des équipements, 
          numérotation de pièces et spécifications techniques. Répondez en français avec des informations précises et détaillées.`
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      response_format: { type: "json_object" }
    });
    
    // Parsing de la réponse
    const content = response.choices[0].message.content;
    console.log("Réponse brute GPT-4o:", content);
    
    try {
      const parsed = JSON.parse(content);
      return {
        function: parsed.function || "Information non disponible",
        installation: parsed.installation || "Information non disponible",
        symptoms: parsed.symptoms || "Information non disponible",
        maintenance: parsed.maintenance || "Information non disponible",
        compatibleEquipment: Array.isArray(parsed.compatibleEquipment) 
          ? parsed.compatibleEquipment 
          : []
      };
    } catch (parseError) {
      console.error("Erreur de parsing:", parseError);
      return {
        function: "Erreur lors du traitement de la réponse",
        installation: "Information non disponible",
        symptoms: "Information non disponible",
        maintenance: "Information non disponible",
        compatibleEquipment: []
      };
    }
  } catch (error) {
    console.error("Erreur API OpenAI:", error);
    
    // Notification utilisateur
    toast.error("Erreur lors de la recherche", {
      description: error.message
    });
    
    return {
      function: `Erreur lors de la recherche: ${error.message}`,
      installation: "Information non disponible",
      symptoms: "Information non disponible",
      maintenance: "Information non disponible",
      compatibleEquipment: []
    };
  }
}
