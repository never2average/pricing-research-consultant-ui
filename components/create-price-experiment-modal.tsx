"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DollarSign, X, ChevronDown, Check } from "lucide-react"

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

  const customerSegments = [
    "Enterprise", "SMB Growth", "Startup", "Enterprise Trials", "Free-to-Paid", "New Users", "Existing Users"
  ]

  const [isSegmentDropdownOpen, setIsSegmentDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

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

  const toggleSegment = (segment: string) => {
    setFormData(prev => ({
      ...prev,
      customerSegments: prev.customerSegments.includes(segment)
        ? prev.customerSegments.filter(s => s !== segment)
        : [...prev.customerSegments, segment]
    }))
  }

  const removeSegment = (segment: string) => {
    setFormData(prev => ({
      ...prev,
      customerSegments: prev.customerSegments.filter(s => s !== segment)
    }))
  }

  const handleSubmit = () => {
    console.log("Creating price experiment with:", formData)
    // Reset form
    setFormData({
      experimentGoal: "",
      customerSegments: [],
      prompt: ""
    })
    setIsSegmentDropdownOpen(false)
    onOpenChange(false)
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
                    {customerSegments.map((segment) => (
                      <div
                        key={segment}
                        className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 cursor-pointer rounded-sm"
                        onClick={() => toggleSegment(segment)}
                      >
                        <div className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center">
                          {formData.customerSegments.includes(segment) && (
                            <Check className="w-3 h-3 text-blue-600" />
                          )}
                        </div>
                        <span className="text-sm">{segment}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {formData.customerSegments.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.customerSegments.map((segment) => (
                  <Badge key={segment} variant="secondary" className="flex items-center gap-1">
                    {segment}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-red-500"
                      onClick={() => removeSegment(segment)}
                    />
                  </Badge>
                ))}
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

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!formData.experimentGoal || !formData.prompt}
            className="flex-1"
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Create Experiment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
