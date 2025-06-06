
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { EquipmentFormValues } from '../equipmentFormTypes';
import NameField from './NameField';
import ModelField from './ModelField';
import CategoryField from './CategoryField';

interface BasicInfoFieldsProps {
  form: UseFormReturn<EquipmentFormValues>;
  customCategories: string[];
  onAddCategoryClick: () => void;
}

const BasicInfoFields: React.FC<BasicInfoFieldsProps> = ({ 
  form, 
  customCategories, 
  onAddCategoryClick 
}) => {
  return (
    <div className="space-y-4">
      <NameField form={form} />
      
      <ModelField form={form} />
      
      <CategoryField 
        form={form} 
        customCategories={customCategories} 
        onAddCategoryClick={onAddCategoryClick}
        label="Type d'équipement"
        placeholder="Sélectionner un type"
        addButtonText="Ajouter un type"
      />
    </div>
  );
};

export default BasicInfoFields;
