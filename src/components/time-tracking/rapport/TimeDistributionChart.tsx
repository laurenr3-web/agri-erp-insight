
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface TaskDistribution {
  type: string;
  hours: number;
  color: string;
}

interface TimeDistributionChartProps {
  data: TaskDistribution[];
  isLoading?: boolean;
  error?: Error | null;
  title?: string;
}

export function TimeDistributionChart({ 
  data, 
  isLoading = false, 
  error = null,
  title = "Répartition du temps par type de tâche" 
}: TimeDistributionChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-80">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Chargement des données...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-80">
          <div className="text-center text-muted-foreground">
            <p>Une erreur est survenue lors du chargement des données.</p>
            <p className="text-sm mt-2">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!data.length) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-80">
          <div className="text-center text-muted-foreground">
            <p>Aucune donnée disponible</p>
            <p className="text-sm mt-2">
              Complétez des sessions de travail pour voir leur répartition ici.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 40,
              }}
            >
              <XAxis 
                dataKey="type" 
                angle={-45} 
                textAnchor="end"
                tick={{ fontSize: 12 }}
                height={60} 
              />
              <YAxis 
                label={{ 
                  value: 'Heures', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' } 
                }} 
              />
              <Tooltip 
                formatter={(value) => [`${value} heures`, "Temps passé"]}
                labelFormatter={(value) => `Type: ${value}`}
              />
              <Bar dataKey="hours" name="Heures">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || "#8884d8"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
