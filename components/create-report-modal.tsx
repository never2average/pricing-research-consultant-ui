"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { BarChart3, X, Plus, FileText, Clock } from "lucide-react"
import { apiService } from "@/lib/api-service"

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
    frequency: "",
    sections: [] as ReportSection[]
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  const handleSubmit = async () => {
    try {
      setLoading(true)
      setError(null)

      // Create scheduled report via API
      await apiService.createScheduledReport({
        name: formData.name,
        schedule_type: "cron",
        schedule_config: {
          cron_expression: formData.frequency
        },
        sections: formData.sections.map(section => ({
          id: section.id,
          name: section.name,
          prompt: section.prompt
        }))
      })

      console.log("Scheduled report created successfully")
      
      // Reset form
      setFormData({
        name: "",
        frequency: "",
        sections: []
      })
      onOpenChange(false)
    } catch (err) {
      console.error('Failed to create scheduled report:', err)
      setError(err instanceof Error ? err.message : 'Failed to create scheduled report')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[1600px] h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Schedule Reporting
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4 flex-1 overflow-y-auto">
          {/* Report Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Report Title</label>
            <Input
              placeholder="Enter report title"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          {/* Frequency */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Generation Frequency (Cron)</label>
            <Input
              placeholder="e.g., 0 9 * * 1 (Every Monday at 9 AM)"
              value={formData.frequency}
              onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
            />
            <p className="text-xs text-gray-500">
              Enter a cron expression. Examples: <code className="bg-gray-100 px-1 rounded">0 9 * * *</code> (daily at 9 AM), 
              <code className="bg-gray-100 px-1 rounded">0 9 * * 1</code> (Mondays at 9 AM), 
              <code className="bg-gray-100 px-1 rounded">0 9 1 * *</code> (1st of month at 9 AM)
            </p>
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
            
            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 bg-white">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700 w-16">#</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700 w-1/4">Section Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700 w-1/2">Prompt</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700 w-20">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.sections.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="border border-gray-300 px-4 py-8 text-center text-gray-500 italic">
                        No sections added yet. Click "Add Section" to create report sections with custom prompts.
                      </td>
                    </tr>
                  ) : (
                    formData.sections.map((section, index) => (
                      <tr key={section.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                          {index + 1}
                        </td>
                        <td className="border border-gray-300 px-2 py-2">
                          <Input
                            placeholder="Section name"
                            value={section.name}
                            onChange={(e) => updateSection(section.id, 'name', e.target.value)}
                            className="border-0 focus:ring-0 focus:ring-offset-0 p-2"
                          />
                        </td>
                        <td className="border border-gray-300 px-2 py-2">
                          <Textarea
                            placeholder="Enter the prompt for this section"
                            value={section.prompt}
                            onChange={(e) => updateSection(section.id, 'prompt', e.target.value)}
                            className="border-0 focus:ring-0 focus:ring-offset-0 p-2 min-h-[60px] resize-none"
                          />
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSection(section.id)}
                            className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm flex-shrink-0">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t flex-shrink-0">
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
            disabled={!formData.name || !formData.frequency || loading}
            className="flex-1"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            {loading ? "Creating..." : "Schedule Report"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
