
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';

interface TechnicalInfoStatusProps {
  openAIStatus: {
    isApiKeyValid: boolean | null;
    isLoading?: boolean;
    isConnecting?: boolean;
    error?: string | null;
    connectionError?: string | null;
  };
}

export const TechnicalInfoStatus: React.FC<TechnicalInfoStatusProps> = ({
  openAIStatus
}) => {
  const isLoading = openAIStatus.isLoading || openAIStatus.isConnecting;
  const errorMessage = openAIStatus.error || openAIStatus.connectionError;
  
  if (isLoading) {
    return (
      <Alert>
        <Loader2 className="h-4 w-4 animate-spin" />
        <AlertDescription>
          Vérification de la connexion à OpenAI...
        </AlertDescription>
      </Alert>
    );
  }
  
  if (!openAIStatus.isApiKeyValid) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {errorMessage || "Clé API OpenAI manquante ou invalide. Configurez VITE_OPENAI_API_KEY dans .env.development"}
        </AlertDescription>
      </Alert>
    );
  }
  
  return null;
};
