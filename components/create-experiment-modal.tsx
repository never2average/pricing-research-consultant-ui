"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { Product, OrchestrationRequest } from "@/lib/api-types"
import { apiService } from "@/lib/api-service"

interface CreateExperimentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  products: Product[]
  loadingProducts: boolean
}

export function CreateExperimentModal({ open, onOpenChange, products, loadingProducts }: CreateExperimentModalProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    productId: "",
    pricingObjective: "",
    description: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const pricingObjectives = [
    { value: "pricing_analysis", label: "Pricing Analysis" },
    { value: "customer_segmentation", label: "Customer Segmentation" },
    { value: "revenue_forecast", label: "Revenue Forecast" },
    { value: "full_analysis", label: "Full Analysis" }
  ]

  const handleSubmit = async () => {
    try {
      setLoading(true)
      setError(null)

      // Create orchestration request
      const orchestrationRequest: OrchestrationRequest = {
        workflow_type: formData.pricingObjective as "pricing_analysis" | "customer_segmentation" | "revenue_forecast" | "full_analysis",
        product_id: formData.productId,
        parameters: {
          analysis_depth: "comprehensive",
          include_forecasting: true,
          description: formData.description
        }
      }

      console.log("Creating experiment with data:", orchestrationRequest)
      
      // Start orchestration via API
      const response = await apiService.startOrchestration(orchestrationRequest)
      
      // Reset form
      setFormData({
        productId: "",
        pricingObjective: "",
        description: ""
      })
      
      onOpenChange(false)
      
      // Navigate to the experiment page
      if (response.invocation_id) {
        router.push(`/experiment/${response.invocation_id}`)
      }
    } catch (err) {
      console.error('Failed to create experiment:', err)
      setError(err instanceof Error ? err.message : 'Failed to create experiment')
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = formData.productId && formData.pricingObjective && formData.description.trim()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Create New Experiment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Product Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Product Name</label>
            <Select 
              value={formData.productId} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, productId: value }))}
              disabled={loadingProducts}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingProducts ? "Loading products..." : "Select a product"} />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product._id} value={product._id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Workflow Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Analysis Type</label>
            <Select 
              value={formData.pricingObjective} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, pricingObjective: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select analysis type" />
              </SelectTrigger>
              <SelectContent>
                {pricingObjectives.map((objective) => (
                  <SelectItem key={objective.value} value={objective.value}>
                    {objective.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Analysis Parameters</label>
            <Textarea
              placeholder="Describe your analysis goals, specific requirements, target segments, or any additional parameters..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="min-h-[120px]"
            />
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            className="flex-1"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!isFormValid || loading}
            className="flex-1"
          >
            <Plus className="w-4 h-4 mr-2" />
            {loading ? "Starting Analysis..." : "Start Analysis"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
