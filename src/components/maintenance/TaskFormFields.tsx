
import React from 'react';
import { CalendarIcon, UserPlus } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import { MaintenancePriority, MaintenanceType } from '@/hooks/maintenance/maintenanceSlice';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

interface TaskFormFieldsProps {
  title: string;
  setTitle: (title: string) => void;
  equipment: string;
  setEquipment: (equipment: string) => void;
  type: MaintenanceType;
  setType: (type: MaintenanceType) => void;
  priority: MaintenancePriority;
  setPriority: (priority: MaintenancePriority) => void;
  dueDate: Date;
  setDueDate: (date: Date) => void;
  engineHours: string;
  setEngineHours: (hours: string) => void;
  assignedTo: string;
  setAssignedTo: (staff: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
  equipmentOptions: Array<{ id: number; name: string }>;
  handleEquipmentChange: (value: string) => void;
  staffOptions: string[];
  onAddStaffClick: () => void;
  isLoading?: boolean;
  isLoadingStaff?: boolean;
}

const TaskFormFields: React.FC<TaskFormFieldsProps> = ({
  title,
  setTitle,
  equipment,
  type,
  setType,
  priority,
  setPriority,
  dueDate,
  setDueDate,
  engineHours,
  setEngineHours,
  assignedTo,
  setAssignedTo,
  notes,
  setNotes,
  equipmentOptions,
  handleEquipmentChange,
  staffOptions,
  onAddStaffClick,
  isLoading = false,
  isLoadingStaff = false,
}) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="title">Titre de la tâche</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="equipment">Équipement</Label>
          {isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select value={equipment} onValueChange={handleEquipmentChange} required>
              <SelectTrigger id="equipment">
                <SelectValue placeholder="Sélectionner un équipement" />
              </SelectTrigger>
              <SelectContent>
                {equipmentOptions.map((eq) => (
                  <SelectItem key={eq.id} value={eq.name}>
                    {eq.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="taskType">Type de tâche</Label>
          <Select value={type} onValueChange={(value: MaintenanceType) => setType(value)}>
            <SelectTrigger id="taskType">
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="preventive">Préventive</SelectItem>
              <SelectItem value="corrective">Corrective</SelectItem>
              <SelectItem value="condition-based">Conditionnelle</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="priority">Priorité</Label>
          <Select 
            value={priority} 
            onValueChange={(value: MaintenancePriority) => setPriority(value)}
          >
            <SelectTrigger id="priority">
              <SelectValue placeholder="Sélectionner une priorité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="critical">Critique</SelectItem>
              <SelectItem value="high">Haute</SelectItem>
              <SelectItem value="medium">Moyenne</SelectItem>
              <SelectItem value="low">Basse</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="dueDate">Date d'échéance</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, 'PPP', { locale: fr }) : <span>Sélectionner une date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={(date) => date && setDueDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="engineHours">Heures moteur</Label>
          <Input
            id="engineHours"
            type="number"
            min="0"
            value={engineHours}
            onChange={(e) => setEngineHours(e.target.value)}
            required
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="assignedTo">Assigné à</Label>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              {isLoadingStaff ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select value={assignedTo} onValueChange={setAssignedTo}>
                  <SelectTrigger id="assignedTo">
                    <SelectValue placeholder="Sélectionner un technicien" />
                  </SelectTrigger>
                  <SelectContent>
                    {staffOptions.length > 0 ? (
                      staffOptions.map((staff) => (
                        <SelectItem key={staff} value={staff}>
                          {staff}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>
                        Aucun personnel disponible
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              )}
            </div>
            <Button 
              type="button" 
              size="icon" 
              variant="outline"
              onClick={onAddStaffClick}
              title="Ajouter un nouveau technicien"
            >
              <UserPlus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>
    </div>
  );
};

export default TaskFormFields;
