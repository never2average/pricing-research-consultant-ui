"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DollarSign, X, ChevronDown, Check } from "lucide-react"
import { apiService } from "@/lib/api-service"
import { CustomerSegment } from "@/lib/api-types"

interface CreatePriceExperimentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreatePriceExperimentModal({ open, onOpenChange }: CreatePriceExperimentModalProps) {
  const [formData, setFormData] = useState({
    experimentGoal: "",
    customerSegments: [] as string[],
    prompt: ""
  })

  const experimentGoals = [
    { value: "competitiveness", label: "Competitiveness" },
    { value: "roi_extractions", label: "ROI Extractions" },
    { value: "optimization", label: "Optimization" }
  ]

  const [availableSegments, setAvailableSegments] = useState<CustomerSegment[]>([])
  const [loadingSegments, setLoadingSegments] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [isSegmentDropdownOpen, setIsSegmentDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Load customer segments when modal opens
  useEffect(() => {
    if (open) {
      loadCustomerSegments()
    }
  }, [open])

  const loadCustomerSegments = async () => {
    try {
      setLoadingSegments(true)
      const segments = await apiService.getCustomerSegments()
      setAvailableSegments(segments)
    } catch (err) {
      console.error('Failed to load customer segments:', err)
      setError('Failed to load customer segments')
    } finally {
      setLoadingSegments(false)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSegmentDropdownOpen(false)
      }
    }

    if (isSegmentDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isSegmentDropdownOpen])

  useEffect(() => {
    if (!open) {
      setIsSegmentDropdownOpen(false)
    }
  }, [open])

  const toggleSegment = (segmentId: string) => {
    setFormData(prev => ({
      ...prev,
      customerSegments: prev.customerSegments.includes(segmentId)
        ? prev.customerSegments.filter(s => s !== segmentId)
        : [...prev.customerSegments, segmentId]
    }))
  }

  const removeSegment = (segmentId: string) => {
    setFormData(prev => ({
      ...prev,
      customerSegments: prev.customerSegments.filter(s => s !== segmentId)
    }))
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      setError(null)

      // Start orchestration workflow for pricing experiment
      await apiService.startOrchestration({
        workflow_type: "pricing_analysis",
        parameters: {
          analysis_depth: "comprehensive",
          experiment_goal: formData.experimentGoal,
          target_segments: formData.customerSegments,
          experiment_prompt: formData.prompt
        }
      })

      console.log("Price experiment orchestration started successfully")
      
      // Reset form
      setFormData({
        experimentGoal: "",
        customerSegments: [],
        prompt: ""
      })
      setIsSegmentDropdownOpen(false)
      onOpenChange(false)
    } catch (err) {
      console.error('Failed to create price experiment:', err)
      setError(err instanceof Error ? err.message : 'Failed to create price experiment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Create Price Experiment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Experiment Goal */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Experiment Goal</label>
            <Select value={formData.experimentGoal} onValueChange={(value) => setFormData(prev => ({ ...prev, experimentGoal: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select experiment goal" />
              </SelectTrigger>
              <SelectContent>
                {experimentGoals.map((goal) => (
                  <SelectItem key={goal.value} value={goal.value}>
                    {goal.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Customer Segments */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Customer Segments (Optional)</label>
            <div className="relative" ref={dropdownRef}>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-between text-left font-normal"
                onClick={() => setIsSegmentDropdownOpen(!isSegmentDropdownOpen)}
              >
                <span className="text-gray-500">
                  {formData.customerSegments.length === 0
                    ? "Select customer segments"
                    : `${formData.customerSegments.length} segment${formData.customerSegments.length > 1 ? 's' : ''} selected`}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
              
              {isSegmentDropdownOpen && (
                <div className="absolute top-full left-0 z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                  <div className="max-h-60 overflow-auto p-1">
                    {loadingSegments ? (
                      <div className="px-3 py-2 text-sm text-gray-500">Loading segments...</div>
                    ) : availableSegments.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-gray-500">No segments available</div>
                    ) : (
                      availableSegments.map((segment) => (
                        <div
                          key={segment._id}
                          className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 cursor-pointer rounded-sm"
                          onClick={() => toggleSegment(segment._id)}
                        >
                          <div className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center">
                            {formData.customerSegments.includes(segment._id) && (
                              <Check className="w-3 h-3 text-blue-600" />
                            )}
                          </div>
                          <span className="text-sm">{segment.customer_segment_name}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {formData.customerSegments.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.customerSegments.map((segmentId) => {
                  const segment = availableSegments.find(s => s._id === segmentId)
                  return (
                    <Badge key={segmentId} variant="secondary" className="flex items-center gap-1">
                      {segment ? segment.customer_segment_name : segmentId}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-red-500"
                        onClick={() => removeSegment(segmentId)}
                      />
                    </Badge>
                  )
                })}
              </div>
            )}
          </div>

          {/* Prompt */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Prompt</label>
            <Textarea
              placeholder="Describe your pricing experiment requirements..."
              value={formData.prompt}
              onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
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
            disabled={!formData.experimentGoal || !formData.prompt || loading}
            className="flex-1"
          >
            <DollarSign className="w-4 h-4 mr-2" />
            {loading ? "Creating..." : "Create Experiment"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
