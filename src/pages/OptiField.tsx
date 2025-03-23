
import React, { useState, useEffect, Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useMapService } from '@/services/optiField/mapService';
import ApiKeyDialog from '@/components/optifield/dialogs/ApiKeyDialog';
import ErrorState from '@/components/optifield/states/ErrorState';
import OptiFieldContent from '@/components/optifield/OptiFieldContent';

const OptiField = () => {
  const [trackingActive, setTrackingActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState<boolean>(false);
  const [apiKeyInput, setApiKeyInput] = useState<string>('AIzaSyDYNpssW98FUa34qBKCD6JdI7iWYnzFxyI');
  
  const {
    isError,
    mapApiKey,
    setAndSaveMapApiKey
  } = useMapService();
  
  const handleReload = () => {
    toast.loading('Rechargement en cours...');
    window.location.reload();
  };
  
  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      toast.loading('Enregistrement de la clé API...');
      setAndSaveMapApiKey(apiKeyInput.trim());
      setIsApiKeyDialogOpen(false);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } else {
      toast.error('Veuillez entrer une clé API valide');
    }
  };
  
  // Initialiser automatiquement la clé API
  useEffect(() => {
    if (!mapApiKey && !isLoading) {
      console.log('Setting default API key automatically');
      setAndSaveMapApiKey('AIzaSyDYNpssW98FUa34qBKCD6JdI7iWYnzFxyI');
      toast.success('Clé API Google Maps configurée automatiquement');
    }
  }, [mapApiKey, isLoading, setAndSaveMapApiKey]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    if (!isError && !isLoading && mapApiKey) {
      toast.success('OptiField chargé avec succès', {
        description: 'Toutes les fonctionnalités sont prêtes à être utilisées',
        duration: 3000,
      });
    }
  }, [isError, isLoading, mapApiKey]);
  
  // État de chargement
  if (isLoading) {
    return (
      <div className="flex min-h-screen">
        <Navbar />
        <div className="flex-1 md:ml-64 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="text-lg font-medium">Chargement d'OptiField...</p>
            <p className="text-sm text-muted-foreground">Préparation de vos données agricoles</p>
          </div>
        </div>
      </div>
    );
  }
  
  // État d'erreur
  if (isError) {
    return (
      <ErrorState 
        onConfigureApiKey={() => setIsApiKeyDialogOpen(true)} 
        onReload={handleReload} 
      />
    );
  }
  
  // État normal - tout est chargé et fonctionnel
  return (
    <div className="flex min-h-screen overflow-x-hidden bg-background">
      <Navbar />
      
      <main className="flex-1 md:ml-64">
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
          <OptiFieldContent 
            trackingActive={trackingActive}
            setTrackingActive={setTrackingActive}
          />
        </Suspense>
      </main>
      
      <ApiKeyDialog
        isOpen={isApiKeyDialogOpen}
        onOpenChange={setIsApiKeyDialogOpen}
        apiKeyInput={apiKeyInput}
        setApiKeyInput={setApiKeyInput}
        onSave={handleSaveApiKey}
      />
    </div>
  );
};

export default OptiField;
