"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { DollarSign, TrendingUp, Target, Filter, MoreHorizontal, BarChart3, Activity, Users, Clock, PieChartIcon } from "lucide-react"

interface PricingPlanModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  planData?: any
}

export function PricingPlanModal({ open, onOpenChange, planData }: PricingPlanModalProps) {
  const [experiments] = useState([
    {
      id: "exp-001",
      name: "Premium Tier A/B Test",
      hypothesis: "Higher tier reduces churn",
      status: "running",
      rollout: "68%",
      conversion: "34.2%",
      activeSince: "Nov 15",
      grossMargin: "+124%",
      price: "$89/month",
      description: "Advanced analytics and priority support with custom integrations, 50GB storage, and enhanced reporting dashboard"
    },
    {
      id: "exp-002", 
      name: "Enterprise Value Test",
      hypothesis: "Value pricing drives revenue",
      status: "running",
      rollout: "32%",
      conversion: "28.7%",
      activeSince: "Oct 28",
      grossMargin: "+87%",
      price: "$299/month",
      description: "White-label solution with dedicated account manager, SLA guarantee, unlimited storage, full API access, and enterprise support"
    },
    {
      id: "exp-003",
      name: "Freemium Conversion",
      hypothesis: "Freemium conversion boost", 
      status: "paused",
      rollout: "75%",
      conversion: "18.7%",
      activeSince: "Nov 8",
      grossMargin: "+62%",
      price: "$39/month",
      description: "Core features with email support, basic reporting, 10GB storage, upgrade incentives, and essential tools"
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

  const planName = planData?.label || "Premium Plan"

  const segmentData = [
    { segment: "Enterprise", revenue: 1247000, percentage: 42.3, color: "#3b82f6" },
    { segment: "SMB Growth", revenue: 856000, percentage: 29.1, color: "#10b981" },
    { segment: "Startup", revenue: 523000, percentage: 17.8, color: "#f59e0b" },
    { segment: "Enterprise Trials", revenue: 198000, percentage: 6.7, color: "#8b5cf6" },
    { segment: "Free-to-Paid", revenue: 121000, percentage: 4.1, color: "#ef4444" },
  ]

  const totalRevenue = segmentData.reduce((sum, item) => sum + item.revenue, 0)

  const chartConfig = {
    enterprise: { label: "Enterprise", color: "#3b82f6" },
    smbGrowth: { label: "SMB Growth", color: "#10b981" },
    startup: { label: "Startup", color: "#f59e0b" },
    enterpriseTrials: { label: "Enterprise Trials", color: "#8b5cf6" },
    freeToPaid: { label: "Free-to-Paid", color: "#ef4444" },
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
            <DollarSign className="w-4 h-4" />
            <span className="text-lg font-semibold">{planName} - Pricing Experiments</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 flex-1 min-h-0 overflow-hidden">
          <div className="space-y-2 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                  <Activity className="w-3 h-3 mr-1" />
                  Experimental
                </Badge>
              </div>
              
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>Active since: Nov 15, 2024 • 2:14 PM</span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="flex gap-3 min-h-0">
            <div className="border flex-[7] min-w-0 rounded p-3 flex flex-col">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Pricing Strategy
              </h3>

              <div className="space-y-4 text-sm flex-1 min-h-0">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Use Case</h4>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    Advanced analytics platform targeting enterprise teams requiring comprehensive data insights, custom integrations, and priority support for mission-critical business operations.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Pricing Objective</h4>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    <span className="font-medium">ROI extraction</span> through value-based pricing that maximizes revenue from enterprise segments while maintaining competitiveness in the market. Focus on margin optimization and customer lifetime value enhancement.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Pricing Model</h4>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    Tiered subscription model with usage-based components. Base pricing at $89/month for premium features, scaling to $299/month for enterprise solutions with dedicated support and unlimited resources.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Rationale</h4>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    Premium pricing reflects high-value features and supports customer success through dedicated resources. Enterprise tier captures maximum value from high-usage customers while freemium tier drives acquisition and conversion funnel optimization.
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                    Financial Projections
                  </h4>
                  
                  <div className="space-y-4">
                    {/* Revenue Scenarios */}
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wider">Revenue Scenarios</div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 border border-gray-200 hover:shadow-sm transition-shadow">
                          <div className="flex items-center gap-1 mb-2">
                            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                            <span className="text-gray-600 font-medium">Conservative</span>
                          </div>
                          <div className="space-y-1">
                            <div className="text-lg font-bold text-gray-800">$12.8M</div>
                            <div className="text-gray-600">7.2k users</div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-500" />
                              <span className="text-amber-600 font-medium">3.4mo</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border-2 border-blue-300 shadow-sm">
                          <div className="flex items-center gap-1 mb-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <span className="text-blue-700 font-medium">Base Case</span>
                          </div>
                          <div className="space-y-1">
                            <div className="text-lg font-bold text-blue-800">$18.4M</div>
                            <div className="text-blue-700">10k users</div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-green-500" />
                              <span className="text-green-600 font-medium">2.8mo</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200 hover:shadow-sm transition-shadow">
                          <div className="flex items-center gap-1 mb-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-green-700 font-medium">Optimistic</span>
                          </div>
                          <div className="space-y-1">
                            <div className="text-lg font-bold text-green-800">$26.7M</div>
                            <div className="text-green-700">14.5k users</div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-green-500" />
                              <span className="text-green-600 font-medium">2.1mo</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Unit Economics */}
                    <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg p-3 border">
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">Unit Economics</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center p-2 bg-white rounded border">
                            <span className="text-gray-600 flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              CAC (blended)
                            </span>
                            <span className="font-bold text-gray-800">$187</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-white rounded border">
                            <span className="text-gray-600 flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              LTV
                            </span>
                            <span className="font-bold text-gray-800">$1,240</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-green-50 rounded border border-green-200">
                            <span className="text-gray-600 flex items-center gap-1">
                              <Target className="w-3 h-3" />
                              LTV/CAC Ratio
                            </span>
                            <span className="font-bold text-green-700">6.6x</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center p-2 bg-white rounded border">
                            <span className="text-gray-600 flex items-center gap-1">
                              <Activity className="w-3 h-3" />
                              Growth (MoM)
                            </span>
                            <span className="font-bold text-blue-600">12.4%</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-white rounded border">
                            <span className="text-gray-600 flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              Conversion Rate
                            </span>
                            <span className="font-bold text-orange-600">22.8%</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-red-50 rounded border border-red-200">
                            <span className="text-gray-600 flex items-center gap-1">
                              <Activity className="w-3 h-3" />
                              Monthly Churn
                            </span>
                            <span className="font-bold text-red-600">4.2%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-[5] border rounded p-3 min-w-0 flex flex-col">
              <h3 className="text-sm font-semibold mb-1 flex items-center gap-2">
                <PieChartIcon className="w-4 h-4" />
                Revenue Attribution by Segment
              </h3>

              <div className="space-y-4 flex-1 min-h-0">
                <div className="relative h-64 z-50">
                  <ChartContainer config={chartConfig} className="h-full w-full relative z-50">
                      <PieChart>
                        <Pie
                          data={segmentData}
                          dataKey="revenue"
                          nameKey="segment"
                          cx="50%"
                          cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                          paddingAngle={3}
                        >
                          {segmentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip 
                        wrapperStyle={{ zIndex: 9999 }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div 
                                className="bg-white border rounded-lg shadow-lg p-2"
                                style={{ zIndex: 9999, position: 'relative' }}
                              >
                                <div className="text-xs font-semibold text-gray-800 mb-1">
                                  {data.segment}
                                </div>
                                <div className="text-xs text-gray-600">
                                  Revenue: <span className="font-medium text-gray-800">${data.revenue.toLocaleString()}</span>
                                </div>
                                <div className="text-xs text-gray-600">
                                  Share: <span className="font-medium text-gray-800">{data.percentage}%</span>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                        />
                      </PieChart>
                    </ChartContainer>
                  
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                    <div className="text-lg font-bold text-gray-800">
                      ${totalRevenue.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600">Total Revenue</div>
                    </div>
                  </div>
                  </div>

                <div className="text-sm font-semibold text-gray-800 mb-1">Segment-level A/B Test Results</div>
                <div className="border rounded p-1 overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-2 font-semibold text-gray-700">Segment</th>
                        <th className="text-left py-2 px-2 font-semibold text-gray-700">Rollout Ratio</th>
                        <th className="text-left py-2 px-2 font-semibold text-gray-700">Suggestion Ratio</th>
                        <th className="text-left py-2 px-2 font-semibold text-gray-700">vs Alternative</th>
                        <th className="text-left py-2 px-2 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-gray-50 border-b border-gray-100">
                        <td className="py-2 px-2 text-gray-800">Enterprise</td>
                        <td className="py-2 px-2 text-gray-600">68%</td>
                        <td className="py-2 px-2 text-green-600 font-medium">75%</td>
                        <td className="py-2 px-2 text-green-600 font-medium">+18.4%</td>
                        <td className="py-2 px-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                Implement Suggestion
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-gray-600 hover:text-gray-700 hover:bg-gray-50">
                                Ignore Suggestion
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                Downsize Segment
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                      
                      <tr className="hover:bg-gray-50 border-b border-gray-100">
                        <td className="py-2 px-2 text-gray-800">SMB Growth</td>
                        <td className="py-2 px-2 text-gray-600">32%</td>
                        <td className="py-2 px-2 text-green-600 font-medium">45%</td>
                        <td className="py-2 px-2 text-green-600 font-medium">+12.7%</td>
                        <td className="py-2 px-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                Implement Suggestion
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-gray-600 hover:text-gray-700 hover:bg-gray-50">
                                Ignore Suggestion
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                Downsize Segment
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                      
                      <tr className="hover:bg-gray-50 border-b border-gray-100">
                        <td className="py-2 px-2 text-gray-800">Startup</td>
                        <td className="py-2 px-2 text-gray-600">75%</td>
                        <td className="py-2 px-2 text-yellow-600 font-medium">60%</td>
                        <td className="py-2 px-2 text-red-600 font-medium">-3.2%</td>
                        <td className="py-2 px-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                Implement Suggestion
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-gray-600 hover:text-gray-700 hover:bg-gray-50">
                                Ignore Suggestion
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                Downsize Segment
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                      
                      <tr className="hover:bg-gray-50 border-b border-gray-100">
                        <td className="py-2 px-2 text-gray-800">Enterprise Trials</td>
                        <td className="py-2 px-2 text-gray-600">15%</td>
                        <td className="py-2 px-2 text-green-600 font-medium">25%</td>
                        <td className="py-2 px-2 text-green-600 font-medium">+8.1%</td>
                        <td className="py-2 px-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                Implement Suggestion
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-gray-600 hover:text-gray-700 hover:bg-gray-50">
                                Ignore Suggestion
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                Downsize Segment
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                      
                      <tr className="hover:bg-gray-50 border-b border-gray-100">
                        <td className="py-2 px-2 text-gray-800">Free-to-Paid</td>
                        <td className="py-2 px-2 text-gray-600">85%</td>
                        <td className="py-2 px-2 text-red-600 font-medium">40%</td>
                        <td className="py-2 px-2 text-red-600 font-medium">-15.3%</td>
                        <td className="py-2 px-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                Implement Suggestion
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-gray-600 hover:text-gray-700 hover:bg-gray-50">
                                Ignore Suggestion
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                Downsize Segment
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>


                <div className="text-sm font-semibold text-gray-700 mb-2">Revenue & Margin Analysis</div>
                <div className="border rounded p-2">
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <div className="bg-green-50 rounded p-1.5 text-center">
                          <div className="text-xs font-bold text-green-800">$2,945k</div>
                          <div className="text-xs text-green-600">Total Revenue</div>
                        </div>
                        <div className="text-center text-xs text-gray-400">↓</div>
                        <div className="bg-red-50 rounded p-1 text-center">
                          <div className="text-xs font-medium text-red-800">-$768k</div>
                          <div className="text-xs text-red-600">COGS</div>
                        </div>
                        <div className="bg-orange-50 rounded p-1 text-center">
                          <div className="text-xs font-medium text-orange-800">-$342k</div>
                          <div className="text-xs text-orange-600">Direct Costs</div>
                        </div>
                        <div className="text-center text-xs text-gray-400">↓</div>
                        <div className="bg-blue-50 border-2 border-blue-300 rounded p-1.5 text-center">
                          <div className="text-xs font-bold text-blue-800">$1,835k</div>
                          <div className="text-xs text-blue-600">Gross Margin</div>
                        </div>
                      </div>
                    </div>
                  <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-600 text-center">
                    <span>Key Metrics: <span className="font-bold text-gray-800">62.3% Gross Margin</span> • <span className="font-bold text-gray-800">6.6x LTV/CAC</span></span>
                  </div>
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
