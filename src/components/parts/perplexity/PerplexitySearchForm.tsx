
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search } from 'lucide-react';

interface PerplexitySearchFormProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  manufacturer: string;
  setManufacturer: (value: string) => void;
  handleSearch: () => void;
  isLoading: boolean;
}

const PerplexitySearchForm: React.FC<PerplexitySearchFormProps> = ({
  searchQuery,
  setSearchQuery,
  manufacturer,
  setManufacturer,
  handleSearch,
  isLoading
}) => {
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <Input
        placeholder="Entrez un numéro de pièce (ex: JD6850)"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        className="flex-1"
      />
      <Input
        placeholder="Fabricant (optionnel)"
        value={manufacturer}
        onChange={(e) => setManufacturer(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        className="flex-1 sm:max-w-[200px]"
      />
      <Button onClick={handleSearch} disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <Search className="h-4 w-4 mr-2" />
        )}
        Rechercher
      </Button>
    </div>
  );
};

export default PerplexitySearchForm;
