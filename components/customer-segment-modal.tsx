"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Users, TrendingUp, Target, Filter, AlertTriangle, TrendingDown, MoreHorizontal, DollarSign, BarChart3, Headphones, Settings, Database, Crown, Shield, Mail, FileText, ArrowUp } from "lucide-react"
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { useState, useMemo } from "react"

interface CustomerSegmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
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

export function CustomerSegmentModal({ open, onOpenChange }: CustomerSegmentModalProps) {
  const segmentData = {
    name: "High-Value Enterprise Users",
    filterQuery: "user_type = 'enterprise' AND monthly_spend > 500 AND active_days > 20",
    totalUsers: 2847,
    growthData: {
      userGrowth: "+12.5%",
      usageGrowth: "+18.3%",
      revenueGrowth: "+24.7%",
    },
    abTest: {
      planA: {
        name: "Premium Plan",
        percentage: 68,
        users: 1936,
        roi: "+34.2%",
        avgRevenue: "$1,450",
        conversionRate: "12.8%",
        churnRate: "1.9%",
        weightage: "High Priority",
      },
      planB: {
        name: "Enterprise Plan",
        percentage: 32,
        users: 911,
        roi: "+28.7%",
        avgRevenue: "$2,340",
        conversionRate: "8.4%",
        churnRate: "1.2%",
        weightage: "Strategic Focus",
      },
    },
    metrics: {
      avgRevenue: "$1,247",
      engagementScore: 8.4,
      churnRate: "2.1%",
    },
  }

  // Calculate revenue analysis data with performance optimization
  const revenueAnalysis = useMemo(
    () => processRevenueAnalysis(segmentData.abTest.planA, segmentData.abTest.planB),
    [segmentData.abTest.planA, segmentData.abTest.planB]
  )

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
