
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { equipmentService, Equipment, EquipmentFilter } from '@/services/supabase/equipmentService';
import { useToast } from '@/hooks/use-toast';

export function useEquipmentData() {
  const [filters, setFilters] = useState<EquipmentFilter>({});
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Fetch equipment list with filters
  const { 
    data: equipment,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['equipment', filters],
    queryFn: () => equipmentService.getEquipment(filters),
  });
  
  // Fetch filter options
  const { 
    data: filterOptions 
  } = useQuery({
    queryKey: ['equipment-filter-options'],
    queryFn: () => equipmentService.getFilterOptions(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
  
  // Fetch equipment stats
  const { 
    data: stats 
  } = useQuery({
    queryKey: ['equipment-stats'],
    queryFn: () => equipmentService.getEquipmentStats(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Add equipment mutation with better logging
  const addEquipmentMutation = useMutation({
    mutationFn: (equipment: Omit<Equipment, 'id'>) => {
      console.log('📤 Sending equipment to Supabase:', equipment);
      return equipmentService.addEquipment(equipment);
    },
    onSuccess: (newEquipment) => {
      console.log('✅ Equipment successfully added:', newEquipment);
      
      // Update cache and refetch
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
      queryClient.invalidateQueries({ queryKey: ['equipment-stats'] });
      queryClient.invalidateQueries({ queryKey: ['equipment-filter-options'] });
      
      toast({
        title: 'Équipement ajouté',
        description: `${newEquipment.name} a été ajouté avec succès`,
      });
    },
    onError: (error: Error) => {
      console.error('❌ Error adding equipment:', error);
      toast({
        title: 'Erreur',
        description: `Impossible d'ajouter l'équipement: ${error.message}`,
        variant: 'destructive',
      });
    }
  });
  
  // Update equipment mutation
  const updateEquipmentMutation = useMutation({
    mutationFn: (equipment: Equipment) => 
      equipmentService.updateEquipment(equipment),
    onSuccess: (updatedEquipment) => {
      console.log('✅ Equipment successfully updated:', updatedEquipment);
      
      // Update cache and refetch
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
      queryClient.invalidateQueries({ queryKey: ['equipment', updatedEquipment.id] });
      queryClient.invalidateQueries({ queryKey: ['equipment-stats'] });
      
      toast({
        title: 'Équipement mis à jour',
        description: `${updatedEquipment.name} a été mis à jour avec succès`,
      });
    },
    onError: (error: Error) => {
      console.error('❌ Error updating equipment:', error);
      toast({
        title: 'Erreur',
        description: `Impossible de mettre à jour l'équipement: ${error.message}`,
        variant: 'destructive',
      });
    }
  });
  
  // Delete equipment mutation
  const deleteEquipmentMutation = useMutation({
    mutationFn: (equipmentId: number) => equipmentService.deleteEquipment(equipmentId),
    onSuccess: (_, equipmentId) => {
      console.log('✅ Equipment successfully deleted, ID:', equipmentId);
      
      // Update cache by REMOVING the deleted item
      queryClient.setQueryData(['equipment', equipmentId], undefined);
      // Force invalidate ALL equipment-related queries to ensure they refetch
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
      queryClient.invalidateQueries({ queryKey: ['equipment-stats'] });
      queryClient.invalidateQueries({ queryKey: ['equipment-filter-options'] });
      
      toast({
        title: 'Équipement supprimé',
        description: `L'équipement a été supprimé avec succès`,
      });
      
      // Explicitement rafraîchir la liste des équipements
      setTimeout(() => {
        refetch();
      }, 100); // Add a small delay to ensure database operations complete
    },
    onError: (error: Error) => {
      console.error('❌ Error deleting equipment:', error);
      toast({
        title: 'Erreur',
        description: `Impossible de supprimer l'équipement: ${error.message}`,
        variant: 'destructive',
      });
    }
  });
  
  // Get equipment by ID
  const getEquipmentById = (id: number) => {
    return useQuery({
      queryKey: ['equipment', id],
      queryFn: () => equipmentService.getEquipmentById(id),
    });
  };
  
  // Get maintenance history for an equipment
  const getMaintenanceHistory = (equipmentId: number) => {
    return useQuery({
      queryKey: ['equipment-maintenance', equipmentId],
      queryFn: () => equipmentService.getEquipmentMaintenanceHistory(equipmentId),
      enabled: !!equipmentId,
    });
  };
  
  // Search equipment
  const searchEquipment = async (searchTerm: string) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  };
  
  // Update filters
  const updateFilters = (newFilters: Partial<EquipmentFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({});
  };
  
  return {
    equipment,
    filters,
    filterOptions,
    stats,
    isLoading,
    isError,
    error,
    refetch,
    searchEquipment,
    updateFilters,
    resetFilters,
    addEquipment: (equipment: Omit<Equipment, 'id'>) => 
      addEquipmentMutation.mutate(equipment),
    updateEquipment: (equipment: Equipment) => 
      updateEquipmentMutation.mutate(equipment),
    deleteEquipment: (equipmentId: number) => 
      deleteEquipmentMutation.mutate(equipmentId),
    getEquipmentById,
    getMaintenanceHistory,
    isAdding: addEquipmentMutation.isPending,
    isUpdating: updateEquipmentMutation.isPending,
    isDeleting: deleteEquipmentMutation.isPending
  };
}
