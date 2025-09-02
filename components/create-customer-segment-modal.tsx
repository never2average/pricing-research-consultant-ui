"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Users } from "lucide-react"
import { apiService } from "@/lib/api-service"

interface CreateCustomerSegmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}



export function CreateCustomerSegmentModal({ open, onOpenChange }: CreateCustomerSegmentModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    sqlQuery: "",
    columnSearch: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Create customer segment via API
      await apiService.createCustomerSegment({
        customer_segment_name: formData.name,
        customer_segment_uid: formData.name.toLowerCase().replace(/\s+/g, '_'),
        customer_segment_description: formData.sqlQuery || formData.columnSearch || "Customer segment created from UI"
      })
      
      console.log("Customer segment created successfully")
      
      // Reset form
      setFormData({
        name: "",
        sqlQuery: "",
        columnSearch: ""
      })
      onOpenChange(false)
    } catch (err) {
      console.error('Failed to create customer segment:', err)
      setError(err instanceof Error ? err.message : 'Failed to create customer segment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[650px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Create Customer Segment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Segment Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Segment Name</label>
            <Input
              placeholder="e.g. High-Value Enterprise Users"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          {/* SQL Query */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">SQL Query</label>
            <Textarea
              placeholder="SELECT * FROM customers WHERE..."
              value={formData.sqlQuery}
              onChange={(e) => setFormData(prev => ({ ...prev, sqlQuery: e.target.value }))}
              className="min-h-[120px] font-mono text-sm"
            />
          </div>

          {/* Column Search */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Column Search</label>
            <Input
              placeholder="Search for specific columns..."
              value={formData.columnSearch}
              onChange={(e) => setFormData(prev => ({ ...prev, columnSearch: e.target.value }))}
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
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1" disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!formData.name || loading}
            className="flex-1"
          >
            <Users className="w-4 h-4 mr-2" />
            {loading ? "Creating..." : "Create Segment"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
