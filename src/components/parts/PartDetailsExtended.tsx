
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Edit, Trash2, Info } from 'lucide-react';
import TechnicalInfoTab from './TechnicalInfoTab';
import { useToast } from '@/hooks/use-toast';
import { useDeletePart } from '@/hooks/parts';

// Use LocalPart or your interface Part according to your configuration
interface PartProps {
  part: any; // Replace with your real type
  onBack: () => void;
  onEdit: (part: any) => void;
  onDelete: (partId: string | number) => void;
}

const PartDetailsExtended = ({ part, onBack, onEdit, onDelete }: PartProps) => {
  const [activeTab, setActiveTab] = useState('details');
  const { toast } = useToast();
  const deleteMutation = useDeletePart();

  const handleDelete = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette pièce ?')) {
      // Use the deletion mutation directly for error handling
      deleteMutation.mutate(part.id, {
        onSuccess: () => {
          toast({
            title: "Pièce supprimée",
            description: `La pièce ${part.name} a été supprimée avec succès`,
          });
          // Navigate back after successful deletion
          onBack();
        },
        onError: (error: any) => {
          toast({
            title: "Erreur",
            description: error.message || "Erreur lors de la suppression de la pièce",
            variant: "destructive",
          });
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onEdit(part)}>
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer
          </Button>
        </div>
      </div>
      
      <h1 className="text-3xl font-bold">{part.name}</h1>
      <p className="text-muted-foreground">Référence: {part.reference}</p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="details" className="flex-1">Détails</TabsTrigger>
          <TabsTrigger value="technical" className="flex-1 flex items-center">
            <Info className="h-4 w-4 mr-2" />
            Informations techniques
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Détails de la pièce</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Référence</h3>
                  <p>{part.reference}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Fabricant</h3>
                  <p>{part.manufacturer}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Catégorie</h3>
                  <p>{part.category}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Compatibilité</h3>
                  <p>{Array.isArray(part.compatibleWith) 
                    ? part.compatibleWith.join(', ') 
                    : part.compatibleWith}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Quantité en stock</h3>
                  <p>{part.quantity || 0}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Stock minimum</h3>
                  <p>{part.minimumStock || 0}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Prix d'achat</h3>
                  <p>{part.purchasePrice ? `${part.purchasePrice} €` : 'Non défini'}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Emplacement</h3>
                  <p>{part.location || 'Non spécifié'}</p>
                </div>
              </div>
              
              {part.description && (
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Description</h3>
                  <p className="mt-1">{part.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="technical">
          <TechnicalInfoTab 
            partNumber={part.reference} 
            partName={part.name} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PartDetailsExtended;
