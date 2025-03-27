
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import BasicInfoFields from '../form/BasicInfoFields';
import AdditionalInfoFields from '../form/AdditionalInfoFields';
import ImageField from '../form/ImageField';
import NotesField from '../form/NotesField';
import AddCategorySection from './form/AddCategorySection';
import { equipmentFormSchema, type EquipmentFormValues } from './form/EquipmentFormSchema';

interface EditEquipmentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  equipment: any;
  onSubmit: (data: any) => void;
}

const EditEquipmentDialog: React.FC<EditEquipmentDialogProps> = ({ 
  isOpen, 
  onOpenChange, 
  equipment, 
  onSubmit 
}) => {
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
  const [customCategories, setCustomCategories] = useState<string[]>([]);

  // Format equipment data for the form
  const defaultValues: EquipmentFormValues = {
    name: equipment.name,
    type: equipment.type,
    category: equipment.category.toLowerCase(),
    manufacturer: equipment.manufacturer,
    model: equipment.model,
    year: equipment.year.toString(),
    serialNumber: equipment.serialNumber,
    status: equipment.status,
    location: equipment.location,
    purchaseDate: new Date(equipment.purchaseDate).toISOString().split('T')[0],
    notes: equipment.notes || '',
    image: equipment.image,
  };

  const form = useForm<EquipmentFormValues>({
    resolver: zodResolver(equipmentFormSchema),
    defaultValues,
  });

  const handleFormSubmit = (data: EquipmentFormValues) => {
    // Convert form data back to equipment object format
    const updatedEquipment = {
      ...equipment,
      name: data.name,
      type: data.type,
      category: data.category.charAt(0).toUpperCase() + data.category.slice(1),
      manufacturer: data.manufacturer,
      model: data.model,
      year: parseInt(data.year),
      serialNumber: data.serialNumber,
      status: data.status,
      location: data.location,
      purchaseDate: data.purchaseDate,
      notes: data.notes,
      image: data.image,
    };
    
    onSubmit(updatedEquipment);
    toast.success('Equipment updated successfully');
  };

  const addNewCategory = (category: string) => {
    setCustomCategories([...customCategories, category]);
    form.setValue('category', category);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Equipment</DialogTitle>
          <DialogDescription>
            Update the information for this equipment
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BasicInfoFields 
              form={form}
              customCategories={customCategories}
              onAddCategoryClick={() => setIsAddCategoryDialogOpen(true)}
              language="en"
            />
            
            <AdditionalInfoFields 
              form={form}
              language="en"
            />
          </div>

          <ImageField form={form} />
          <NotesField form={form} />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Equipment</Button>
          </DialogFooter>
        </form>

        <AddCategorySection
          isOpen={isAddCategoryDialogOpen}
          onOpenChange={setIsAddCategoryDialogOpen}
          onAddCategory={addNewCategory}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditEquipmentDialog;
