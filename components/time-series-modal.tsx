"use client"

import { X, TrendingUp } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface TimeSeriesModalProps {
  isOpen: boolean
  title: string
  data: any[]
  commentary?: { commentary: string; insights: string[] }
  onClose: () => void
}

export function TimeSeriesModal({ isOpen, title, data, commentary, onClose }: TimeSeriesModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-card border border-border rounded-lg p-6 w-[900px] h-[600px] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-accent/50 rounded transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {commentary && (
          <div className="mb-4 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-3">{commentary.commentary}</p>
            <div className="space-y-1">
              {commentary.insights.map((insight, index) => (
                <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  <span>{insight}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
                formatter={(value, name) => [typeof value === "number" ? value.toLocaleString() : value, "Value"]}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
