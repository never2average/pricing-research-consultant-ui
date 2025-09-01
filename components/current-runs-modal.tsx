"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, Square, Clock, Users, TrendingUp } from "lucide-react"

interface CurrentRunsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CurrentRunsModal({ open, onOpenChange }: CurrentRunsModalProps) {
  const [runs] = useState([
    {
      id: "run-001",
      name: "Pricing Test A/B",
      status: "running",
      startTime: "2024-01-15 14:30",
      duration: "2h 15m",
      participants: 1247,
      conversion: "12.4%",
      type: "pricing",
    },
    {
      id: "run-002",
      name: "Customer Segment Analysis",
      status: "paused",
      startTime: "2024-01-15 09:00",
      duration: "5h 45m",
      participants: 892,
      conversion: "8.7%",
      type: "segment",
    },
    {
      id: "run-003",
      name: "Feature Flag Rollout",
      status: "completed",
      startTime: "2024-01-14 16:20",
      duration: "18h 30m",
      participants: 2156,
      conversion: "15.2%",
      type: "feature",
    },
  ])

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
        return <Clock className="w-3 h-3" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Current Runs</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {runs.map((run) => (
            <div key={run.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="font-medium text-gray-900">{run.name}</h3>
                  <Badge className={`${getStatusColor(run.status)} flex items-center gap-1`}>
                    {getStatusIcon(run.status)}
                    {run.status}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  {run.status === "running" && (
                    <Button size="sm" variant="outline">
                      <Pause className="w-4 h-4" />
                    </Button>
                  )}
                  {run.status === "paused" && (
                    <Button size="sm" variant="outline">
                      <Play className="w-4 h-4" />
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    <Square className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <div>
                    <div className="font-medium">Duration</div>
                    <div>{run.duration}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  <div>
                    <div className="font-medium">Participants</div>
                    <div>{run.participants.toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <TrendingUp className="w-4 h-4" />
                  <div>
                    <div className="font-medium">Conversion</div>
                    <div>{run.conversion}</div>
                  </div>
                </div>
                <div className="text-gray-600">
                  <div className="font-medium">Started</div>
                  <div>{run.startTime}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button>View All Runs</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
