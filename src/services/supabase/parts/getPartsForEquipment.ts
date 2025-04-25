
import { supabase } from '@/integrations/supabase/client';
import { Part } from '@/types/Part';
import { ensureNumberId } from '@/utils/typeGuards';

/**
 * Récupère les pièces compatibles avec un équipement spécifique
 * 
 * @param equipmentId L'ID de l'équipement
 * @returns Une promesse résolvant à un tableau de pièces
 */
export async function getPartsForEquipment(equipmentId: number | string): Promise<Part[]> {
  console.log('🔍 Recherche des pièces pour l\'équipement:', equipmentId);
  
  try {
    // Convert string id to number if needed
    const numericId = ensureNumberId(equipmentId);
    const equipmentIdStr = equipmentId.toString();
    
    // Récupérer d'abord les détails de l'équipement pour connaître son type et modèle
    const { data: equipment, error: equipmentError } = await supabase
      .from('equipment')
      .select('type, model, manufacturer')
      .eq('id', numericId)
      .single();
    
    if (equipmentError) {
      console.error('Erreur lors de la récupération des détails de l\'équipement:', equipmentError);
      throw equipmentError;
    }
    
    // Récupérer les pièces compatibles avec cet équipement
    // Cette requête utilise deux approches :
    // 1. Vérifier si l'ID de l'équipement est directement dans le tableau compatible_with
    // 2. Vérifier si le type ou modèle de l'équipement est mentionné dans le tableau
    const { data, error } = await supabase
      .from('parts_inventory')
      .select('*')
      .filter('compatible_with', 'cs', `{${equipmentIdStr}}`)
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Erreur lors de la récupération des pièces compatibles:', error);
      throw error;
    }
    
    // Chercher également les pièces compatibles par type/modèle si disponibles
    let textResults: any[] = [];
    if (equipment.type || equipment.model) {
      const searchTerms = [
        equipment.type,
        equipment.model,
        `${equipment.manufacturer} ${equipment.model}`
      ].filter(Boolean);

      // Créer une requête pour chaque terme de recherche
      for (const term of searchTerms) {
        const { data: textData, error: textError } = await supabase
          .from('parts_inventory')
          .select('*')
          .or(`compatible_with.cs.{${term}}`);

        if (!textError && textData) {
          textResults = [...textResults, ...textData];
        }
      }
    }
    
    // Combinaison des résultats et suppression des doublons
    const combinedResults = [...(data || []), ...textResults];
    const uniqueResults = combinedResults.filter((part, index, self) =>
      index === self.findIndex((p) => p.id === part.id)
    );
    
    // Convertir la réponse de la base de données en objets Part
    return uniqueResults.map(part => ({
      id: part.id,
      name: part.name,
      partNumber: part.part_number || '',
      reference: part.part_number || '',
      category: part.category || '',
      manufacturer: part.supplier || '',
      compatibility: part.compatible_with || [],
      compatibleWith: part.compatible_with || [],
      stock: part.quantity,
      quantity: part.quantity,
      price: part.unit_price !== null ? part.unit_price : 0,
      location: part.location || '',
      reorderPoint: part.reorder_threshold || 5,
      minimumStock: part.reorder_threshold || 5,
      image: part.image_url || 'https://placehold.co/100x100/png',
      imageUrl: part.image_url
    }));
  } catch (err) {
    console.error('Erreur inattendue lors de la récupération des pièces:', err);
    throw err;
  }
}
