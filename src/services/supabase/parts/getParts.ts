
import { supabase } from '@/integrations/supabase/client';
import { Part } from '@/types/Part';
import { partsData } from '@/data/partsData';

export async function getParts(): Promise<Part[]> {
  console.log('🔍 Fetching all parts from Supabase parts_inventory table...');
  
  try {
    // Get the current user ID from the session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError.message);
      throw new Error('Erreur de récupération de session');
    }
    
    const userId = sessionData.session?.user?.id;
    
    // If user is not authenticated, handle gracefully
    if (!userId) {
      console.warn('Utilisateur non authentifié, retourne un tableau de pièces vide');
      return [];
    }
    
    console.log(`👤 Récupération des pièces pour l'utilisateur: ${userId}`);
    
    // Query parts from parts_inventory table
    const { data, error } = await supabase
      .from('parts_inventory')
      .select('*');
    
    if (error) {
      console.error('Erreur Supabase:', error);
      throw new Error(`Erreur lors de la récupération des pièces: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      console.log('Aucune pièce trouvée dans la base de données');
      return [];
    }
    
    console.log(`✅ ${data.length} pièce(s) trouvée(s)`);
    
    // Map the database fields to our Part interface
    return data.map(part => ({
      id: part.id,
      name: part.name,
      partNumber: part.part_number || '',
      category: part.category || '',
      manufacturer: part.supplier || '',
      compatibility: part.compatible_with || [],
      stock: part.quantity,
      price: part.unit_price !== null ? part.unit_price : 0,
      location: part.location || '',
      reorderPoint: part.reorder_threshold || 5,
      image: part.image_url || 'https://placehold.co/400x300/png?text=No+Image'
    }));
  } catch (error) {
    console.error('❌ Erreur critique dans getParts:', error);
    throw error;
  }
}
