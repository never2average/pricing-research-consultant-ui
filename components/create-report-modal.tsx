"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Calendar, Clock, Target, Users, DollarSign, TrendingUp, X, Plus, FileText } from "lucide-react"

interface ReportSection {
  id: string
  name: string
  prompt: string
}

interface CreateReportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateReportModal({ open, onOpenChange }: CreateReportModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    timeframe: "",
    segments: [] as string[],
    metrics: [] as string[],
    frequency: "",
    recipients: "",
    sections: [] as ReportSection[]
  })

  const reportTypes = [
    { value: "revenue", label: "Revenue Analysis", icon: DollarSign },
    { value: "pricing", label: "Pricing Performance", icon: Target },
    { value: "segment", label: "Customer Segments", icon: Users },
    { value: "trends", label: "Market Trends", icon: TrendingUp },
  ]

  const timeframes = [
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 90 days" },
    { value: "6m", label: "Last 6 months" },
    { value: "1y", label: "Last 12 months" },
    { value: "custom", label: "Custom range" },
  ]

  const availableSegments = [
    "Enterprise", "SMB Growth", "Startup", "Enterprise Trials", "Free-to-Paid"
  ]

  const availableMetrics = [
    "Revenue", "Conversion Rate", "Churn Rate", "LTV", "CAC", "MRR", "ARR", "Growth Rate"
  ]

  const frequencies = [
    { value: "once", label: "Generate once" },
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
  ]

  const addSegment = (segment: string) => {
    if (!formData.segments.includes(segment)) {
      setFormData(prev => ({
        ...prev,
        segments: [...prev.segments, segment]
      }))
    }
  }

  const removeSegment = (segment: string) => {
    setFormData(prev => ({
      ...prev,
      segments: prev.segments.filter(s => s !== segment)
    }))
  }

  const addMetric = (metric: string) => {
    if (!formData.metrics.includes(metric)) {
      setFormData(prev => ({
        ...prev,
        metrics: [...prev.metrics, metric]
      }))
    }
  }

  const removeMetric = (metric: string) => {
    setFormData(prev => ({
      ...prev,
      metrics: prev.metrics.filter(m => m !== metric)
    }))
  }

  const addSection = () => {
    const newSection = {
      id: Date.now().toString(),
      name: "",
      prompt: ""
    }
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }))
  }

  const removeSection = (sectionId: string) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.id !== sectionId)
    }))
  }

  const updateSection = (sectionId: string, field: keyof ReportSection, value: string) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map(s => 
        s.id === sectionId ? { ...s, [field]: value } : s
      )
    }))
  }

  const handleSubmit = () => {
    // Here you would typically send the data to your backend
    console.log("Creating report with:", formData)
    // Reset form
    setFormData({
      name: "",
      description: "",
      type: "",
      timeframe: "",
      segments: [],
      metrics: [],
      frequency: "",
      recipients: "",
      sections: []
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Create New Report
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Basic Info */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Report Name</label>
            <Input
              placeholder="e.g. Monthly Revenue Analysis"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <Textarea
              placeholder="Describe what this report will analyze..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="min-h-[80px]"
            />
          </div>

          {/* Report Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Report Type</label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((type) => {
                  const IconComponent = type.icon
                  return (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Timeframe */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Time Period</label>
            <Select value={formData.timeframe} onValueChange={(value) => setFormData(prev => ({ ...prev, timeframe: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                {timeframes.map((timeframe) => (
                  <SelectItem key={timeframe.value} value={timeframe.value}>
                    {timeframe.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Customer Segments */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Customer Segments</label>
            <Select onValueChange={addSegment}>
              <SelectTrigger>
                <SelectValue placeholder="Add customer segments" />
              </SelectTrigger>
              <SelectContent>
                {availableSegments.map((segment) => (
                  <SelectItem key={segment} value={segment}>
                    {segment}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.segments.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.segments.map((segment) => (
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

          {/* Metrics */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Metrics to Include</label>
            <Select onValueChange={addMetric}>
              <SelectTrigger>
                <SelectValue placeholder="Add metrics" />
              </SelectTrigger>
              <SelectContent>
                {availableMetrics.map((metric) => (
                  <SelectItem key={metric} value={metric}>
                    {metric}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.metrics.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.metrics.map((metric) => (
                  <Badge key={metric} variant="outline" className="flex items-center gap-1">
                    {metric}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-red-500"
                      onClick={() => removeMetric(metric)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Frequency */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Generation Frequency</label>
            <Select value={formData.frequency} onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="How often to generate this report" />
              </SelectTrigger>
              <SelectContent>
                {frequencies.map((freq) => (
                  <SelectItem key={freq.value} value={freq.value}>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {freq.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Recipients */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email Recipients</label>
            <Input
              placeholder="email1@company.com, email2@company.com"
              value={formData.recipients}
              onChange={(e) => setFormData(prev => ({ ...prev, recipients: e.target.value }))}
            />
            <p className="text-xs text-gray-500">Comma-separated email addresses</p>
          </div>

          {/* Report Sections */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Report Sections & Prompts</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSection}
                className="flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add Section
              </Button>
            </div>
            
            {formData.sections.length === 0 && (
              <p className="text-sm text-gray-500 italic">No sections added yet. Click "Add Section" to create report sections with custom prompts.</p>
            )}

            {formData.sections.map((section, index) => (
              <div key={section.id} className="border rounded-lg p-4 space-y-3 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Section {index + 1}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSection(section.id)}
                    className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Input
                    placeholder="Section name (e.g., Executive Summary, Revenue Analysis)"
                    value={section.name}
                    onChange={(e) => updateSection(section.id, 'name', e.target.value)}
                  />
                  <Textarea
                    placeholder="Enter the prompt for this section (e.g., Provide a high-level summary of key findings and recommendations)"
                    value={section.prompt}
                    onChange={(e) => updateSection(section.id, 'prompt', e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!formData.name || !formData.type || !formData.timeframe}
            className="flex-1"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Create Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
