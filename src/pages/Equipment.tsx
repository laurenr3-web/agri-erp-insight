
import React, { useMemo } from "react";
import MainLayout from "@/ui/layouts/MainLayout";
import EquipmentPageContent from '@/components/equipment/page/EquipmentPageContent';
import { useEquipmentData } from '@/hooks/equipment/useEquipmentData';
import { EquipmentItem } from '@/components/equipment/hooks/useEquipmentFilters';
import type { Equipment } from '@/services/supabase/equipmentService';
import { LayoutWrapper } from "@/components/layout/LayoutWrapper";
import { PageHeader } from "@/components/layout/PageHeader";
import { useFarmId } from "@/hooks/useFarmId";
import NoFarmAccess from "@/components/common/NoFarmAccess";
import EquipmentDialogs from '@/components/equipment/dialogs/EquipmentDialogs';
import { logger } from "@/utils/logger";

const Equipment = () => {
  const { isLoading: farmLoading, noAccess } = useFarmId();
  const equipmentQuery = useEquipmentData();
  const { isLoading } = equipmentQuery;
  const equipmentData = equipmentQuery.data || [];

  // Transform Equipment objects to EquipmentItem objects
  const transformedEquipment = useMemo(() => {
    if (!equipmentData) return [];
    
    return equipmentData.map((item: Equipment) => ({
      id: item.id,
      name: item.name,
      type: item.type || 'Unknown',
      category: item.category || 'Uncategorized',
      manufacturer: item.manufacturer || '',
      model: item.model || '',
      year: item.year || 0,
      status: item.status || 'unknown',
      location: item.location || '',
      image: item.image || '',
      serialNumber: item.serialNumber || '',
      purchaseDate: item.purchaseDate 
        ? (typeof item.purchaseDate === 'object' 
           ? item.purchaseDate.toISOString() 
           : String(item.purchaseDate))
        : '',
      // Add the required properties that EquipmentItem needs
      usage: { 
        hours: item.valeur_actuelle || 0, 
        target: 500 // Default value
      }, 
      nextService: { 
        type: 'Regular maintenance', 
        due: 'In 30 days' 
      }
    }));
  }, [equipmentData]);

  if (farmLoading || isLoading) {
    return (
      <MainLayout>
        <LayoutWrapper>
          <div className="flex items-center justify-center min-h-[80vh]">
            <p>Chargement des équipements...</p>
          </div>
        </LayoutWrapper>
      </MainLayout>
    );
  }

  if (noAccess) {
    return (
      <MainLayout>
        <LayoutWrapper>
          <NoFarmAccess />
        </LayoutWrapper>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <LayoutWrapper>
        <PageHeader 
          title="Équipements" 
          description="Gérez votre parc matériel et son état"
        />
        <EquipmentPageContent 
          equipment={transformedEquipment} 
          isLoading={isLoading} 
        />
        {/* Add the EquipmentDialogs component for adding and details dialogs */}
        <EquipmentDialogs />
      </LayoutWrapper>
    </MainLayout>
  );
};

export default Equipment;
