
import { supabase } from '@/integrations/supabase/client';
import { MaintenanceTask, MaintenanceStatus, MaintenanceType } from '@/hooks/maintenance/maintenanceSlice';
import type { MaintenancePriority } from '@/hooks/maintenance/maintenanceSlice';
import { MaintenancePlan, MaintenanceFrequency, MaintenanceUnit } from '@/hooks/maintenance/useMaintenancePlanner';

// Types export using the correct syntax for 'isolatedModules' mode
export type { MaintenanceTask, MaintenancePriority, MaintenanceStatus, MaintenanceType };

/**
 * Service pour gérer les tâches de maintenance
 */
export const maintenanceService = {
  /**
   * Récupère toutes les tâches de maintenance
   */
  async getTasks(): Promise<MaintenanceTask[]> {
    try {
      const { data, error } = await supabase
        .from('maintenance_tasks')
        .select('*')
        .order('due_date', { ascending: true });
        
      if (error) throw error;
      
      // Transformer les données de la base en objets MaintenanceTask
      return (data || []).map(task => ({
        id: task.id,
        title: task.title,
        equipment: task.equipment,
        equipmentId: task.equipment_id,
        type: task.type as MaintenanceType,
        status: task.status as MaintenanceStatus,
        priority: task.priority as MaintenancePriority,
        dueDate: new Date(task.due_date),
        completedDate: task.completed_date ? new Date(task.completed_date) : undefined,
        engineHours: task.estimated_duration || 0,
        actualDuration: task.actual_duration,
        assignedTo: task.assigned_to || '',
        notes: task.notes || ''
      }));
    } catch (error: any) {
      console.error('Erreur lors de la récupération des tâches de maintenance:', error);
      throw error;
    }
  },
  
  /**
   * Récupère les tâches de maintenance pour un équipement spécifique
   */
  async getTasksForEquipment(equipmentId: number): Promise<MaintenanceTask[]> {
    try {
      const { data, error } = await supabase
        .from('maintenance_tasks')
        .select('*')
        .eq('equipment_id', equipmentId)
        .order('due_date', { ascending: true });
        
      if (error) throw error;
      
      // Transformer les données de la base en objets MaintenanceTask
      return (data || []).map(task => ({
        id: task.id,
        title: task.title,
        equipment: task.equipment,
        equipmentId: task.equipment_id,
        type: task.type as MaintenanceType,
        status: task.status as MaintenanceStatus,
        priority: task.priority as MaintenancePriority,
        dueDate: new Date(task.due_date),
        completedDate: task.completed_date ? new Date(task.completed_date) : undefined,
        engineHours: task.estimated_duration || 0,
        actualDuration: task.actual_duration,
        assignedTo: task.assigned_to || '',
        notes: task.notes || ''
      }));
    } catch (error: any) {
      console.error(`Erreur lors de la récupération des tâches pour l'équipement ${equipmentId}:`, error);
      throw error;
    }
  },
  
  /**
   * Ajoute une nouvelle tâche de maintenance
   */
  async addTask(task: Omit<MaintenanceTask, 'id'>): Promise<MaintenanceTask> {
    try {
      // Préparer les données pour Supabase
      const dbTask = {
        title: task.title,
        equipment: task.equipment,
        equipment_id: task.equipmentId,
        type: task.type,
        status: task.status,
        priority: task.priority,
        due_date: task.dueDate.toISOString(),
        estimated_duration: task.engineHours,
        assigned_to: task.assignedTo,
        notes: task.notes
      };
      
      const { data, error } = await supabase
        .from('maintenance_tasks')
        .insert(dbTask)
        .select()
        .single();
        
      if (error) throw error;
      
      // Transformer les données de la base en objet MaintenanceTask
      return {
        id: data.id,
        title: data.title,
        equipment: data.equipment,
        equipmentId: data.equipment_id,
        type: data.type as MaintenanceType,
        status: data.status as MaintenanceStatus,
        priority: data.priority as MaintenancePriority,
        dueDate: new Date(data.due_date),
        completedDate: data.completed_date ? new Date(data.completed_date) : undefined,
        engineHours: data.estimated_duration || 0,
        actualDuration: data.actual_duration,
        assignedTo: data.assigned_to || '',
        notes: data.notes || ''
      };
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout d\'une tâche de maintenance:', error);
      throw error;
    }
  },
  
  /**
   * Met à jour le statut d'une tâche de maintenance
   */
  async updateTaskStatus(taskId: number, status: MaintenanceStatus): Promise<void> {
    try {
      const { error } = await supabase
        .from('maintenance_tasks')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', taskId);
        
      if (error) throw error;
    } catch (error: any) {
      console.error(`Erreur lors de la mise à jour du statut de la tâche ${taskId}:`, error);
      throw error;
    }
  },
  
  /**
   * Marque une tâche comme complétée avec des détails supplémentaires
   */
  async completeTask(taskId: number, completionData: {
    completedDate: Date;
    actualDuration: number;
    notes?: string;
    technician?: string;
  }): Promise<void> {
    try {
      const { completedDate, actualDuration, notes, technician } = completionData;
      
      const updateData: any = {
        status: 'completed' as MaintenanceStatus,
        completed_date: completedDate.toISOString(),
        actual_duration: actualDuration,
        updated_at: new Date().toISOString()
      };
      
      if (notes) updateData.notes = notes;
      if (technician) updateData.assigned_to = technician;
      
      const { error } = await supabase
        .from('maintenance_tasks')
        .update(updateData)
        .eq('id', taskId);
        
      if (error) throw error;
    } catch (error: any) {
      console.error(`Erreur lors de la complétion de la tâche ${taskId}:`, error);
      throw error;
    }
  },
  
  /**
   * Met à jour une tâche de maintenance
   */
  async updateTask(taskId: number, updates: Partial<MaintenanceTask>): Promise<void> {
    try {
      // Préparer les données pour Supabase
      const dbUpdates: any = {};
      
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.equipment !== undefined) dbUpdates.equipment = updates.equipment;
      if (updates.equipmentId !== undefined) dbUpdates.equipment_id = updates.equipmentId;
      if (updates.type !== undefined) dbUpdates.type = updates.type;
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
      if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate.toISOString();
      if (updates.completedDate !== undefined) dbUpdates.completed_date = updates.completedDate.toISOString();
      if (updates.engineHours !== undefined) dbUpdates.estimated_duration = updates.engineHours;
      if (updates.actualDuration !== undefined) dbUpdates.actual_duration = updates.actualDuration;
      if (updates.assignedTo !== undefined) dbUpdates.assigned_to = updates.assignedTo;
      if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
      
      // Ajouter la date de mise à jour
      dbUpdates.updated_at = new Date().toISOString();
      
      const { error } = await supabase
        .from('maintenance_tasks')
        .update(dbUpdates)
        .eq('id', taskId);
        
      if (error) throw error;
    } catch (error: any) {
      console.error(`Erreur lors de la mise à jour de la tâche ${taskId}:`, error);
      throw error;
    }
  },
  
  /**
   * Supprime une tâche de maintenance
   */
  async deleteTask(taskId: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('maintenance_tasks')
        .delete()
        .eq('id', taskId);
        
      if (error) throw error;
    } catch (error: any) {
      console.error(`Erreur lors de la suppression de la tâche ${taskId}:`, error);
      throw error;
    }
  },

  /**
   * Ajoute un nouveau plan de maintenance
   */
  async addMaintenancePlan(plan: Omit<MaintenancePlan, 'id'>): Promise<MaintenancePlan> {
    try {
      // Récupérer l'utilisateur actuel
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;
      
      // Préparer les données pour Supabase
      const dbPlan = {
        title: plan.title,
        description: plan.description,
        equipment_id: plan.equipmentId,
        equipment_name: plan.equipmentName,
        frequency: plan.frequency,
        interval: plan.interval,
        unit: plan.unit,
        type: plan.type,
        priority: plan.priority,
        engine_hours: plan.engineHours,
        next_due_date: plan.nextDueDate.toISOString(),
        last_performed_date: plan.lastPerformedDate ? plan.lastPerformedDate.toISOString() : null,
        assigned_to: plan.assignedTo,
        created_by: userId,
        active: plan.active
      };
      
      const { data, error } = await supabase
        .from('maintenance_plans')
        .insert(dbPlan)
        .select()
        .single();
        
      if (error) throw error;
      
      // Transformer les données de la base en objet MaintenancePlan
      return {
        id: Number(data.id),
        title: data.title,
        description: data.description,
        equipmentId: Number(data.equipment_id),
        equipmentName: data.equipment_name,
        frequency: data.frequency as MaintenanceFrequency,
        interval: Number(data.interval),
        unit: data.unit as MaintenanceUnit,
        type: data.type as MaintenanceType,
        priority: data.priority as MaintenancePriority,
        engineHours: Number(data.engine_hours),
        nextDueDate: new Date(data.next_due_date),
        lastPerformedDate: data.last_performed_date ? new Date(data.last_performed_date) : undefined,
        assignedTo: data.assigned_to,
        active: Boolean(data.active)
      };
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout d\'un plan de maintenance:', error);
      throw error;
    }
  },

  /**
   * Récupère tous les plans de maintenance
   */
  async getMaintenancePlans(): Promise<MaintenancePlan[]> {
    try {
      const { data, error } = await supabase
        .from('maintenance_plans')
        .select('*')
        .order('next_due_date', { ascending: true });
        
      if (error) throw error;
      
      // Transformer les données de la base en objets MaintenancePlan
      return (data || []).map(plan => ({
        id: Number(plan.id),
        title: plan.title,
        description: plan.description,
        equipmentId: Number(plan.equipment_id),
        equipmentName: plan.equipment_name,
        frequency: plan.frequency as MaintenanceFrequency,
        interval: Number(plan.interval),
        unit: plan.unit as MaintenanceUnit,
        type: plan.type as MaintenanceType,
        priority: plan.priority as MaintenancePriority,
        engineHours: Number(plan.engine_hours),
        nextDueDate: new Date(plan.next_due_date),
        lastPerformedDate: plan.last_performed_date ? new Date(plan.last_performed_date) : undefined,
        assignedTo: plan.assigned_to,
        active: Boolean(plan.active)
      }));
    } catch (error: any) {
      console.error('Erreur lors de la récupération des plans de maintenance:', error);
      throw error;
    }
  },

  /**
   * Récupère les plans de maintenance pour un équipement spécifique
   */
  async getMaintenancePlansForEquipment(equipmentId: number): Promise<MaintenancePlan[]> {
    try {
      const { data, error } = await supabase
        .from('maintenance_plans')
        .select('*')
        .eq('equipment_id', equipmentId)
        .order('next_due_date', { ascending: true });
        
      if (error) throw error;
      
      // Transformer les données de la base en objets MaintenancePlan
      return (data || []).map(plan => ({
        id: Number(plan.id),
        title: plan.title,
        description: plan.description,
        equipmentId: Number(plan.equipment_id),
        equipmentName: plan.equipment_name,
        frequency: plan.frequency as MaintenanceFrequency,
        interval: Number(plan.interval),
        unit: plan.unit as MaintenanceUnit,
        type: plan.type as MaintenanceType,
        priority: plan.priority as MaintenancePriority,
        engineHours: Number(plan.engine_hours),
        nextDueDate: new Date(plan.next_due_date),
        lastPerformedDate: plan.last_performed_date ? new Date(plan.last_performed_date) : undefined,
        assignedTo: plan.assigned_to,
        active: Boolean(plan.active)
      }));
    } catch (error: any) {
      console.error(`Erreur lors de la récupération des plans pour l'équipement ${equipmentId}:`, error);
      throw error;
    }
  },

  /**
   * Met à jour un plan de maintenance
   */
  async updateMaintenancePlan(id: number, updates: Partial<MaintenancePlan>): Promise<void> {
    try {
      // Préparer les données pour Supabase
      const dbUpdates: any = {};
      
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.frequency !== undefined) dbUpdates.frequency = updates.frequency;
      if (updates.interval !== undefined) dbUpdates.interval = updates.interval;
      if (updates.unit !== undefined) dbUpdates.unit = updates.unit;
      if (updates.type !== undefined) dbUpdates.type = updates.type;
      if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
      if (updates.engineHours !== undefined) dbUpdates.engine_hours = updates.engineHours;
      if (updates.nextDueDate !== undefined) dbUpdates.next_due_date = updates.nextDueDate.toISOString();
      if (updates.lastPerformedDate !== undefined) dbUpdates.last_performed_date = updates.lastPerformedDate.toISOString();
      if (updates.assignedTo !== undefined) dbUpdates.assigned_to = updates.assignedTo;
      if (updates.active !== undefined) dbUpdates.active = updates.active;
      
      // Ajouter la date de mise à jour
      dbUpdates.updated_at = new Date().toISOString();
      
      const { error } = await supabase
        .from('maintenance_plans')
        .update(dbUpdates)
        .eq('id', id);
        
      if (error) throw error;
    } catch (error: any) {
      console.error(`Erreur lors de la mise à jour du plan ${id}:`, error);
      throw error;
    }
  },

  /**
   * Supprime un plan de maintenance
   */
  async deleteMaintenancePlan(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('maintenance_plans')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    } catch (error: any) {
      console.error(`Erreur lors de la suppression du plan ${id}:`, error);
      throw error;
    }
  }
};
