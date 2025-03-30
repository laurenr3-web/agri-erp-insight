
import React from 'react';
import { Sidebar } from '@/components/ui/sidebar';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, WifiOff } from 'lucide-react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

interface ErrorStateProps {
  error: Error | null;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  const isOnline = useNetworkStatus();
  
  const handleReload = () => {
    console.log('Tentative de rechargement de la page...');
    
    // Charger les scripts de réparation avant de recharger
    try {
      const script = document.createElement('script');
      script.src = '/fix-all.js';
      document.head.appendChild(script);
      
      script.onload = () => {
        console.log('Scripts de réparation chargés, rechargement...');
        setTimeout(() => {
          window.location.reload();
        }, 500);
      };
    } catch (e) {
      console.error('Erreur lors du chargement des scripts de réparation:', e);
      window.location.reload();
    }
  };

  const errorMessage = error instanceof Error 
    ? error.message 
    : "Erreur inconnue";
    
  const isNodeError = errorMessage.includes('removeChild') || 
                     errorMessage.includes('Node');
                     
  const isNetworkError = errorMessage.includes('network') || 
                         errorMessage.includes('connexion') ||
                         errorMessage.includes('connection') ||
                         !isOnline;

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar className="border-r">
        <Navbar />
      </Sidebar>
      
      <div className="flex-1 p-6">
        <div className="w-full max-w-md mx-auto p-6 bg-card rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-destructive">
            {isNetworkError ? "Problème de connexion" : "Erreur de chargement des pièces"}
          </h2>
          
          <p className="mb-4">
            {isNetworkError
              ? "Il semble que vous soyez hors ligne ou que la connexion au serveur soit impossible."
              : isNodeError
                ? "Impossible de charger l'interface de gestion des pièces en raison d'une erreur de manipulation du DOM."
                : "Impossible de charger l'interface de gestion des pièces."}
          </p>
          
          <div className="bg-destructive/10 p-3 rounded-md mb-4">
            <p className="text-muted-foreground break-words text-sm">
              {errorMessage}
            </p>
          </div>
          
          <Button 
            onClick={handleReload} 
            className="mt-4 w-full flex items-center justify-center gap-2"
          >
            {isNetworkError ? (
              <>
                <WifiOff className="h-4 w-4" />
                Vérifier la connexion et réessayer
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Recharger la page
              </>
            )}
          </Button>
          
          {isNodeError && (
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Cette erreur est généralement causée par un problème de timing lors de l'ouverture/fermeture des dialogues.
              Le rechargement appliquera automatiquement des correctifs.
            </p>
          )}
          
          {isNetworkError && (
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Vérifiez votre connexion internet. Certaines fonctionnalités peuvent être disponibles en mode hors ligne.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
