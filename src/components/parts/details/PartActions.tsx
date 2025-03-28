
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Truck, X, Trash2 } from 'lucide-react';
import { Part } from '@/types/Part';

export interface PartActionsProps {
  part?: Part;
  onClose?: (e?: React.MouseEvent) => void;
  onEdit?: (e?: React.MouseEvent) => void;
  onOrder?: (e?: React.MouseEvent) => void;
  onDelete?: (e?: React.MouseEvent) => void;
}

const PartActions: React.FC<PartActionsProps> = ({
  part,
  onClose,
  onEdit,
  onOrder,
  onDelete
}) => {
  return (
    <div className="flex gap-2">
      {onClose && (
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4 mr-2" />
          Fermer
        </Button>
      )}
      {onEdit && (
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Modifier
        </Button>
      )}
      {onDelete && (
        <Button variant="destructive" size="sm" onClick={onDelete}>
          <Trash2 className="h-4 w-4 mr-2" />
          Supprimer
        </Button>
      )}
      {onOrder && (
        <Button variant="default" size="sm" onClick={onOrder}>
          <Truck className="h-4 w-4 mr-2" />
          Commander
        </Button>
      )}
    </div>
  );
};

export default PartActions;
