"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, Square, ExternalLink } from "lucide-react"

interface CurrentRunsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CurrentRunsModal({ open, onOpenChange }: CurrentRunsModalProps) {
  const [selectedLogRunId, setSelectedLogRunId] = useState<string | null>(null)
  const [runs] = useState([
    {
      id: "run-001",
      name: "Pricing Test A/B",
      status: "running",
      startTime: "2024-01-15 14:30",
      startDate: new Date("2024-01-15T14:30:00"),
      duration: "2h 15m",
      participants: 1247,
      conversion: "12.4%",
      type: "pricing experiment",
      taskDetails: "A/B testing different pricing tiers for premium subscription",
    },
    {
      id: "run-002",
      name: "Customer Segment Analysis",
      status: "paused",
      startTime: "2024-01-15 09:00",
      startDate: new Date("2024-01-15T09:00:00"),
      duration: "5h 45m",
      participants: 892,
      conversion: "8.7%",
      type: "customer segmentation",
      taskDetails: "Analyzing customer behavior patterns across different user segments",
    },
    {
      id: "run-003",
      name: "Monthly Revenue Report",
      status: "completed",
      startTime: "2024-01-14 16:20",
      startDate: new Date("2024-01-14T16:20:00"),
      duration: "18h 30m",
      participants: 2156,
      conversion: "15.2%",
      type: "report generation",
      taskDetails: "Generating comprehensive monthly revenue and performance analytics report",
    },
    {
      id: "run-004",
      name: "Customer Data Sync",
      status: "running",
      startTime: "2024-01-16 08:15",
      startDate: new Date("2024-01-16T08:15:00"),
      duration: "45m",
      participants: 3421,
      conversion: "N/A",
      type: "data sync",
      taskDetails: "Synchronizing customer data from CRM system with analytics database for real-time reporting",
    },
  ].sort((a, b) => b.startDate.getTime() - a.startDate.getTime()))

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-green-100 text-green-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <Play className="w-3 h-3" />
      case "paused":
        return <Pause className="w-3 h-3" />
      case "completed":
        return <Square className="w-3 h-3" />
      default:
        return <Square className="w-3 h-3" />
    }
  }

  const handleViewLogs = (runId: string) => {
    setSelectedLogRunId(selectedLogRunId === runId ? null : runId)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
              <DialogContent className="w-[95vw] h-[70vh] max-w-none max-h-none sm:max-w-none overflow-hidden">

        <div className="h-full">
          <div className="overflow-y-auto max-h-[60vh]">
            <table className="w-full">
              <thead className="border-b bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Started On</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Task Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Task Details</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">View Logs</th>
                </tr>
              </thead>
              <tbody>
                {runs.map((run, index) => (
                  <>
                    <tr key={run.id} className={`border-b hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'} ${selectedLogRunId === run.id ? 'bg-blue-50' : ''}`}>
                      <td className="py-3 px-4">
                        <Badge className={`${getStatusColor(run.status)} flex items-center gap-1 w-fit`}>
                          {getStatusIcon(run.status)}
                          <span className="capitalize">{run.status}</span>
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{run.startTime}</td>
                      <td className="py-3 px-4">
                        <span className="capitalize text-gray-700 font-medium">{run.type}</span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 max-w-md">
                        {run.taskDetails}
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          size="sm"
                          variant={selectedLogRunId === run.id ? "default" : "outline"}
                          onClick={() => handleViewLogs(run.id)}
                          className="flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          {selectedLogRunId === run.id ? "Hide" : "View"}
                        </Button>
                      </td>
                    </tr>
                    {selectedLogRunId === run.id && (
                      <tr>
                        <td colSpan={5} className="p-0">
                          <div className="bg-gray-50 border-t border-gray-200">
                            <div className="p-2">
                              <div className="space-y-2 text-sm font-mono bg-white p-4 rounded-lg max-h-[300px] overflow-y-auto border">
                                <div className="text-green-600">[2024-01-15 14:30:15] Run {run.id} started</div>
                                <div className="text-blue-600">[2024-01-15 14:30:45] Initializing test parameters...</div>
                                <div className="text-blue-600">[2024-01-15 14:31:02] Loading user cohorts...</div>
                                <div className="text-blue-600">[2024-01-15 14:31:15] Distributing traffic (50/50 split)...</div>
                                <div className="text-orange-600">[2024-01-15 14:32:00] Warning: Higher than expected bounce rate in variant B</div>
                                <div className="text-blue-600">[2024-01-15 14:35:22] Collecting conversion metrics...</div>
                                <div className="text-blue-600">[2024-01-15 16:45:30] Current conversion rate: 12.4%</div>
                                <div className="text-gray-600">[2024-01-15 16:45:31] Status: Running ({run.duration} elapsed)</div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  )
}
