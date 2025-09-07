"use client"

import { useState, useEffect, useRef } from "react"
import { apiService } from "@/lib/api-service"
import { RunLog } from "@/lib/api-types"

interface AgentLogsModalProps {
  isOpen: boolean
  onClose: () => void
  invocationId: string
  currentStage: number
  currentTask: number
  stageName: string
  taskName: string
  isAutoProgressing: boolean
}

export function AgentLogsModal({ isOpen, onClose, invocationId, currentStage, currentTask, stageName, taskName, isAutoProgressing }: AgentLogsModalProps) {
  const [logs, setLogs] = useState<RunLog[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const logsEndRef = useRef<HTMLDivElement>(null)

  const logTypes: Record<string, { color: string; bg: string; icon: string }> = {
    INFO: { color: "text-blue-400", bg: "bg-blue-500/10", icon: "ℹ" },
    DEBUG: { color: "text-gray-400", bg: "bg-gray-500/10", icon: "⚙" },
    WARNING: { color: "text-yellow-400", bg: "bg-yellow-500/10", icon: "⚠" },
    ERROR: { color: "text-red-400", bg: "bg-red-500/10", icon: "✗" }
  }

  // Load logs when modal opens or invocationId changes
  useEffect(() => {
    const loadLogs = async () => {
      if (!isOpen || !invocationId) return
      
      try {
        setLoading(true)
        setError(null)
        
        const response = await apiService.getRunLogs(invocationId)
        setLogs(response.logs || [])
      } catch (err) {
        console.error('Failed to load logs:', err)
        setError(err instanceof Error ? err.message : 'Failed to load logs')
      } finally {
        setLoading(false)
      }
    }

    loadLogs()
  }, [isOpen, invocationId])

  // Poll for new logs if experiment is running
  useEffect(() => {
    if (!isAutoProgressing || !isOpen || !invocationId) return

    const interval = setInterval(async () => {
      try {
        const response = await apiService.getRunLogs(invocationId)
        setLogs(response.logs || [])
      } catch (err) {
        console.error('Failed to refresh logs:', err)
      }
    }, 5000) // Poll every 5 seconds

    return () => clearInterval(interval)
  }, [isAutoProgressing, isOpen, invocationId])

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [logs])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-4xl h-[600px] flex flex-col">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Agent Activity Logs</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Current Stage: {stageName} • Task: {taskName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-muted hover:bg-muted/80 rounded-lg flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto p-6 space-y-3">
            {loading ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p>Loading logs...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="text-red-600">{error}</p>
                </div>
              </div>
            ) : logs.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p>No logs available yet</p>
                  <p className="text-sm mt-1">Agent activity will appear here</p>
                </div>
              </div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className={`flex items-start gap-3 p-3 rounded-lg ${logTypes[log.level]?.bg || "bg-muted/10"}`}>
                  <div className={`w-6 h-6 rounded-full ${logTypes[log.level]?.bg || "bg-muted/10"} ${logTypes[log.level]?.color || "text-muted-foreground"} flex items-center justify-center text-sm font-bold border border-current/20`}>
                    {logTypes[log.level]?.icon || "•"}
                  </div>
                  <div className="flex-1 min-w-0">
                    {log.step_name && (
                      <p className="text-xs font-medium text-primary mb-1">{log.step_name}</p>
                    )}
                    <p className={`text-sm ${logTypes[log.level]?.color || "text-muted-foreground"}`}>{log.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </p>
                    {log.details && (
                      <details className="mt-2">
                        <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                          View details
                        </summary>
                        <pre className="text-xs bg-muted/50 p-2 rounded mt-1 overflow-x-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={logsEndRef} />
          </div>
        </div>

        <div className="p-4 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className={`w-2 h-2 rounded-full ${isAutoProgressing ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}></div>
              {isAutoProgressing ? "Agent is actively processing" : "Agent paused"}
            </div>
            <div className="text-sm text-muted-foreground">
              {logs.length} log entries
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}