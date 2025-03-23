
import React, { useState } from 'react';
import { useMaintenanceSlice } from '@/hooks/maintenance/maintenanceSlice';
import { maintenanceTasks } from '@/data/maintenanceData';
import NewTaskDialog from '@/components/maintenance/NewTaskDialog';
import MaintenanceHeader from '@/components/maintenance/MaintenanceHeader';
import MaintenanceContent from '@/components/maintenance/MaintenanceContent';
import { useIsMobile } from '@/hooks/use-mobile';

const Maintenance = () => {
  const [currentView, setCurrentView] = useState('upcoming');
  const [currentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const isMobile = useIsMobile();
  
  const {
    tasks, 
    setTasks,
    isNewTaskDialogOpen,
    setIsNewTaskDialogOpen,
    handleAddTask,
    updateTaskStatus,
    updateTaskPriority,
    deleteTask
  } = useMaintenanceSlice(maintenanceTasks);

  // Handle opening dialog with a preselected date
  const handleOpenNewTaskDialog = (open: boolean) => {
    if (!open) {
      setSelectedDate(undefined);
    }
    setIsNewTaskDialogOpen(open);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-6 pb-16 px-4 sm:px-6 md:px-8 lg:px-10 ml-0 md:ml-64">
        <div className="w-full">
          <MaintenanceHeader 
            setIsNewTaskDialogOpen={setIsNewTaskDialogOpen} 
          />
          
          <MaintenanceContent 
            tasks={tasks}
            currentView={currentView}
            setCurrentView={setCurrentView}
            currentMonth={currentMonth}
            setIsNewTaskDialogOpen={setIsNewTaskDialogOpen}
            updateTaskStatus={updateTaskStatus}
            updateTaskPriority={updateTaskPriority}
            deleteTask={deleteTask}
            isMobile={isMobile}
          />
        </div>
      </div>
      
      <NewTaskDialog 
        open={isNewTaskDialogOpen}
        onOpenChange={handleOpenNewTaskDialog}
        onSubmit={handleAddTask}
        initialDate={selectedDate}
      />
    </div>
  );
};

export default Maintenance;
