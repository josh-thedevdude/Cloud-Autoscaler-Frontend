import { deleteClusterById } from "@/api/cluster"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Clock, Server, SquarePen, Trash } from "lucide-react"
import { Link } from "react-router"
import ClusterDialog from "./ClusterDialog"
import { timeAgo } from "@/lib/formatter"

interface Cluster {
  id: string
  name: string
  status: "active" | "paused"
  min_servers: number
  max_servers: number
  config: {
    collector_endpoint: string,
    target_cpu: number
  },
  created_at: string
  updated_at: string
}

const statusConfig = {
  active: { label: "Active", color: "bg-success text-success-foreground" },
  paused: { label: "Paused", color: "bg-warning text-warning-foreground" },
}

function ClusterCard({ cluster }: { cluster: Cluster }) {
  // Access the client
  const queryClient = useQueryClient()

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: deleteClusterById,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['allClusters'] })
    },
  })

  return (
    <Card className="border-border bg-card hover:border-chart-1/50 hover:bg-secondary/30 transition-colors">
      <Link to={`/clusters/${cluster.id}`} className="block group">
        <CardContent>
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary">
                <Server className="h-5 w-5 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-foreground group-hover:text-chart-1 transition-colors self-end">{cluster.name}</h3>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={cn("text-xs", statusConfig[cluster.status].color)}>
                {statusConfig[cluster.status].label}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Min / Max Nodes</p>
              <p className="text-lg font-semibold text-foreground">
                <span className="text-2xl font-normal text-muted-foreground ml-1">
                  {cluster.min_servers} - {cluster.max_servers}
                </span>
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Target CPU</p>
              <p className={cn("text-2xl font-semibold text-muted-foreground")}>
                {cluster.config.target_cpu}%
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{timeAgo(cluster.updated_at)}</span>
            </div>
          </div>
        </CardContent>
      </Link >
      <div className="flex justify-end px-5">
        {/* for edit mode */}
        <ClusterDialog
          cluster={{
            id: cluster.id,
            name: cluster.name,
            minNodes: cluster.min_servers,
            maxNodes: cluster.max_servers,
            status: cluster.status,
            metricsEndpoint: cluster.config.collector_endpoint,
            targetCpu: cluster.config.target_cpu,
          }}
          trigger={
            <Button variant="ghost" className="cursor-pointer">
              <SquarePen className="h-4 w-4" />
            </Button>
          }
        />
        <Button variant="ghost" className="cursor-pointer text-destructive hover:text-destructive" onClick={() => { deleteMutation.mutate(cluster.id) }
        }><Trash /></Button>
      </div>
    </Card>
  )
}

export default ClusterCard;