import { Link, Outlet, useParams } from "react-router"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  GitBranch,
  Server,
  ChevronRight,
  ArrowLeft,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useQuery } from "@tanstack/react-query"
import { getClusterById } from "@/api/cluster"
import TabLayoutSkeleton from "@/skeletons/TabLayoutSkeleton"

const clusterNavigation = [
  { name: "Dashboard", href: "", icon: LayoutDashboard },
  { name: "Scaling", href: "/scaling", icon: GitBranch },
]

const statusConfig: Record<string, { label: string; color: string }> = {
  active: { label: "Active", color: "bg-success text-success-foreground" },
  paused: { label: "Paused", color: "bg-warning text-warning-foreground" },
}

export default function TabLayout() {
  const params = useParams()
  const pathname = window.location.pathname
  const clusterId = params.clusterId as string

  // fetch cluster
  const { error, data: cluster, isFetching } = useQuery({
    queryKey: ['cluster'],
    queryFn: () => getClusterById(clusterId)
  })

  const basePath = `/clusters/${clusterId}`

  // Determine active section
  const getIsActive = (navHref: string) => {
    const fullPath = `${basePath}${navHref}`
    if (navHref === "") {
      return pathname === basePath
    }
    return pathname.startsWith(fullPath)
  }

  if (isFetching) {
    return <TabLayoutSkeleton />
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)]">
      {/* Cluster Header with Breadcrumb */}
      <div className="border-b border-border bg-card/50">
        <div className="px-4 lg:px-6 py-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Link
              to="/clusters"
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="h-3 w-3" />
              Clusters
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">{cluster?.name}</span>
          </div>

          {/* Cluster Info */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary">
                <Server className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <h1 className="text-xl font-semibold text-foreground">{cluster?.name}</h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge className={cn("text-xs h-4", statusConfig[cluster!.status]?.color || "bg-muted")}>
                    {statusConfig[cluster!.status]?.label || "Unknown"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Navigation Tabs */}
        <div className="px-4 lg:px-6">
          <nav className="flex items-center gap-1 overflow-x-auto pb-px -mb-px">
            {clusterNavigation.map((item) => {
              const isActive = getIsActive(item.href)
              const href = `${basePath}${item.href}`
              return (
                <Link
                  key={item.name}
                  to={href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2.5 text-sm font-medium transition-colors whitespace-nowrap border-b-2",
                    isActive
                      ? "border-chart-1 text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Cluster Content */}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  )
}