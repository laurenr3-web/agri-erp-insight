
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePart } from '@/services/supabase/parts';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export function useDeletePart() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (partId: number | string) => {
      console.log('Deleting part ID:', partId);
      return await deletePart(partId);
    },
    onSuccess: (_data, variables) => {
      // Invalidate and refetch parts query
      console.log('Successfully deleted part ID:', variables);
      
      // Invalidate the query to refresh the data
      queryClient.invalidateQueries({ queryKey: ['parts'] });
      
      toast({
        title: "Pièce supprimée",
        description: `La pièce a été supprimée avec succès.`,
      });
      
      // Force a page refresh to ensure UI is updated
      setTimeout(() => {
        window.location.reload();
      }, 500);
    },
    onError: (error: any) => {
      console.error('Error in deletePart mutation:', error);
      
      // Check if this is an RLS policy violation
      if (error.message && error.message.includes('row-level security')) {
        toast({
          title: "Erreur d'autorisation",
          description: "Vous ne pouvez supprimer que les pièces que vous avez créées.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erreur",
          description: error.message || "Une erreur est survenue lors de la suppression de la pièce",
          variant: "destructive",
        });
      }
    }
  });

  return mutation;
}
