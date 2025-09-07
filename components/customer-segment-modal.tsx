"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Users, TrendingUp, Target, Filter, AlertTriangle, TrendingDown, MoreHorizontal, DollarSign, BarChart3, Headphones, Settings, Database, Crown, Shield, Mail, FileText, ArrowUp } from "lucide-react"
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { useState, useMemo, useEffect } from "react"
import { apiService } from "@/lib/api-service"
import { CustomerSegment, SegmentPlanLinkWithDetails, HistoricalRun } from "@/lib/api-types"

interface CustomerSegmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  segmentData?: any  // Will contain segment_id when opened from canvas
}

interface PlanData {
  name: string
  percentage: number
  users: number
  roi: string
  avgRevenue: string
  conversionRate: string
  churnRate: string
  weightage: string
}

interface RevenueAttributionItem {
  plan: string
  impressionRatio: number
  revenueAttribution: number
  revenue: number
  users: number
  avgRevenue: number
}

interface TimeSeriesRevenueData {
  month: string
  Premium: number
  Enterprise: number
  totalRevenue: number
}

interface ValueGapAnalysis extends RevenueAttributionItem {
  valueGap: number
  potentialRevenue: number
  efficiency: number
}

interface PerformanceInsights {
  underperformingPlan: ValueGapAnalysis | null
  overperformingPlan: ValueGapAnalysis | null
  efficiencyGap: number
  potentialCapture: number
}

interface RevenueAnalysisData {
  items: RevenueAttributionItem[]
  valueGaps: ValueGapAnalysis[]
  insights: PerformanceInsights
  totalRevenue: number
  timeSeries: TimeSeriesRevenueData[]
}

// Utility functions for data processing
function parseRevenue(revenueStr: string): number {
  return parseInt(revenueStr.replace(/[$,]/g, ''), 10)
}

function calculateRevenueData(planA: PlanData, planB: PlanData): RevenueAttributionItem[] {
  const planARevenue = planA.users * parseRevenue(planA.avgRevenue)
  const planBRevenue = planB.users * parseRevenue(planB.avgRevenue)
  const totalRevenue = planARevenue + planBRevenue

  return [
    {
      plan: "Premium",
      impressionRatio: planA.percentage,
      revenueAttribution: Math.round((planARevenue / totalRevenue) * 100),
      revenue: planARevenue,
      users: planA.users,
      avgRevenue: parseRevenue(planA.avgRevenue),
    },
    {
      plan: "Enterprise",
      impressionRatio: planB.percentage,
      revenueAttribution: Math.round((planBRevenue / totalRevenue) * 100),
      revenue: planBRevenue,
      users: planB.users,
      avgRevenue: parseRevenue(planB.avgRevenue),
    },
  ]
}

function calculateValueGaps(items: RevenueAttributionItem[], totalRevenue: number): ValueGapAnalysis[] {
  return items.map(item => {
    const valueGap = item.revenueAttribution - item.impressionRatio
    const potentialRevenue = valueGap > 0 ? 0 : Math.abs(valueGap) * (totalRevenue / 100)
    
    return {
      ...item,
      valueGap,
      potentialRevenue,
      efficiency: item.revenueAttribution / item.impressionRatio,
    }
  })
}

function generateInsights(valueGaps: ValueGapAnalysis[], totalRevenue: number): PerformanceInsights {
  const underperforming = valueGaps.find(item => item.valueGap < 0) || null
  const overperforming = valueGaps.find(item => item.valueGap > 0) || null
  const efficiencyGap = valueGaps.length > 1 ? valueGaps[1].efficiency - valueGaps[0].efficiency : 0
  const potentialCapture = totalRevenue * 0.12 // More conservative estimate

  return {
    underperformingPlan: underperforming,
    overperformingPlan: overperforming,
    efficiencyGap,
    potentialCapture,
  }
}

function generateTimeSeriesData(items: RevenueAttributionItem[]): TimeSeriesRevenueData[] {
  const premiumItem = items.find(item => item.plan === "Premium")
  const enterpriseItem = items.find(item => item.plan === "Enterprise")
  
  const baseMonths = ["Aug", "Sep", "Oct", "Nov", "Dec"]
  
  return baseMonths.map((month, index) => {
    const growthFactor = 1 + (index * 0.08) // 8% monthly growth
    const seasonalFactor = 0.9 + (Math.sin(index) * 0.1) // Seasonal variation
    
    const premiumRevenue = premiumItem ? (premiumItem.revenue * growthFactor * seasonalFactor) / 1000000 : 0
    const enterpriseRevenue = enterpriseItem ? (enterpriseItem.revenue * growthFactor * seasonalFactor) / 1000000 : 0
    
    return {
      month,
      Premium: Math.round(premiumRevenue * 10) / 10,
      Enterprise: Math.round(enterpriseRevenue * 10) / 10,
      totalRevenue: Math.round((premiumRevenue + enterpriseRevenue) * 10) / 10
    }
  })
}

function processRevenueAnalysis(planA: PlanData, planB: PlanData): RevenueAnalysisData {
  const items = calculateRevenueData(planA, planB)
  const totalRevenue = items.reduce((sum, item) => sum + item.revenue, 0)
  const valueGaps = calculateValueGaps(items, totalRevenue)
  const insights = generateInsights(valueGaps, totalRevenue)
  const timeSeries = generateTimeSeriesData(items)

  return {
    items,
    valueGaps,
    insights,
    totalRevenue,
    timeSeries,
  }
}

// Custom tooltip component for stacked area chart
function RevenueAttributionTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) {
    return null
  }

  const data = payload[0].payload as TimeSeriesRevenueData
  const totalRevenue = payload.reduce((sum: number, entry: any) => sum + entry.value, 0)

  return (
    <div className="bg-white p-3 border rounded-lg shadow-lg max-w-xs">
      <div className="text-sm font-semibold mb-2 text-gray-900">{label} 2024</div>
      <div className="space-y-1 text-xs">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600">{entry.dataKey}:</span>
            </div>
            <span className="font-medium">${entry.value}M</span>
          </div>
        ))}
        <div className="pt-1 mt-2 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Revenue:</span>
            <span className="font-semibold text-blue-600">
              ${totalRevenue.toFixed(1)}M
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function CustomerSegmentModal({ open, onOpenChange, segmentData: segmentProp }: CustomerSegmentModalProps) {
  const [segment, setSegment] = useState<CustomerSegment | null>(null)
  const [segmentLinks, setSegmentLinks] = useState<SegmentPlanLinkWithDetails[]>([])
  const [experiments, setExperiments] = useState<HistoricalRun[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load segment data when modal opens
  useEffect(() => {
    if (open && segmentProp?.segment_id) {
      loadSegmentData(segmentProp.segment_id)
    }
  }, [open, segmentProp])

  const loadSegmentData = async (segmentId: string) => {
    try {
      setLoading(true)
      setError(null)

      // Load segment details, links, and experiments in parallel
      const [segmentDetails, links, runs] = await Promise.all([
        apiService.getCustomerSegment(segmentId),
        apiService.getAllSegmentPlanLinks().then(links => 
          links.filter(link => link.customer_segment_id === segmentId)
        ),
        // Use historical runs as experiments
        apiService.getAllRuns().then(runs => 
          runs.filter(run => run.task_type === 'customer_segmentation').slice(0, 5)
        )
      ])

      setSegment(segmentDetails)
      setSegmentLinks(links)
      setExperiments(runs)
    } catch (err) {
      console.error('Failed to load segment data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load segment data')
    } finally {
      setLoading(false)
    }
  }

  // Create segmentData from API data for backward compatibility with existing code
  const segmentData = useMemo(() => {
    if (!segment) {
      // Fallback to default data if no real segment loaded
      return {
        name: "Customer Segment",
        filterQuery: "Loading...",
        totalUsers: 0,
        growthData: {
          userGrowth: "+0%",
          usageGrowth: "+0%",
          revenueGrowth: "+0%",
        },
        abTest: {
          planA: {
            name: "Plan A",
            percentage: 50,
            users: 0,
            roi: "+0%",
            avgRevenue: "$0",
            conversionRate: "0%",
            churnRate: "0%",
            weightage: "Standard",
          },
          planB: {
            name: "Plan B",
            percentage: 50,
            users: 0,
            roi: "+0%",
            avgRevenue: "$0",
            conversionRate: "0%",
            churnRate: "0%",
            weightage: "Standard",
          },
        },
        metrics: {
          avgRevenue: "$0",
          engagementScore: 0,
          churnRate: "0%",
        },
      }
    }

    // Calculate realistic data from segment and links
    const totalUsers = segmentLinks.reduce((sum, link) => {
      // Estimate users based on plan pricing (higher price = fewer users typically)
      const planPrice = link.pricing_plan?.unit_price || 100
      const baseUsers = Math.max(1000, Math.floor((10000 / planPrice) * 100))
      const percentage = link.percentage || 50
      return sum + Math.floor(baseUsers * (percentage / 100))
    }, 0) || 2500

    const planA = segmentLinks[0] || null
    const planB = segmentLinks[1] || null

    // Calculate metrics based on plan characteristics
    const calculateMetrics = (plan: typeof planA) => {
      if (!plan || !plan.pricing_plan) return { roi: "+25%", conversionRate: "8.5%", churnRate: "2.5%" }
      
      const price = plan.pricing_plan.unit_price
      // Higher priced plans typically have better retention but lower conversion
      const conversionRate = Math.max(5, Math.min(15, 20 - (price / 50)))
      const churnRate = Math.max(0.5, Math.min(5, price / 100))
      const roi = Math.floor(price / 10) + 15
      
      return {
        roi: `+${roi}%`,
        conversionRate: `${conversionRate.toFixed(1)}%`,
        churnRate: `${churnRate.toFixed(1)}%`,
      }
    }

    const planAMetrics = calculateMetrics(planA)
    const planBMetrics = calculateMetrics(planB)

    return {
      name: segment.customer_segment_name,
      filterQuery: segment.customer_segment_description || "Real customer segment data",
      totalUsers,
      growthData: {
        // Calculate growth based on segment activity and plan count
        userGrowth: `+${(segmentLinks.length * 5 + 8).toFixed(1)}%`,
        usageGrowth: `+${(segmentLinks.length * 7 + 12).toFixed(1)}%`,
        revenueGrowth: `+${(segmentLinks.length * 8 + 15).toFixed(1)}%`,
      },
      abTest: {
        planA: {
          name: planA?.pricing_plan?.plan_name || "Premium Plan",
          percentage: planA?.percentage || 68,
          users: Math.floor(totalUsers * (planA?.percentage || 68) / 100),
          roi: planAMetrics.roi,
          avgRevenue: `$${planA?.pricing_plan?.unit_price || 99}`,
          conversionRate: planAMetrics.conversionRate,
          churnRate: planAMetrics.churnRate,
          weightage: planA?.connection_type === "finalized" ? "High Priority" : "Experimental",
        },
        planB: {
          name: planB?.pricing_plan?.plan_name || "Enterprise Plan",
          percentage: planB?.percentage || 32,
          users: Math.floor(totalUsers * (planB?.percentage || 32) / 100),
          roi: planBMetrics.roi,
          avgRevenue: `$${planB?.pricing_plan?.unit_price || 299}`,
          conversionRate: planBMetrics.conversionRate,
          churnRate: planBMetrics.churnRate,
          weightage: planB?.connection_type === "finalized" ? "Strategic Focus" : "Testing Phase",
        },
      },
      metrics: {
        avgRevenue: `$${Math.floor((planA?.pricing_plan?.unit_price || 99) * 0.8)}`,
        engagementScore: Math.round((segmentLinks.length * 1.5 + 7) * 10) / 10,
        churnRate: planAMetrics.churnRate,
      },
    }
  }, [segment, segmentLinks])

  // Calculate revenue analysis data with performance optimization
  const revenueAnalysis = useMemo(
    () => processRevenueAnalysis(segmentData.abTest.planA, segmentData.abTest.planB),
    [segmentData.abTest.planA, segmentData.abTest.planB]
  )

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[400px] h-[300px] flex items-center justify-center">
          <div className="text-gray-500">Loading customer segment data...</div>
        </DialogContent>
      </Dialog>
    )
  }

  if (error) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[400px] h-[300px] flex items-center justify-center">
          <div className="text-red-500">Error: {error}</div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="overflow-hidden gap-0 p-4 flex flex-col"
        style={{
          width: "90vw",
          height: "90vh",
          maxWidth: "none",
          maxHeight: "none",
        }}
      >
        <DialogHeader className="gap-1 flex-shrink-0 mb-3">
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="text-lg font-semibold">{segmentData.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 flex-1 min-h-0">
          <div className="flex gap-1 items-center">
            <Filter className="w-3 h-3 text-gray-500 flex-shrink-0" />
            <code className="text-xs font-mono bg-gray-100 text-gray-600 py-1 px-2">{segmentData.filterQuery}</code>
          </div>

          <div className="flex flex-1 gap-3 min-h-0">
            <div className="border flex-[3] min-w-0 space-y-3 rounded p-3">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Pricing Experiments
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-1 font-semibold text-gray-700">Hypothesis</th>
                        <th className="text-left py-2 px-1 font-semibold text-gray-700">Pricing Plan</th>
                        <th className="text-left py-2 px-1 font-semibold text-gray-700">Rollout</th>
                        <th className="text-left py-2 px-1 font-semibold text-gray-700">Conversion</th>
                        <th className="text-left py-2 px-1 font-semibold text-gray-700">Active Since</th>
                        <th className="text-left py-2 px-1 font-semibold text-gray-700">Gross Margin</th>
                        <th className="text-left py-2 px-1 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-gray-50 border-b border-gray-100">
                        <td className="py-2 px-1 text-gray-800">Higher tier reduces churn</td>
                        <td className="py-2 px-1">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                            Premium+
                          </span>
                        </td>
                        <td className="py-2 px-1 text-gray-600">50%</td>
                        <td className="py-2 px-1">
                          <span className="font-semibold text-green-600">32.1%</span>
                        </td>
                        <td className="py-2 px-1 text-gray-600">Nov 15</td>
                        <td className="py-2 px-1">
                          <span className="font-semibold text-green-600">+124%</span>
                        </td>
                        <td className="py-2 px-1">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-32">
                              <DropdownMenuItem className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                retire plan
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                increase traffic
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                      <tr className="border-b-2 border-gray-200">
                        <td colSpan={7} className="py-3 px-3 bg-gray-50 border-l-4 border-gray-300">
                          <div className="text-xs text-gray-700">
                            <span>$89/month</span>
                            <span className="text-gray-500"> • </span>
                            <span>Advanced analytics and priority support with custom integrations, 50GB storage, and enhanced reporting dashboard</span>
                          </div>
                        </td>
                      </tr>
                      
                      <tr className="hover:bg-gray-50 border-b border-gray-100">
                        <td className="py-2 px-1 text-gray-800">Value pricing drives revenue</td>
                        <td className="py-2 px-1">
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
                            Enterprise
                          </span>
                        </td>
                        <td className="py-2 px-1 text-gray-600">30%</td>
                        <td className="py-2 px-1">
                          <span className="font-semibold text-blue-600">28.4%</span>
                        </td>
                        <td className="py-2 px-1 text-gray-600">Oct 28</td>
                        <td className="py-2 px-1">
                          <span className="font-semibold text-blue-600">+87%</span>
                        </td>
                        <td className="py-2 px-1">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-32">
                              <DropdownMenuItem className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                retire plan
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                increase traffic
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                      <tr className="border-b-2 border-gray-200">
                        <td colSpan={7} className="py-3 px-3 bg-gray-50 border-l-4 border-gray-300">
                          <div className="text-xs text-gray-700">
                            <span>$299/month</span>
                            <span className="text-gray-500"> • </span>
                            <span>White-label solution with dedicated account manager, SLA guarantee, unlimited storage, full API access, and enterprise support</span>
                          </div>
                        </td>
                      </tr>
                      
                      <tr className="hover:bg-gray-50 border-b border-gray-100">
                        <td className="py-2 px-1 text-gray-800">Freemium conversion boost</td>
                        <td className="py-2 px-1">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                            Basic Pro
                          </span>
                        </td>
                        <td className="py-2 px-1 text-gray-600">75%</td>
                        <td className="py-2 px-1">
                          <span className="font-semibold text-yellow-600">18.7%</span>
                        </td>
                        <td className="py-2 px-1 text-gray-600">Nov 8</td>
                        <td className="py-2 px-1">
                          <span className="font-semibold text-orange-600">+62%</span>
                        </td>
                        <td className="py-2 px-1">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-32">
                              <DropdownMenuItem className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                retire plan
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                increase traffic
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={7} className="py-3 px-3 bg-gray-50 border-l-4 border-gray-300">
                          <div className="text-xs text-gray-700">
                            <span>$39/month</span>
                            <span className="text-gray-500"> • </span>
                            <span>Core features with email support, basic reporting, 10GB storage, upgrade incentives, and essential tools</span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
            </div>

            <div className="flex-[2] border rounded p-3 min-w-0">
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Revenue Attribution Analysis
              </h3>

              {/* Stacked Area Chart for Revenue Over Time */}
              <div className="h-40 mb-3">
                <ChartContainer
                  config={{
                    Premium: { label: "Premium Plan", color: "#3b82f6" },
                    Enterprise: { label: "Enterprise Plan", color: "#8b5cf6" },
                  }}
                  className="h-full w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart 
                      data={revenueAnalysis.timeSeries} 
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fontSize: 12, fill: "#64748b" }} 
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis 
                        hide={true}
                      />
                      <ChartTooltip content={<RevenueAttributionTooltip />} />
                      <Area 
                        type="monotone"
                        dataKey="Premium" 
                        stackId="1"
                        stroke="#3b82f6"
                        fill="#3b82f6" 
                        name="Premium Plan"
                        opacity={0.8}
                      />
                      <Area 
                        type="monotone"
                        dataKey="Enterprise" 
                        stackId="1"
                        stroke="#8b5cf6"
                        fill="#8b5cf6" 
                        name="Enterprise Plan"
                        opacity={0.8}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>

              {/* Performance Metrics Table */}
              <div className="overflow-x-auto mb-3">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-1 font-semibold text-gray-700">Plan</th>
                      <th className="text-left py-2 px-1 font-semibold text-gray-700">Conversion</th>
                      <th className="text-left py-2 px-1 font-semibold text-gray-700">Churn</th>
                      <th className="text-left py-2 px-1 font-semibold text-gray-700">Efficiency</th>
                      <th className="text-left py-2 px-1 font-semibold text-gray-700">Gap</th>
                    </tr>
                  </thead>
                  <tbody>
                    {revenueAnalysis.valueGaps.map((item, index) => (
                      <tr key={`${item.plan}-${index}`} className="hover:bg-gray-50 border-b border-gray-100">
                        <td className="py-2 px-1">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            item.plan === 'Premium' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {item.plan}
                          </span>
                        </td>
                        <td className="py-2 px-1 text-gray-800">
                          {item.plan === 'Premium' ? segmentData.abTest.planA.conversionRate : segmentData.abTest.planB.conversionRate}
                        </td>
                        <td className="py-2 px-1 text-gray-800">
                          {item.plan === 'Premium' ? segmentData.abTest.planA.churnRate : segmentData.abTest.planB.churnRate}
                        </td>
                        <td className="py-2 px-1 text-gray-800">
                          {item.efficiency.toFixed(2)}x
                        </td>
                        <td className="py-2 px-1">
                          <span className={`font-semibold ${
                            item.valueGap < 0 ? 'text-red-600' : 
                            item.valueGap > 0 ? 'text-green-600' : 'text-gray-600'
                          }`}>
                            {item.valueGap > 0 ? '+' : ''}{item.valueGap.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Insights */}
              <div className="space-y-2">
                <div className="py-2 px-1 border-b border-gray-100">
                  <div className="text-xs font-semibold text-gray-700 mb-1">Key Insights</div>
                  <div className="space-y-1">
                    <div className="text-xs text-gray-600">
                      Revenue Leader: <span className="font-medium text-gray-800">
                        {revenueAnalysis.valueGaps[0].revenue > revenueAnalysis.valueGaps[1].revenue ? 
                          revenueAnalysis.valueGaps[0].plan : revenueAnalysis.valueGaps[1].plan}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      Conv. Rate Δ: <span className="font-medium text-gray-800">
                        {(parseFloat(segmentData.abTest.planA.conversionRate) - parseFloat(segmentData.abTest.planB.conversionRate)).toFixed(1)}pp
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="py-2 px-1 border-b border-gray-100">
                  <div className="text-xs font-semibold text-gray-700 mb-1">Recommendations</div>
                  <div className="space-y-1">
                    {revenueAnalysis.insights.underperformingPlan && (
                      <div className="text-xs text-gray-600">
                        • {revenueAnalysis.insights.underperformingPlan.plan} underperforming by {Math.abs(revenueAnalysis.insights.underperformingPlan.valueGap).toFixed(1)}%
                      </div>
                    )}
                    {parseFloat(segmentData.abTest.planA.churnRate) > parseFloat(segmentData.abTest.planB.churnRate) && (
                      <div className="text-xs text-gray-600">
                        • Premium churn {(parseFloat(segmentData.abTest.planA.churnRate) - parseFloat(segmentData.abTest.planB.churnRate)).toFixed(1)}pp higher - retention focus needed
                      </div>
                    )}
                    <div className="text-xs text-gray-600">
                      • Potential revenue capture: <span className="font-medium text-gray-800">${(revenueAnalysis.insights.potentialCapture / 1000000).toFixed(1)}M</span>
                    </div>
                  </div>
                </div>
                
                <div className="py-2 px-1">
                  <div className="text-xs font-semibold text-gray-700 mb-1">Next Steps</div>
                  <div className="text-xs text-gray-600 space-y-0.5">
                    <div>• Launch upsell campaign</div>
                    <div>• A/B test pricing adjustments</div>
                    <div>• Analyze churn patterns</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
