"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import {
  ChevronUp,
  ChevronDown,
  Filter,
  X,
  Hash,
  Type,
  Percent,
  Calendar,
  DollarSign,
  BarChart3,
  CheckCircle,
  MessageSquare,
} from "lucide-react"
import { TimeSeriesModal } from "./time-series-modal"
import { apiService } from "@/lib/api-service"
import { HistoricalRun, PricingPlan } from "@/lib/api-types"

interface ScrollableExperimentTableProps {
  stage: number
  isTransitioning: boolean
}

interface ShimmerCellProps {
  content: string
  isLoading: boolean
  isHeader: boolean
  delay: number
  onClick?: () => void
}

interface ModalData {
  isOpen: boolean
  title: string
  data: any[]
  commentary?: { commentary: string; insights: string[] }
}

const STAGE_CONFIG = [
  { rows: 1, cols: ["experiment_id"] },
  { rows: 3, cols: ["experiment_id", "segment"] },
  { rows: 3, cols: ["experiment_id", "segment", "positioning", "usage"] },
  { rows: 9, cols: ["experiment_id", "segment", "positioning", "usage", "roi_gaps"] },
  {
    rows: 9,
    cols: ["experiment_id", "segment", "positioning", "usage", "roi_gaps", "pricing_plan"],
  },
  {
    rows: 27,
    cols: ["experiment_id", "segment", "positioning", "usage", "roi_gaps", "pricing_plan", "simulation_results"],
  },
  {
    rows: 27,
    cols: [
      "experiment_id",
      "segment",
      "positioning",
      "usage",
      "roi_gaps",
      "pricing_plan",
      "simulation_results",
      "usage_ts",
      "revenue_ts",
    ],
  },
  {
    rows: 27,
    cols: [
      "experiment_id",
      "segment",
      "positioning",
      "usage",
      "roi_gaps",
      "pricing_plan",
      "simulation_results",
      "usage_ts",
      "revenue_ts",
      "feasibility_analysis",
      "deployment_status",
    ],
  },
  {
    rows: 27,
    cols: [
      "experiment_id",
      "segment",
      "positioning",
      "usage",
      "roi_gaps",
      "pricing_plan",
      "simulation_results",
      "usage_ts",
      "revenue_ts",
      "feasibility_analysis",
      "deployment_status",
      "feedback_summary",
    ],
  },
]

interface ExperimentData {
  experiment_id: string
  objective: string
  usecase: string
  segment: string
  positioning: string
  usage: string
  roi_gaps: string
  pricing_plan: string
  simulation_results: string
  usage_ts: string
  revenue_ts: string
  feasibility_analysis: string
  deployment_status: string
  feedback_summary: string
}

const COLUMN_WIDTHS = {
  experiment_id: 180, // reduced from 360 to 180 for more compact display
  segment: 270, // increased from 180
  positioning: 315, // increased from 210
  usage: 270, // increased from 180
  roi_gaps: 225, // increased from 150
  pricing_plan: 270, // increased from 180
  simulation_results: 315, // increased from 210
  usage_ts: 225, // increased from 150
  revenue_ts: 270, // increased from 180
  feasibility_analysis: 360, // increased from 240
  deployment_status: 315, // increased from 210
  feedback_summary: 450, // increased from 300
}

const COLUMN_DATATYPES = {
  experiment_id: { icon: Hash, label: "ID" },
  segment: { icon: Type, label: "Text" },
  positioning: { icon: Type, label: "Text" },
  usage: { icon: Type, label: "Text" },
  roi_gaps: { icon: Percent, label: "Percentage" },
  pricing_plan: { icon: DollarSign, label: "Currency" },
  simulation_results: { icon: BarChart3, label: "Metrics" },
  usage_ts: { icon: Calendar, label: "Date" },
  revenue_ts: { icon: DollarSign, label: "Currency" },
  feasibility_analysis: { icon: Type, label: "Text" },
  deployment_status: { icon: CheckCircle, label: "Status" },
  feedback_summary: { icon: MessageSquare, label: "Text" },
}

export function ScrollableExperimentTable({ stage, isTransitioning }: ScrollableExperimentTableProps) {
  const [cellsLoading, setCellsLoading] = useState<Set<string>>(new Set())
  const [filters, setFilters] = useState<{ [key: string]: string }>({})
  const [sortState, setSortState] = useState<{ column: string | null; direction: "asc" | "desc" | null }>({
    column: null,
    direction: null,
  })
  const [showFilters, setShowFilters] = useState<{ [key: string]: boolean }>({})
  const [modalData, setModalData] = useState<ModalData>({
    isOpen: false,
    title: "",
    data: [],
  })
  const [experiments, setExperiments] = useState<ExperimentData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const currentConfig = STAGE_CONFIG[stage] || STAGE_CONFIG[0]

  // Load experiment data from API
  useEffect(() => {
    const loadExperiments = async () => {
      try {
        setLoading(true)
        setError(null)

        const [runs, pricingPlans] = await Promise.all([
          apiService.getAllRuns(),
          apiService.getPricingPlans()
        ])

        // Transform runs and create experiment data
        const experimentData: ExperimentData[] = runs.slice(0, 27).map((run, index) => {
          const planIndex = index % pricingPlans.length
          const plan = pricingPlans[planIndex] || { unit_price: 99 }
          
          const objectives = ["Increase CTR", "Reduce Churn", "Boost Revenue", "Improve UX", "Optimize Funnel", "Enhance Retention", "Drive Engagement", "Streamline Flow", "Maximize LTV"]
          const usecases = ["A/B Testing", "Personalization", "Pricing", "UI/UX", "Onboarding", "Email Campaign", "Feature Toggle", "Recommendation", "Checkout Flow"]
          const segments = ["Premium", "Free Tier", "Enterprise", "SMB", "Consumer", "B2B", "Mobile", "Desktop", "International"]
          const positions = ["Hero Banner", "Sidebar", "Footer", "Modal", "Inline", "Popup", "Header", "Navigation", "Content"]
          const usage = ["High", "Medium", "Low", "Peak Hours", "Off-Peak", "Weekend", "Weekday", "Mobile-First", "Desktop-First"]
          
          return {
            experiment_id: run._id.slice(-6).toUpperCase() || `EXP-${index + 1}`,
            objective: objectives[index % objectives.length],
            usecase: usecases[index % usecases.length],
            segment: segments[index % segments.length],
            positioning: positions[index % positions.length],
            usage: usage[index % usage.length],
            roi_gaps: `${Math.floor(Math.random() * 20) + 5}%`,
            pricing_plan: `$${plan.unit_price}`,
            simulation_results: run.conversion || `+${Math.floor(Math.random() * 30) + 10}% Conv`,
            usage_ts: new Date(run.started_at).toLocaleDateString('en-US', { month: '2-digit', year: 'numeric' }),
            revenue_ts: `$${Math.floor(Math.random() * 40) + 10}K`,
            feasibility_analysis: index % 3 === 0 ? "High" : index % 3 === 1 ? "Medium" : "Low",
            deployment_status: run.status === "completed" ? "Live" : run.status === "running" ? "Testing" : "Planned",
            feedback_summary: run.status === "completed" ? 
              ["Positive user response", "Users love the new flow", "Great engagement boost", "Significant revenue impact"][index % 4] : ""
          }
        })

        setExperiments(experimentData)
      } catch (err) {
        console.error('Failed to load experiments:', err)
        setError(err instanceof Error ? err.message : 'Failed to load experiments')
      } finally {
        setLoading(false)
      }
    }

    loadExperiments()
  }, [])

  useEffect(() => {
    if (isTransitioning) {
      const newCells = new Set<string>()

      for (let i = 0; i < currentConfig.rows; i++) {
        for (let j = 0; j < currentConfig.cols.length; j++) {
          const cellId = `cell-${i}-${j}`
          newCells.add(cellId)
        }
      }

      setCellsLoading(newCells)

      Array.from(newCells).forEach((cellId, index) => {
        setTimeout(
          () => {
            setCellsLoading((prev) => {
              const newSet = new Set(prev)
              newSet.delete(cellId)
              return newSet
            })
          },
          200 + index * 50,
        )
      })
    }
  }, [stage, isTransitioning, currentConfig])

  const getCellContent = (rowIndex: number, colIndex: number): string => {
    if (rowIndex === 0) {
      return currentConfig.cols[colIndex].replace(/_/g, " ").toUpperCase()
    }

    if (loading || experiments.length === 0) {
      return "Loading..."
    }

    const experiment = experiments[(rowIndex - 1) % experiments.length]
    if (!experiment) return ""

    const columnKey = currentConfig.cols[colIndex] as keyof ExperimentData
    return experiment[columnKey] || ""
  }

  const getFilteredAndSortedData = () => {
    let data = Array.from({ length: currentConfig.rows }, (_, rowIndex) => {
      return currentConfig.cols.reduce(
        (row, col, colIndex) => {
          row[col] = getCellContent(rowIndex + 1, colIndex)
          return row
        },
        {} as { [key: string]: string },
      )
    })

    // Apply filters
    Object.entries(filters).forEach(([column, filterValue]) => {
      if (filterValue) {
        data = data.filter((row) => row[column].toLowerCase().includes(filterValue.toLowerCase()))
      }
    })

    // Apply sorting
    if (sortState.column && sortState.direction) {
      data.sort((a, b) => {
        const aVal = a[sortState.column!]
        const bVal = b[sortState.column!]

        // Try to parse as numbers for numeric sorting
        const aNum = Number.parseFloat(aVal.replace(/[^0-9.-]/g, ""))
        const bNum = Number.parseFloat(bVal.replace(/[^0-9.-]/g, ""))

        let comparison = 0
        if (!isNaN(aNum) && !isNaN(bNum)) {
          comparison = aNum - bNum
        } else {
          comparison = aVal.localeCompare(bVal)
        }

        return sortState.direction === "asc" ? comparison : -comparison
      })
    }

    return data
  }

  const handleSort = (column: string) => {
    setSortState((prev) => {
      if (prev.column === column) {
        const newDirection = prev.direction === "asc" ? "desc" : prev.direction === "desc" ? null : "asc"
        return { column: newDirection ? column : null, direction: newDirection }
      }
      return { column, direction: "asc" }
    })
  }

  const handleFilter = (column: string, value: string) => {
    setFilters((prev) => ({ ...prev, [column]: value }))
  }

  const toggleFilterDropdown = (column: string) => {
    setShowFilters((prev) => ({ ...prev, [column]: !prev[column] }))
  }

  const clearFilter = (column: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev }
      delete newFilters[column]
      return newFilters
    })
    setShowFilters((prev) => ({ ...prev, [column]: false }))
  }

  const getUniqueValues = (column: string) => {
    if (experiments.length === 0) return []
    const columnKey = column as keyof ExperimentData
    return [...new Set(experiments.map(exp => exp[columnKey]))].filter(Boolean)
  }

  const generateTimeSeriesData = (cellContent: string, columnType: string) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const data = []

    let baseValue = 0
    let trend = 0
    let volatility = 0.1

    if (columnType.includes("revenue") || columnType.includes("pricing")) {
      baseValue = Number.parseInt(cellContent.replace(/[^0-9]/g, "")) || 25000
      trend = 0.08 // 8% monthly growth
      volatility = 0.15
    } else if (columnType.includes("roi") || columnType.includes("gaps")) {
      baseValue = Number.parseInt(cellContent.replace(/[^0-9]/g, "")) || 15
      trend = -0.02 // Improving (decreasing gaps)
      volatility = 0.2
    } else if (columnType.includes("usage")) {
      baseValue = cellContent.includes("High") ? 850 : cellContent.includes("Medium") ? 500 : 250
      trend = 0.05
      volatility = 0.25
    } else if (columnType.includes("simulation")) {
      const isPositive = cellContent.includes("+")
      baseValue = Math.abs(Number.parseInt(cellContent.replace(/[^0-9]/g, ""))) || 10
      trend = isPositive ? 0.03 : -0.02
      volatility = 0.3
    } else {
      baseValue = 100
      trend = 0.02
      volatility = 0.2
    }

    for (let i = 0; i < 12; i++) {
      const trendValue = baseValue * (1 + trend * i)
      const randomVariation = (Math.random() - 0.5) * volatility * trendValue
      const value = Math.max(0, Math.round(trendValue + randomVariation))

      data.push({
        month: months[i],
        value: value,
        label: `${months[i]} 2024`,
      })
    }

    return data
  }

  const generateCommentary = (data: any[], cellContent: string, columnType: string) => {
    const firstValue = data[0]?.value || 0
    const lastValue = data[data.length - 1]?.value || 0
    const maxValue = Math.max(...data.map((d) => d.value))
    const minValue = Math.min(...data.map((d) => d.value))
    const trend = (((lastValue - firstValue) / firstValue) * 100).toFixed(1)
    const isPositiveTrend = Number.parseFloat(trend) > 0

    let commentary = ""
    let insights = []

    if (columnType.includes("revenue") || columnType.includes("pricing")) {
      commentary = `Revenue analysis for ${cellContent} shows ${isPositiveTrend ? "growth" : "decline"} of ${Math.abs(Number.parseFloat(trend))}% over the year.`
      insights = [
        `Peak revenue: $${maxValue.toLocaleString()} in ${data.find((d) => d.value === maxValue)?.month}`,
        `Lowest point: $${minValue.toLocaleString()} in ${data.find((d) => d.value === minValue)?.month}`,
        isPositiveTrend
          ? "Strong upward trajectory indicates successful optimization"
          : "Declining trend requires immediate attention",
      ]
    } else if (columnType.includes("roi") || columnType.includes("gaps")) {
      commentary = `ROI gap analysis shows ${isPositiveTrend ? "increasing gaps" : "improving performance"} with ${Math.abs(Number.parseFloat(trend))}% change.`
      insights = [
        `Highest gap: ${maxValue}% in ${data.find((d) => d.value === maxValue)?.month}`,
        `Best performance: ${minValue}% in ${data.find((d) => d.value === minValue)?.month}`,
        !isPositiveTrend
          ? "Consistent improvement in closing performance gaps"
          : "Performance gaps widening - optimization needed",
      ]
    } else if (columnType.includes("usage")) {
      commentary = `Usage patterns for ${cellContent} segment show ${isPositiveTrend ? "increasing" : "decreasing"} engagement by ${Math.abs(Number.parseFloat(trend))}%.`
      insights = [
        `Peak usage: ${maxValue} sessions in ${data.find((d) => d.value === maxValue)?.month}`,
        `Lowest activity: ${minValue} sessions in ${data.find((d) => d.value === minValue)?.month}`,
        "Seasonal patterns visible in user engagement cycles",
      ]
    } else if (columnType.includes("simulation")) {
      commentary = `Simulation results tracking shows ${isPositiveTrend ? "improving" : "declining"} performance metrics over time.`
      insights = [
        `Best result: ${maxValue} in ${data.find((d) => d.value === maxValue)?.month}`,
        `Baseline: ${minValue} in ${data.find((d) => d.value === minValue)?.month}`,
        "Experiment iterations showing measurable impact on key metrics",
      ]
    } else {
      commentary = `Time series analysis for ${cellContent} reveals ${isPositiveTrend ? "positive" : "negative"} trend of ${Math.abs(Number.parseFloat(trend))}%.`
      insights = [
        `Range: ${minValue} - ${maxValue}`,
        `Volatility: ${(((maxValue - minValue) / ((maxValue + minValue) / 2)) * 100).toFixed(1)}%`,
        "Data shows consistent patterns with seasonal variations",
      ]
    }

    return { commentary, insights }
  }

  const handleCellClick = (content: string, column: string) => {
    if (!content || content.trim() === "") return

    const timeSeriesData = generateTimeSeriesData(content, column)
    setModalData({
      isOpen: true,
      title: `${column.replace(/_/g, " ").toUpperCase()}: ${content}`,
      data: timeSeriesData,
      commentary: generateCommentary(timeSeriesData, content, column),
    })
  }

  const closeModal = () => {
    setModalData({ isOpen: false, title: "", data: [], commentary: undefined })
  }

  const filteredData = getFilteredAndSortedData()
  const tableWidth = currentConfig.cols.reduce((total, col) => {
    return total + (COLUMN_WIDTHS[col as keyof typeof COLUMN_WIDTHS] || 180)
  }, 0)

  const totalRows = filteredData.length

  if (error) {
    return (
      <div className="w-full h-[calc(100vh-85px)] flex items-center justify-center">
        <div className="text-red-500">Error loading experiments: {error}</div>
      </div>
    )
  }

  return (
    <div className="w-full h-[calc(100vh-85px)] flex flex-col">
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto">
          <table
            className="border-collapse transition-all duration-700 ease-out"
            style={{ width: `${tableWidth}px`, minWidth: `${tableWidth}px` }}
          >
            <thead className="sticky top-0 z-20">
              <tr>
                {currentConfig.cols.map((col, colIndex) => {
                  const cellId = `header-${colIndex}`
                  const content = getCellContent(0, colIndex)
                  const width = COLUMN_WIDTHS[col as keyof typeof COLUMN_WIDTHS] || 180
                  const hasFilter = filters[col]
                  const sortDirection = sortState.column === col ? sortState.direction : null
                  const datatype = COLUMN_DATATYPES[col as keyof typeof COLUMN_DATATYPES]
                  const DatatypeIcon = datatype?.icon || Type

                  return (
                    <th
                      key={cellId}
                      className={cn(
                        "border border-border font-semibold text-left bg-muted relative",
                        colIndex === 0 && "sticky left-0 z-30 bg-muted shadow-sm",
                      )}
                      style={{ width: `${width}px`, minWidth: `${width}px` }}
                    >
                      <div className="flex items-center justify-between p-3 h-14">
                        <div className="flex items-center gap-2 flex-1">
                          <DatatypeIcon className="w-4 h-4 text-muted-foreground/70" />
                          <span className="text-sm font-medium truncate">{content}</span>
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          <div className="flex flex-col items-center">
                            <button
                              onClick={() => handleSort(col)}
                              className="p-0.5 hover:bg-accent/50 rounded transition-colors"
                            >
                              <ChevronUp
                                className={cn(
                                  "w-3 h-3 transition-colors",
                                  sortDirection === "asc" ? "text-primary" : "text-muted-foreground",
                                )}
                              />
                            </button>
                            <button
                              onClick={() => handleSort(col)}
                              className="p-0.5 hover:bg-accent/50 rounded transition-colors -mt-1"
                            >
                              <ChevronDown
                                className={cn(
                                  "w-3 h-3 transition-colors",
                                  sortDirection === "desc" ? "text-primary" : "text-muted-foreground",
                                )}
                              />
                            </button>
                          </div>
                          <button
                            onClick={() => toggleFilterDropdown(col)}
                            className={cn(
                              "p-1 hover:bg-accent/50 rounded transition-colors",
                              hasFilter && "bg-primary/20",
                            )}
                          >
                            <Filter className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      {showFilters[col] && (
                        <div className="absolute top-full left-0 right-0 bg-card border border-border rounded-b-md shadow-lg z-40 max-h-48 overflow-y-auto">
                          <div className="p-2 border-b">
                            <input
                              type="text"
                              placeholder="Search..."
                              value={filters[col] || ""}
                              onChange={(e) => handleFilter(col, e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-border rounded bg-background"
                            />
                            {hasFilter && (
                              <button
                                onClick={() => clearFilter(col)}
                                className="absolute right-3 top-3 p-0.5 hover:bg-accent/50 rounded"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                          <div className="max-h-32 overflow-y-auto">
                            {getUniqueValues(col).map((value) => (
                              <button
                                key={value}
                                onClick={() => {
                                  handleFilter(col, value)
                                  setShowFilters((prev) => ({ ...prev, [col]: false }))
                                }}
                                className="w-full text-left px-3 py-1 text-xs hover:bg-accent/50 transition-colors"
                              >
                                {value}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((rowData, rowIndex) => (
                <tr key={rowIndex}>
                  {currentConfig.cols.map((col, colIndex) => {
                    const cellId = `cell-${rowIndex}-${colIndex}`
                    const content = rowData[col]
                    const width = COLUMN_WIDTHS[col as keyof typeof COLUMN_WIDTHS] || 180
                    const isLoading = cellsLoading.has(cellId)

                    return (
                      <td
                        key={cellId}
                        className={cn(
                          "border border-border bg-card",
                          colIndex === 0 && "sticky left-0 z-10 bg-card shadow-sm",
                        )}
                        style={{ width: `${width}px`, minWidth: `${width}px` }}
                      >
                        <ShimmerCell
                          content={content}
                          isLoading={isLoading}
                          isHeader={false}
                          delay={rowIndex * 50 + colIndex * 25}
                          onClick={() => handleCellClick(content, col)}
                        />
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="h-[60px] border-t border-border bg-muted/30 flex items-center justify-end px-4">
        <span className="text-sm text-muted-foreground font-medium">
          {loading ? "Loading experiments..." : `${totalRows} pricing experiments from API`}
        </span>
      </div>

      <TimeSeriesModal
        isOpen={modalData.isOpen}
        title={modalData.title}
        data={modalData.data}
        commentary={modalData.commentary}
        onClose={closeModal}
      />
    </div>
  )
}

function ShimmerCell({ content, isLoading, isHeader, delay, onClick }: ShimmerCellProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      className={cn(
        "relative transition-all duration-500 ease-out overflow-hidden h-14",
        "hover:bg-accent/30",
        !isHeader && onClick && "cursor-pointer hover:bg-primary/10",
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95",
      )}
      style={{ transitionDelay: `${delay}ms` }}
      onClick={!isHeader && onClick ? onClick : undefined}
    >
      <div className="h-full w-full flex items-center relative">
        {isLoading && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-shimmer" />
        )}
        <span
          className={cn(
            "transition-all duration-300 text-sm relative z-10 pl-3",
            isHeader ? "text-muted-foreground font-medium" : "text-foreground",
            isLoading && "opacity-50",
          )}
        >
          {content}
        </span>
      </div>
    </div>
  )
}
