
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FieldObservation, FieldObservationFormValues } from '@/types/FieldObservation';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { assertIsDefined } from '@/utils/typeAssertions';

export const useFieldObservations = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: observations = [], isLoading, error } = useQuery({
    queryKey: ['field-observations'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('interventions')
          .select('*')
          .not('observation_type', 'is', null)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Erreur lors du chargement des observations:', error);
          toast.error('Erreur lors du chargement des observations');
          throw error;
        }

        return data as FieldObservation[];
      } catch (err) {
        console.error('Exception lors du chargement des observations:', err);
        throw err;
      }
    }
  });

  const createObservation = useMutation({
    mutationFn: async (values: FieldObservationFormValues) => {
      if (!user?.id) {
        toast.error('Vous devez être connecté pour créer une observation');
        throw new Error('User not authenticated');
      }

      try {
        // Récupérer la session active pour s'assurer que l'utilisateur est bien authentifié
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !sessionData.session) {
          console.error('Erreur de session:', sessionError);
          toast.error('Votre session a expiré. Veuillez vous reconnecter.');
          throw new Error('Session expired or invalid');
        }

        const userData = assertIsDefined(sessionData.session.user, 'Session user');
        
        // Créer une nouvelle intervention à partir de l'observation
        const { data, error } = await supabase
          .from('interventions')
          .insert({
            equipment_id: values.equipment_id,
            equipment: values.equipment,
            location: values.location || 'Non spécifiée',
            description: values.description || '',
            observation_type: values.observation_type,
            urgency_level: values.urgency_level,
            photos: values.photos || [],
            observer_id: userData.id,
            status: 'pending',
            priority: values.urgency_level === 'urgent' ? 'high' : (values.urgency_level === 'surveiller' ? 'medium' : 'low'),
            date: new Date().toISOString(),
            technician: 'À assigner',
            title: `Observation: ${values.equipment} - ${values.observation_type}`,
            owner_id: userData.id // Ajouter explicitement owner_id qui est probablement requis par RLS
          })
          .select();

        if (error) {
          console.error('Erreur de création de l\'observation:', error);
          throw error;
        }

        return data;
      } catch (error) {
        console.error('Erreur lors de la création de l\'observation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['field-observations'] });
      queryClient.invalidateQueries({ queryKey: ['interventions'] });
      toast.success('Observation enregistrée avec succès');
    },
    onError: (error: Error) => {
      console.error('Erreur mutation:', error);
      
      // Message d'erreur plus détaillé en fonction du type d'erreur
      if (error.message.includes('Session expired')) {
        toast.error('Votre session a expiré. Veuillez vous reconnecter.');
      } else if (error.message.includes('violates row-level security policy')) {
        toast.error("Vous n'avez pas les permissions nécessaires pour créer une observation.");
      } else if (error.message.includes('not-authorized')) {
        toast.error("Vous n'êtes pas autorisé à effectuer cette action.");
      } else {
        toast.error('Erreur lors de la création de l\'observation. Veuillez réessayer.');
      }
    }
  });

  return {
    observations,
    isLoading,
    error,
    createObservation
  };
};
