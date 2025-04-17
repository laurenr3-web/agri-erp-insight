
import React from 'react';
import { 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval,
  getDay,
  format,
  isSameMonth,
  isToday
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { DailyHours } from '@/hooks/time-tracking/useDailyHours';
import { Skeleton } from '@/components/ui/skeleton';

interface CalendarViewProps {
  month: Date;
  dailyHours: DailyHours[];
  onDateClick: (date: Date) => void;
  isLoading: boolean;
}

const CalendarView: React.FC<CalendarViewProps> = ({ 
  month, 
  dailyHours, 
  onDateClick,
  isLoading
}) => {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Get first day of month (0-6, 0 is Sunday)
  const startDay = getDay(monthStart);
  
  const weekdays = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];
  
  // Create a lookup map for hours by date
  const hoursMap = new Map();
  dailyHours.forEach(day => {
    hoursMap.set(format(new Date(day.date), 'yyyy-MM-dd'), day.hours);
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-7 gap-1">
          {weekdays.map(day => (
            <div key={day} className="text-center text-xs font-medium py-1">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1">
        {weekdays.map(day => (
          <div key={day} className="text-center text-xs font-medium py-1">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before the month starts */}
        {Array.from({ length: startDay }).map((_, index) => (
          <div key={`empty-start-${index}`} className="h-10" />
        ))}
        
        {/* Days of the month */}
        {days.map(day => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const hours = hoursMap.get(dateKey);
          const hasActivity = hours !== undefined && hours > 0;
          
          return (
            <button
              key={dateKey}
              onClick={() => hasActivity && onDateClick(day)}
              className={`
                h-10 w-full flex flex-col items-center justify-center rounded-md text-xs
                ${hasActivity ? 'bg-green-100 hover:bg-green-200 cursor-pointer' : 'hover:bg-gray-50'}
                ${isToday(day) ? 'border border-blue-500' : ''}
                ${isSameMonth(day, month) ? '' : 'text-gray-400'}
              `}
              disabled={!hasActivity}
            >
              <span className={`font-medium ${isToday(day) ? 'text-blue-600' : ''}`}>
                {format(day, 'd')}
              </span>
              {hasActivity && (
                <span className="text-[10px]">{hours.toFixed(1)}h</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
