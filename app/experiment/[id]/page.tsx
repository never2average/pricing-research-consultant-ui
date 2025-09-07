"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ScrollableExperimentTable } from "@/components/scrollable-experiment-table"
import { AgentLogsModal } from "@/components/agent-logs-modal"
import { apiService } from "@/lib/api-service"
import { HistoricalRun } from "@/lib/api-types"

export default function ExperimentPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [experiment, setExperiment] = useState<HistoricalRun | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentStage, setCurrentStage] = useState(0)
  const [currentTask, setCurrentTask] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isAutoProgressing, setIsAutoProgressing] = useState(false)
  const [taskProgress, setTaskProgress] = useState(0)
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false)

  const stepNames = [
    "Initial Setup",
    "Adding Segments",
    "Positioning Data",
    "Usage Metrics",
    "ROI Analysis",
    "Pricing Strategy",
    "Simulation Results",
    "Usage Tracking",
    "Revenue Analysis",
    "Final Deployment",
  ]

  const stageDetails = [
    {
      title: "Initial Setup",
      description: "Setting up experiment framework and baseline metrics",
      tasks: [
        "Initializing experiment configuration",
        "Loading baseline data",
        "Setting up tracking parameters"
      ]
    },
    {
      title: "Adding Segments",
      description: "Identifying and configuring customer segments for analysis",
      tasks: [
        "Analyzing customer data patterns",
        "Creating segment definitions",
        "Validating segment criteria"
      ]
    },
    {
      title: "Positioning Data",
      description: "Collecting and processing positioning strategy data",
      tasks: [
        "Gathering positioning metrics",
        "Analyzing market placement",
        "Optimizing positioning strategy"
      ]
    },
    {
      title: "Usage Metrics",
      description: "Analyzing usage patterns and engagement data",
      tasks: [
        "Processing usage analytics",
        "Identifying engagement patterns",
        "Calculating usage correlation metrics"
      ]
    },
    {
      title: "ROI Analysis",
      description: "Calculating return on investment and performance gaps",
      tasks: [
        "Computing ROI metrics",
        "Identifying performance gaps",
        "Generating improvement recommendations"
      ]
    },
    {
      title: "Pricing Strategy",
      description: "Developing optimized pricing models and strategies",
      tasks: [
        "Analyzing price sensitivity",
        "Modeling pricing scenarios",
        "Optimizing pricing strategy"
      ]
    },
    {
      title: "Simulation Results",
      description: "Running simulations and generating performance predictions",
      tasks: [
        "Running pricing simulations",
        "Analyzing impact predictions",
        "Validating simulation results"
      ]
    },
    {
      title: "Usage Tracking",
      description: "Setting up comprehensive usage monitoring systems",
      tasks: [
        "Configuring usage tracking",
        "Setting up monitoring dashboards",
        "Validating tracking accuracy"
      ]
    },
    {
      title: "Revenue Analysis",
      description: "Analyzing revenue impact and financial projections",
      tasks: [
        "Processing revenue data",
        "Generating financial forecasts",
        "Creating revenue impact reports"
      ]
    },
    {
      title: "Final Deployment",
      description: "Preparing deployment and finalizing experiment results",
      tasks: [
        "Finalizing experiment results",
        "Preparing deployment package",
        "Generating final reports"
      ]
    }
  ]

  // Load experiment data
  useEffect(() => {
    const loadExperiment = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Try to get the experiment by invocation ID
        const runs = await apiService.getAllRuns()
        const foundExperiment = runs.find(run => run._id === params.id || run.invocation_id === params.id)
        
        if (foundExperiment) {
          setExperiment(foundExperiment)
          
          // Set stage based on experiment status and progress
          if (foundExperiment.progress) {
            const progressPercentage = foundExperiment.progress.completed_steps / foundExperiment.progress.total_steps
            setCurrentStage(Math.min(Math.floor(progressPercentage * 10), 9))
          } else {
            // Determine stage based on status
            switch (foundExperiment.status) {
              case "running":
                setCurrentStage(Math.floor(Math.random() * 8)) // Random active stage for running
                setIsAutoProgressing(true)
                break
              case "completed":
                setCurrentStage(9) // Final stage
                break
              case "failed":
                setCurrentStage(0)
                break
              default:
                setCurrentStage(0)
            }
          }
        } else {
          setError("Experiment not found")
        }
      } catch (err) {
        console.error('Failed to load experiment:', err)
        setError(err instanceof Error ? err.message : 'Failed to load experiment')
      } finally {
        setLoading(false)
      }
    }

    loadExperiment()
  }, [params.id])

  // Auto-progression for running experiments
  useEffect(() => {
    if (!isAutoProgressing || currentStage >= 8 || isTransitioning || experiment?.status !== "running") return

    const currentTasks = stageDetails[currentStage]?.tasks || []
    
    // Task progression within current stage
    const taskInterval = setInterval(() => {
      setTaskProgress((prevProgress) => {
        const newProgress = prevProgress + Math.random() * 15 + 5
        return Math.min(newProgress, 100)
      })
    }, 200)

    // Stage progression
    const stageInterval = setInterval(() => {
      setCurrentTask((prevTask) => {
        if (prevTask < currentTasks.length - 1) {
          return prevTask + 1
        }
        
        // Move to next stage
        setIsTransitioning(true)
        setTimeout(() => {
          setCurrentStage((prev) => {
            if (prev < 8) {
              setCurrentTask(0)
              setTaskProgress(0)
              return prev + 1
            }
            setIsAutoProgressing(false) // Stop auto-progression at final stage
            return prev
          })
          setIsTransitioning(false)
        }, 500)
        
        return prevTask
      })
    }, 2500) // Task completes every 2.5 seconds

    return () => {
      clearInterval(taskInterval)
      clearInterval(stageInterval)
    }
  }, [currentStage, currentTask, isAutoProgressing, isTransitioning, stageDetails, experiment])

  const nextStage = () => {
    if (currentStage < 8) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentStage((prev) => prev + 1)
        setCurrentTask(0)
        setTaskProgress(0)
        setIsTransitioning(false)
      }, 500)
    }
  }

  const resetTable = () => {
    setIsTransitioning(true)
    setIsAutoProgressing(true)
    setTimeout(() => {
      setCurrentStage(0)
      setCurrentTask(0)
      setTaskProgress(0)
      setIsTransitioning(false)
    }, 500)
  }

  const toggleAutoProgression = () => {
    setIsAutoProgressing(!isAutoProgressing)
  }

  if (loading) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading experiment...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-red-600 mb-2">{error}</p>
          <button 
            onClick={() => router.back()}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Go back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-background">
      <div className="w-full h-full mx-auto flex flex-col">
        <div className="w-full bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 bg-muted hover:bg-muted/80 rounded-lg flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 3h18v18H3V3zm16 16V5H5v14h14zM7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{experiment?.task_name || "Experiment"}</h1>
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">{experiment?.task_type || "Analysis"}</p>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  experiment?.status === "completed" ? "bg-green-100 text-green-800" :
                  experiment?.status === "running" ? "bg-blue-100 text-blue-800" :
                  experiment?.status === "failed" ? "bg-red-100 text-red-800" :
                  "bg-gray-100 text-gray-800"
                }`}>
                  {experiment?.status || "unknown"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex items-center gap-3">
              <div 
                className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 px-2 py-1 rounded-lg transition-colors"
                onClick={() => setIsLogsModalOpen(true)}
                title="Click to view agent logs"
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    experiment?.status === "running" ? "bg-green-500 animate-pulse" : "bg-gray-400"
                  }`}
                ></div>
                <span className="text-sm font-medium text-foreground">{stepNames[currentStage]}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <ScrollableExperimentTable stage={currentStage} isTransitioning={isTransitioning} />
        </div>
      </div>
      
      <AgentLogsModal
        isOpen={isLogsModalOpen}
        onClose={() => setIsLogsModalOpen(false)}
        invocationId={experiment?.invocation_id || params.id}
        currentStage={currentStage}
        currentTask={currentTask}
        stageName={stepNames[currentStage]}
        taskName={stageDetails[currentStage]?.tasks[currentTask] || ""}
        isAutoProgressing={experiment?.status === "running"}
      />
    </div>
  )
}
