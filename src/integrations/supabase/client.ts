
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { toast } from '@/hooks/use-toast';

// Utiliser les variables d'environnement ou les valeurs par défaut pour assurer le bon fonctionnement
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://cagmgtmeljxykyngxxmj.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhZ21ndG1lbGp4eWt5bmd4eG1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3NTAzNzksImV4cCI6MjA1ODMyNjM3OX0.3VFhuErdDDheXKX4djJvx4JzhSfpsApPu6hLl1bArUk";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Supabase environment variables are not set');
}

// Instancier le client Supabase avec des options optimisées
export const supabase = createClient<Database>(
  SUPABASE_URL as string, 
  SUPABASE_ANON_KEY as string,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    },
  }
);

// Vérifier que la connexion à Supabase fonctionne
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('Error connecting to Supabase:', error.message);
  } else {
    console.log('✅ Successfully connected to Supabase');
  }
});

export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    // Essayer une requête simple pour vérifier la connexion
    // Utilisons parts_inventory au lieu de user_profiles qui n'existe pas
    const { data, error } = await supabase.from('parts_inventory').select('id').limit(1);
    
    if (error) {
      console.error('Erreur de connexion Supabase:', error);
      toast({
        title: 'Problème de connexion à la base de données',
        description: "Certaines fonctionnalités peuvent être limitées. Réessayez plus tard.",
        variant: "destructive"
      });
      return false;
    }
    
    console.log('✅ Connexion Supabase réussie');
    return true;
  } catch (err) {
    console.error('Exception lors du test de connexion Supabase:', err);
    toast({
      title: 'Problème de connexion à la base de données',
      description: "Certaines fonctionnalités peuvent être limitées. Réessayez plus tard.",
      variant: "destructive"
    });
    return false;
  }
};
