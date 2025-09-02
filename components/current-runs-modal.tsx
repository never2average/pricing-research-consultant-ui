"use client"

import { useState, Fragment, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, Square, ExternalLink } from "lucide-react"
import { apiService } from "@/lib/api-service"
import { HistoricalRun, RunLog } from "@/lib/api-types"

interface CurrentRunsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CurrentRunsModal({ open, onOpenChange }: CurrentRunsModalProps) {
  const [selectedLogRunId, setSelectedLogRunId] = useState<string | null>(null)
  const [runs, setRuns] = useState<HistoricalRun[]>([])
  const [logs, setLogs] = useState<{ [key: string]: RunLog[] }>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load runs when modal opens
  useEffect(() => {
    if (open) {
      loadRuns()
    }
  }, [open])

  const loadRuns = async () => {
    try {
      setLoading(true)
      setError(null)
      const runsData = await apiService.getAllRuns()
      setRuns(runsData.sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime()))
    } catch (err) {
      console.error('Failed to load runs:', err)
      setError(err instanceof Error ? err.message : 'Failed to load runs')
    } finally {
      setLoading(false)
    }
  }

  const loadLogsForRun = async (invocationId: string) => {
    try {
      if (logs[invocationId]) return // Already loaded
      
      const logsResponse = await apiService.getRunLogs(invocationId)
      setLogs(prev => ({
        ...prev,
        [invocationId]: logsResponse.logs
      }))
    } catch (err) {
      console.error(`Failed to load logs for run ${invocationId}:`, err)
    }
  }

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

  const handleViewLogs = async (invocationId: string) => {
    if (selectedLogRunId === invocationId) {
      setSelectedLogRunId(null)
    } else {
      setSelectedLogRunId(invocationId)
      await loadLogsForRun(invocationId)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] h-[70vh] max-w-none max-h-none sm:max-w-none overflow-hidden">
        <DialogHeader>
          <DialogTitle>Current & Historical Orchestration Runs</DialogTitle>
        </DialogHeader>

        <div className="h-full">
          {loading ? (
            <div className="flex items-center justify-center h-[50vh]">
              <div className="text-gray-500">Loading orchestration runs...</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-[50vh]">
              <div className="text-red-500">Error: {error}</div>
            </div>
          ) : (
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
                    <Fragment key={run._id}>
                      <tr className={`border-b hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'} ${selectedLogRunId === run.invocation_id ? 'bg-blue-50' : ''}`}>
                        <td className="py-3 px-4">
                          <Badge className={`${getStatusColor(run.status)} flex items-center gap-1 w-fit`}>
                            {getStatusIcon(run.status)}
                            <span className="capitalize">{run.status}</span>
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {new Date(run.started_at).toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className="capitalize text-gray-700 font-medium">{run.task_type}</span>
                        </td>
                        <td className="py-3 px-4 text-gray-600 max-w-md">
                          {run.task_details}
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            size="sm"
                            variant={selectedLogRunId === run.invocation_id ? "default" : "outline"}
                            onClick={() => handleViewLogs(run.invocation_id)}
                            className="flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            {selectedLogRunId === run.invocation_id ? "Hide" : "View"}
                          </Button>
                        </td>
                      </tr>
                      {selectedLogRunId === run.invocation_id && (
                        <tr>
                          <td colSpan={5} className="p-0">
                            <div className="bg-gray-50 border-t border-gray-200">
                              <div className="p-2">
                                <div className="space-y-2 text-sm font-mono bg-white p-4 rounded-lg max-h-[300px] overflow-y-auto border">
                                  {logs[run.invocation_id] ? (
                                    logs[run.invocation_id].length > 0 ? (
                                      logs[run.invocation_id].map((log, logIndex) => (
                                        <div
                                          key={logIndex}
                                          className={`${
                                            log.level === 'ERROR' ? 'text-red-600' :
                                            log.level === 'WARNING' ? 'text-yellow-600' :
                                            log.level === 'INFO' ? 'text-green-600' :
                                            'text-blue-600'
                                          }`}
                                        >
                                          [{log.timestamp}] {log.step_name ? `[${log.step_name}] ` : ''}{log.message}
                                        </div>
                                      ))
                                    ) : (
                                      <div className="text-gray-500 italic">No logs available for this run</div>
                                    )
                                  ) : (
                                    <div className="text-gray-500 italic">Loading logs...</div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </div>

      </DialogContent>
    </Dialog>
  )
}
