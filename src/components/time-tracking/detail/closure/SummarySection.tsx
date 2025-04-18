
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, DollarSign } from "lucide-react"
import { formatDuration } from "@/utils/dateHelpers"
import { TimeEntry } from "@/hooks/time-tracking/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SummarySectionProps {
  entry: TimeEntry;
  estimatedCost: number;
}

export function SummarySection({ entry, estimatedCost }: SummarySectionProps) {
  const duration = entry.start_time ? 
    new Date().getTime() - new Date(entry.start_time).getTime() 
    : 0;

  // Safely extract user name from different possible sources
  const displayName = entry.user_name || entry.owner_name || 'Utilisateur';
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">Résumé de la session</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
            <span>Durée : {formatDuration(duration)}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground shrink-0" />
            <span>Coût : ${estimatedCost}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={displayName ? `https://api.dicebear.com/7.x/initials/svg?seed=${displayName}` : ''} />
            <AvatarFallback>{displayName?.[0] || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{displayName}</p>
            <p className="text-sm text-muted-foreground truncate">{entry.equipment_name || 'Équipement non spécifié'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
