
import React, { memo } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import Dashboard from './Dashboard';
import CalendarView from './CalendarView';
import AllAlertsSection from './AllAlertsSection';
import { useDashboardData } from '@/hooks/dashboard/useDashboardData';
import { 
  adaptStatsData, 
  adaptEquipmentData, 
  adaptMaintenanceEvents, 
  adaptAlertItems, 
  adaptUpcomingTasks 
} from '@/hooks/dashboard/adapters';
import { useNavigationHandlers } from '@/hooks/useNavigationHandlers';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface ViewManagerProps {
  currentView: 'main' | 'calendar' | 'alerts';
  currentMonth: Date;
}

const ViewManager: React.FC<ViewManagerProps> = memo(({ currentView, currentMonth }) => {
  // Use our custom navigation handlers hook
  const navigationHandlers = useNavigationHandlers();
  
  // Destructure the dashboard data
  const { 
    loading, 
    statsData, 
    equipmentData, 
    maintenanceEvents, 
    alertItems, 
    upcomingTasks,
    urgentInterventions,
    stockAlerts,
    weeklyCalendarEvents,
    errors,
    refreshData
  } = useDashboardData();

  // Adapt data for UI components (memoize these adapters in their hooks for better performance)
  const adaptedStatsData = adaptStatsData(statsData);
  const adaptedEquipmentData = adaptEquipmentData(equipmentData);
  const adaptedMaintenanceEvents = adaptMaintenanceEvents(maintenanceEvents);
  const adaptedAlertItems = adaptAlertItems(alertItems);
  const adaptedUpcomingTasks = adaptUpcomingTasks(upcomingTasks);

  // Vérifier s'il y a des erreurs
  const hasErrors = errors && Object.values(errors).some(error => error !== null);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-t-2 border-primary rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des données du tableau de bord...</p>
        </div>
      </div>
    );
  }

  // Si nous avons des erreurs, afficher un message convivial avec bouton de rafraîchissement
  if (hasErrors) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              Problème de connexion
            </CardTitle>
            <CardDescription>
              Nous avons rencontré des difficultés pour récupérer certaines données.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Les données suivantes n'ont pas pu être chargées :
            </p>
            <ul className="space-y-2 text-sm">
              {errors?.tasks && (
                <li className="flex items-center gap-2 text-destructive-foreground">
                  <AlertCircle className="h-4 w-4" />
                  Tâches à venir : {errors.tasks}
                </li>
              )}
              {errors?.alerts && (
                <li className="flex items-center gap-2 text-destructive-foreground">
                  <AlertCircle className="h-4 w-4" />
                  Alertes : {errors.alerts}
                </li>
              )}
              {errors?.maintenance && (
                <li className="flex items-center gap-2 text-destructive-foreground">
                  <AlertCircle className="h-4 w-4" />
                  Événements de maintenance : {errors.maintenance}
                </li>
              )}
              {errors?.stats && (
                <li className="flex items-center gap-2 text-destructive-foreground">
                  <AlertCircle className="h-4 w-4" />
                  Statistiques : {errors.stats}
                </li>
              )}
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={refreshData} 
              className="w-full"
              variant="default"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Essayer à nouveau
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <Tabs value={currentView} className="space-y-8">
      <TabsContent value="main">
        <Dashboard 
          statsData={adaptedStatsData}
          equipmentData={adaptedEquipmentData}
          maintenanceEvents={adaptedMaintenanceEvents}
          alertItems={adaptedAlertItems}
          upcomingTasks={adaptedUpcomingTasks}
          urgentInterventions={urgentInterventions}
          stockAlerts={stockAlerts}
          weeklyCalendarEvents={weeklyCalendarEvents}
          currentMonth={currentMonth}
          handleStatsCardClick={navigationHandlers.handleStatsCardClick}
          handleEquipmentViewAllClick={navigationHandlers.handleEquipmentViewAllClick}
          handleMaintenanceCalendarClick={navigationHandlers.handleMaintenanceCalendarClick}
          handleAlertsViewAllClick={() => {}} // This is handled by the parent component
          handleTasksAddClick={navigationHandlers.handleTasksAddClick}
          handleEquipmentClick={navigationHandlers.handleEquipmentClick}
        />
      </TabsContent>
      
      <TabsContent value="calendar">
        <CalendarView 
          events={adaptedMaintenanceEvents} 
          month={currentMonth} 
        />
      </TabsContent>
      
      <TabsContent value="alerts">
        <AllAlertsSection alerts={adaptedAlertItems} />
      </TabsContent>
    </Tabs>
  );
});

ViewManager.displayName = 'ViewManager';

export default ViewManager;
