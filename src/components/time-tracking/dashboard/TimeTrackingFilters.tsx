
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { startOfWeek, endOfWeek } from 'date-fns';

interface TimeTrackingFiltersProps {
  dateRange: { from: Date; to: Date };
  equipmentFilter?: number;
  taskTypeFilter?: string;
  equipments: { id: number; name: string }[];
  onDateRangeChange: (range: { from: Date; to: Date }) => void;
  onEquipmentChange: (value: number | undefined) => void;
  onTaskTypeChange: (value: string | undefined) => void;
  onReset: () => void;
}

export function TimeTrackingFilters({
  dateRange,
  equipmentFilter,
  taskTypeFilter,
  equipments,
  onDateRangeChange,
  onEquipmentChange,
  onTaskTypeChange,
  onReset,
}: TimeTrackingFiltersProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-md mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Period
          </label>
          <DateRangePicker
            value={dateRange}
            onChange={onDateRangeChange}
          />
        </div>
        
        <div className="w-full md:w-48">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Equipment
          </label>
          <Select
            value={equipmentFilter?.toString() || ""}
            onValueChange={(value) => onEquipmentChange(value !== "all" ? parseInt(value) : undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {equipments.map((equipment) => (
                <SelectItem key={equipment.id} value={equipment.id.toString()}>
                  {equipment.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-48">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Task Type
          </label>
          <Select
            value={taskTypeFilter || "all"}
            onValueChange={(value) => onTaskTypeChange(value !== "all" ? value : undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="repair">Repair</SelectItem>
              <SelectItem value="inspection">Inspection</SelectItem>
              <SelectItem value="installation">Installation</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button variant="outline" onClick={onReset}>
          Reset
        </Button>
      </div>
    </div>
  );
}
