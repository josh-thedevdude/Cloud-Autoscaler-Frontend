"use client"

import { useState } from "react"
import {
  Server,
  Search,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import { useQuery } from "@tanstack/react-query"
import { getClusters } from "@/api/cluster"
import ClusterDialog from "@/components/ClusterDialog"
import ClusterCard from "@/components/ClusterCard"
import ErrorPage from "./ErrorPage"
import ClustersPageSkeleton from "@/skeletons/ClustersPageSkeleton"

export default function ClustersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { error, data, isFetching } = useQuery({
    queryKey: ['allClusters'],
    queryFn: () => getClusters(),
  })

  const filteredClusters = data?.filter((cluster) => {
    const matchesSearch = cluster.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const stats = {
    total: data?.length,
    active: data?.filter((c) => c.status === "active").length,
    paused: data?.filter((c) => c.status === "paused").length,
  }

  if (isFetching) {
    return <ClustersPageSkeleton />
  }

  if (error) {
    return <ErrorPage title="Failed to fetch clusters" description={error.message} />
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Clusters</h1>
          <p className="text-sm text-muted-foreground">Manage and monitor your autoscaled clusters</p>
        </div>
        <ClusterDialog />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Clusters</p>
            <p className="text-2xl font-semibold text-foreground">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Active</p>
            <p className="text-2xl font-semibold text-success">{stats.active}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Paused</p>
            <p className="text-2xl font-semibold text-warning">{stats.paused}</p>
          </CardContent>
        </Card>
      </div>

      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search clusters..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 bg-secondary border-border text-foreground" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredClusters?.map((cluster) => (
          <ClusterCard key={cluster.id} cluster={cluster} />
        ))}
      </div>

      {filteredClusters?.length === 0 && (
        <Card className="border-border bg-card">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Server className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-medium text-foreground mb-1">No clusters found</h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? "Try adjusting your search or filters" : "Add your first cluster to get started"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
