
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EquipmentDetailLoadingProps {
  id?: string;
}

const EquipmentDetailLoading: React.FC<EquipmentDetailLoadingProps> = ({ id }) => {
  const navigate = useNavigate();
  
  return (
    <div className="max-w-7xl mx-auto">
      <Button 
        variant="outline" 
        size="sm" 
        className="mb-4"
        onClick={() => navigate('/equipment')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour aux équipements
      </Button>
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Chargement de l'équipement{id ? ` #${id}` : ''}...</p>
      </div>
    </div>
  );
};

export default EquipmentDetailLoading;
