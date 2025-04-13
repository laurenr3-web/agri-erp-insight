
import { useState, useCallback } from 'react';
import { maintenanceService } from '@/services/supabase/maintenanceService';
import { toast } from 'sonner';
import { 
  MaintenancePlan, 
  MaintenancePlanViewModel,
  MaintenanceFrequency, 
  MaintenanceUnit, 
  MaintenanceType, 
  MaintenancePriority, 
  MaintenanceStatus,
  dbToViewModel,
  viewModelToDB
} from './types/maintenancePlanTypes';

export { 
  MaintenanceFrequency, 
  MaintenanceUnit, 
  MaintenanceType, 
  MaintenancePriority, 
  MaintenanceStatus,
  type MaintenancePlan,
  type MaintenancePlanViewModel 
};

export const useMaintenancePlanner = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [maintenancePlans, setMaintenancePlans] = useState<MaintenancePlanViewModel[]>([]);

  // Load maintenance plans
  const loadMaintenancePlans = useCallback(async () => {
    setIsLoading(true);
    try {
      const plans = await maintenanceService.getMaintenancePlans();
      const viewModels = plans.map(dbToViewModel);
      setMaintenancePlans(viewModels);
    } catch (error) {
      console.error('Error loading maintenance plans:', error);
      toast.error('Error loading maintenance plans');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create a maintenance plan
  const createMaintenancePlan = useCallback(async (plan: Omit<MaintenancePlanViewModel, "id">) => {
    setIsLoading(true);
    try {
      // Convert from ViewModel to DB model
      const dbPlan: Omit<MaintenancePlan, "id"> = {
        title: plan.title,
        description: plan.description,
        equipment_id: plan.equipmentId,
        equipment_name: plan.equipmentName,
        frequency: plan.frequency,
        interval: plan.interval,
        unit: plan.unit,
        next_due_date: plan.nextDueDate.toISOString(),
        last_performed_date: plan.lastPerformedDate ? plan.lastPerformedDate.toISOString() : undefined,
        type: plan.type,
        engine_hours: plan.engineHours,
        active: plan.active,
        priority: plan.priority,
        assigned_to: plan.assignedTo
      };
      
      const newPlan = await maintenanceService.addMaintenancePlan(dbPlan);
      const newViewModel = dbToViewModel(newPlan);
      setMaintenancePlans(prev => [...prev, newViewModel]);
      toast.success('Maintenance plan created successfully');
      return newViewModel;
    } catch (error) {
      console.error('Error creating maintenance plan:', error);
      toast.error('Error creating maintenance plan');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update a maintenance plan
  const updatePlan = useCallback(async (planId: number, updates: Partial<MaintenancePlanViewModel>) => {
    setIsLoading(true);
    try {
      // Convert updates from ViewModel to DB model format
      const dbUpdates: Partial<MaintenancePlan> = {};
      
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.equipmentId !== undefined) dbUpdates.equipment_id = updates.equipmentId;
      if (updates.equipmentName !== undefined) dbUpdates.equipment_name = updates.equipmentName;
      if (updates.frequency !== undefined) dbUpdates.frequency = updates.frequency;
      if (updates.interval !== undefined) dbUpdates.interval = updates.interval;
      if (updates.unit !== undefined) dbUpdates.unit = updates.unit;
      if (updates.nextDueDate !== undefined) dbUpdates.next_due_date = updates.nextDueDate.toISOString();
      if (updates.lastPerformedDate !== undefined) {
        dbUpdates.last_performed_date = updates.lastPerformedDate ? 
          updates.lastPerformedDate.toISOString() : undefined;
      }
      if (updates.type !== undefined) dbUpdates.type = updates.type;
      if (updates.engineHours !== undefined) dbUpdates.engine_hours = updates.engineHours;
      if (updates.active !== undefined) dbUpdates.active = updates.active;
      if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
      if (updates.assignedTo !== undefined) dbUpdates.assigned_to = updates.assignedTo;
      
      const updated = await maintenanceService.updateMaintenancePlan(planId, dbUpdates);
      
      if (updated) {
        const updatedViewModel = dbToViewModel(updated);
        setMaintenancePlans(prev => 
          prev.map(plan => plan.id === planId ? updatedViewModel : plan)
        );
      }
      toast.success('Maintenance plan updated successfully');
      return updated ? dbToViewModel(updated) : null;
    } catch (error) {
      console.error('Error updating maintenance plan:', error);
      toast.error('Error updating maintenance plan');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create a schedule from a maintenance plan - this function doesn't exist yet in the service,
  // so we'll handle this gracefully
  const createScheduleFromPlan = useCallback(async (plan: MaintenancePlanViewModel, endDate: Date) => {
    setIsLoading(true);
    try {
      // Since generateTasksFromPlan doesn't exist, we'll create a task directly
      const dbPlan = viewModelToDB(plan);
      
      const task = {
        title: plan.title,
        notes: plan.description,
        equipment: plan.equipmentName,
        equipment_id: plan.equipmentId,
        due_date: plan.nextDueDate.toISOString(),
        status: 'pending',
        priority: plan.priority,
        type: plan.type,
        assigned_to: plan.assignedTo
      };
      
      const newTask = await maintenanceService.addTask(task);
      toast.success(`New maintenance task scheduled`);
      return [newTask];
    } catch (error) {
      console.error('Error creating schedule from plan:', error);
      toast.error('Error creating maintenance schedule');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    maintenancePlans,
    loadMaintenancePlans,
    createMaintenancePlan,
    updatePlan,
    createScheduleFromPlan
  };
};
