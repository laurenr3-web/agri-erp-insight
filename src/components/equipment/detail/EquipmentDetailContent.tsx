
import React, { useState } from 'react';
import { EquipmentItem } from '../hooks/useEquipmentFilters';
import EquipmentHeader from './EquipmentHeader';
import EditEquipmentDialog from '../dialogs/EditEquipmentDialog';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { equipmentService } from '@/services/supabase/equipmentService';
import { useQueryClient } from '@tanstack/react-query';
import EquipmentTabs from '../details/EquipmentTabs';
import { Card, CardContent } from '@/components/ui/card';
import { EquipmentWearDisplay } from '../wear/EquipmentWearDisplay';
import EquipmentImageGallery from '../details/EquipmentImageGallery';
import { Separator } from '@/components/ui/separator';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface EquipmentDetailContentProps {
  equipment: EquipmentItem;
  onUpdate: (data: EquipmentItem) => Promise<void>;
}

const EquipmentDetailContent = ({ equipment, onUpdate }: EquipmentDetailContentProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [localEquipment, setLocalEquipment] = useState(equipment);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleEditEquipment = () => {
    setIsEditDialogOpen(true);
  };

  const handleEquipmentUpdate = async (updatedData: EquipmentItem) => {
    try {
      await onUpdate(updatedData);
      setLocalEquipment(updatedData);
      setIsEditDialogOpen(false);
      toast.success('Équipement mis à jour avec succès');
    } catch (error) {
      console.error('Error updating equipment:', error);
      toast.error('Impossible de mettre à jour cet équipement');
    }
  };
  
  const handleEquipmentDelete = async () => {
    try {
      setIsDeleting(true);
      
      // Convert ID to number if it's a string
      const equipmentId = typeof equipment.id === 'string' 
        ? parseInt(equipment.id, 10) 
        : equipment.id;
      
      console.log(`Attempting to delete equipment with ID: ${equipmentId}`);
      
      // Invalidate queries before deletion to prepare cache
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
      
      // Call the delete service
      await equipmentService.deleteEquipment(equipmentId);
      
      // Show success toast
      toast.success(`L'équipement ${equipment.name} a été supprimé avec succès`);
      
      // Navigate back to equipment list after successful deletion
      navigate('/equipment');
    } catch (error: any) {
      console.error('Error deleting equipment:', error);
      toast.error(`Impossible de supprimer cet équipement: ${error.message || 'Erreur inconnue'}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 pb-16 px-4 md:px-6 max-w-[1400px] mx-auto">
      <EquipmentHeader 
        equipment={localEquipment} 
        onEdit={handleEditEquipment}
        onDelete={handleEquipmentDelete}
        isDeleting={isDeleting}
      />
      
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <EquipmentImageGallery equipment={localEquipment} />
          <EquipmentWearDisplay equipment={localEquipment} />
        </div>
        
        <Card className="overflow-hidden h-fit">
          <CardContent className="p-4 md:p-6">
            <EquipmentTabs equipment={localEquipment} />
          </CardContent>
        </Card>
      </div>
      
      {isEditDialogOpen && (
        <EditEquipmentDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          equipment={localEquipment}
          onSubmit={handleEquipmentUpdate}
        />
      )}
    </div>
  );
};

export default EquipmentDetailContent;
