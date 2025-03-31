
import { useEffect, useState, useRef } from 'react';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Valid Supabase realtime event types
type SupabaseEventType = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

// Interface for table subscription configuration
interface SubscriptionConfig<T extends Record<string, any>> {
  tableName: string;
  eventTypes?: SupabaseEventType[];
  schema?: string;
  onInsert?: (payload: RealtimePostgresChangesPayload<T>) => void;
  onUpdate?: (payload: RealtimePostgresChangesPayload<T>) => void;
  onDelete?: (payload: RealtimePostgresChangesPayload<T>) => void;
  filter?: string;
  showNotifications?: boolean;
}

/**
 * Custom hook to subscribe to Supabase table realtime changes
 * with improved stability and reconnection logic
 */
export function useRealtimeSubscription<T extends Record<string, any>>({
  tableName,
  eventTypes = ['*'],
  schema = 'public',
  onInsert,
  onUpdate,
  onDelete,
  filter,
  showNotifications = true,
}: SubscriptionConfig<T>) {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Create a new channel
    const channelName = `table-changes-${tableName}-${Date.now()}`;
    let subscription = supabase.channel(channelName);
    
    // Configure the subscription for each event type
    for (const eventType of eventTypes) {
      // Set up base filter configuration
      const filterConfig: any = {
        schema: schema,
        table: tableName,
        event: eventType,
      };
      
      // Add optional filter
      if (filter) {
        filterConfig.filter = filter;
      }
      
      // Subscribe to PostgreSQL changes
      subscription = subscription.on(
        'postgres_changes' as any, 
        filterConfig,
        (payload: RealtimePostgresChangesPayload<T>) => {
          console.log(`Received ${payload.eventType} event for ${tableName}:`, payload);
          
          // Process based on event type
          if (payload.eventType === 'INSERT') {
            if (onInsert) onInsert(payload);
            if (showNotifications) {
              toast({
                title: `Nouvel élément ajouté`,
                description: `Un nouvel élément a été ajouté dans ${tableName}`,
              });
            }
          } else if (payload.eventType === 'UPDATE') {
            if (onUpdate) onUpdate(payload);
            if (showNotifications) {
              toast({
                title: `Élément mis à jour`,
                description: `Un élément a été mis à jour dans ${tableName}`,
              });
            }
          } else if (payload.eventType === 'DELETE') {
            if (onDelete) onDelete(payload);
            if (showNotifications) {
              toast({
                title: `Élément supprimé`,
                description: `Un élément a été supprimé de ${tableName}`,
                variant: "destructive",
              });
            }
          }
        }
      );
    }

    const attemptReconnect = () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      if (reconnectAttempts.current < maxReconnectAttempts) {
        const backoffTime = Math.min(1000 * (2 ** reconnectAttempts.current), 30000);
        console.log(`Attempting to reconnect to ${tableName} in ${backoffTime}ms (attempt ${reconnectAttempts.current + 1}/${maxReconnectAttempts})`);
        
        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectAttempts.current += 1;
          subscription.subscribe();
        }, backoffTime);
      } else {
        console.error(`Failed to reconnect to ${tableName} after ${maxReconnectAttempts} attempts`);
        setError(new Error(`Failed to maintain connection to ${tableName} after multiple attempts`));
      }
    };

    // Subscribe to the channel with reconnection handling
    subscription.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        reconnectAttempts.current = 0;
        setIsSubscribed(true);
        setError(null);
        console.log(`Successfully subscribed to ${tableName} table changes`);
      } else if (status === 'CHANNEL_ERROR') {
        console.error(`Subscription error for ${tableName}: ${status}`);
        setIsSubscribed(false);
        setError(new Error(`Failed to subscribe to ${tableName}`));
        attemptReconnect();
      } else if (status === 'TIMED_OUT') {
        console.warn(`Subscription timed out for ${tableName}`);
        setIsSubscribed(false);
        attemptReconnect();
      } else if (status === 'CLOSED') {
        console.log(`Subscription closed for ${tableName}`);
        setIsSubscribed(false);
      } else {
        console.log(`Subscription status for ${tableName}: ${status}`);
      }
    });

    // Store the channel for later access
    setChannel(subscription);

    // Clean up on component unmount
    return () => {
      console.log(`Unsubscribing from ${tableName} table changes`);
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      supabase.removeChannel(subscription);
    };
  }, [tableName, JSON.stringify(eventTypes), schema, filter, showNotifications, toast]);

  return { channel, isSubscribed, error };
}
