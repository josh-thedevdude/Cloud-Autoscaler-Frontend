import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { AlertCircle, Plus } from "lucide-react"
import FormField from "@/components/FormField"
import SubmitButton from "@/components/SubmitButton"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { postClusters, updateClusterById } from "@/api/cluster"
import type { ClusterDialogProps, CreateCluster } from "@/types/common"

const defaultForm = {
  name: "",
  metricsEndpoint: "",
  minNodes: 1,
  maxNodes: 10,
  targetCpu: 70,
};

export default function ClusterDialog({ cluster, trigger }: ClusterDialogProps) {
  const isEdit = Boolean(cluster);
  const queryClient = useQueryClient()

  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState<CreateCluster>(defaultForm)

  const mutation = useMutation({
    mutationFn: (data: typeof formData) =>
      isEdit ? updateClusterById(cluster!.id, data) : postClusters(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allClusters"] });
      setOpen(false);
    },
  });

  // Populate form on edit
  useEffect(() => {
    if (cluster) {
      setFormData({
        name: cluster.name,
        metricsEndpoint: cluster.metricsEndpoint,
        minNodes: cluster.minNodes,
        maxNodes: cluster.maxNodes,
        targetCpu: cluster.targetCpu,
      });
    }
  }, [cluster]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Cluster Name
    if (!formData.name?.trim()) {
      newErrors.name = "Cluster name is required"
    } else if (formData.name.length < 3) {
      newErrors.name = "Cluster name must be at least 3 characters"
    } else if (formData.name.length > 50) {
      newErrors.name = "Cluster name must not exceed 50 characters"
    }

    // Metrics Endpoint
    if (!formData.metricsEndpoint?.trim()) {
      newErrors.metricsEndpoint = "Metrics endpoint is required"
    } else {
      try {
        new URL(formData.metricsEndpoint)
      } catch {
        newErrors.metricsEndpoint = "Please enter a valid endpoint URL"
      }
    }

    // Min Nodes
    if (
      formData.minNodes === null ||
      isNaN(formData.minNodes) ||
      formData.minNodes < 1
    ) {
      newErrors.minNodes = "Min nodes must be a number greater than 0"
    }

    // Max Nodes
    if (
      formData.maxNodes === null ||
      isNaN(formData.maxNodes) ||
      formData.maxNodes < 1
    ) {
      newErrors.maxNodes = "Max nodes must be a number greater than 0"
    }

    // Min <= Max
    if (
      !newErrors.minNodes &&
      !newErrors.maxNodes &&
      formData.minNodes > formData.maxNodes
    ) {
      newErrors.maxNodes = "Max nodes must be greater than or equal to min nodes"
    }

    if (formData.targetCpu < 1 || formData.targetCpu > 100) {
      newErrors.targetCpu = "Target CPU must be between 1 and 100"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    // Call API 
    mutation.mutate(formData, {
      onSettled: () => setIsLoading(false),
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? <Button className="bg-chart-1 text-primary-foreground hover:bg-chart-1/90 cursor-pointer">
          <Plus className="mr-2 h-4 w-4" />
          Add Cluster
        </Button>}
      </DialogTrigger>
      <DialogContent className="bg-card border-border space-y-4">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add New Cluster</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Connect a new cluster to the autoscaler
          </DialogDescription>
        </DialogHeader>
        {errors.form && (
          <div className="flex items-center gap-2 rounded-md bg-critical/10 px-3 py-2 my-4 text-sm text-critical">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errors.form}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField
            id="name"
            label="Cluster Name"
            value={formData.name}
            error={errors.name}
            onChange={(v) => handleChange("name", v)}
            placeholder="my-cluster-name"
            disabled={isLoading}
            autoComplete="name"
          />
          <FormField
            id="metrics-endpoint"
            label="Metrics Endpoint"
            value={formData.metricsEndpoint}
            error={errors.metricsEndpoint}
            onChange={(v) => handleChange("metricsEndpoint", v)}
            placeholder="https://metrics.example.com/api"
            disabled={isLoading}
            autoComplete="metrics-endpoint"
          />
          <div className="grid grid-cols-3 gap-4">
            <FormField
              id="target-cpu"
              label="Target CPU"
              type="number"
              value={formData.targetCpu}
              error={errors.targetCpu}
              onChange={(v) => handleChange("targetCpu", Number(v))}
              disabled={isLoading}
              autoComplete="target-cpu"
            />
            <FormField
              id="min-nodes"
              label="Min Nodes"
              type="number"
              value={formData.minNodes}
              error={errors.minNodes}
              onChange={(v) => handleChange("minNodes", Number(v))}
              disabled={isLoading}
              autoComplete="min-nodes"
            />
            <FormField
              id="max-nodes"
              label="Max Nodes"
              type="number"
              value={formData.maxNodes}
              error={errors.maxNodes}
              onChange={(v) => handleChange("maxNodes", Number(v))}
              disabled={isLoading}
              autoComplete="max-nodes"
            />
          </div>
          <DialogFooter className="flex">
            <SubmitButton isLoading={isLoading} label={isEdit ? "Update Cluster" : "Add Cluster"} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}