"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Users } from "lucide-react"

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



  const handleSubmit = () => {
    console.log("Creating customer segment with:", formData)
    
    // Reset form
    setFormData({
      name: "",
      sqlQuery: "",
      columnSearch: ""
    })
    onOpenChange(false)
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

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!formData.name || !formData.sqlQuery}
            className="flex-1"
          >
            <Users className="w-4 h-4 mr-2" />
            Create Segment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
