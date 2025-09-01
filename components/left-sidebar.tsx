"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Copy, FileText, FileCode, Play, CheckCircle, Circle, ChevronDown, ChevronRight, AlertCircle, Lightbulb } from "lucide-react"
import { ProjectDropdowns } from "./project-dropdowns"
import { FormSection } from "./form-section"

export function LeftSidebar() {
  const [completedSteps, setCompletedSteps] = useState(new Set())
  const [expandedSections, setExpandedSections] = useState(new Set([1])) // Start with step 1
  
  // Auto-expand the earliest incomplete step when completed steps change
  useEffect(() => {
    let earliestIncomplete = null
    for (let step = 1; step <= 3; step++) {
      if (!completedSteps.has(step)) {
        earliestIncomplete = step
        break
      }
    }
    if (earliestIncomplete) {
      setExpandedSections(new Set([earliestIncomplete]))
    }
  }, [completedSteps])

  const toggleSection = (index = 0) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedSections(newExpanded)
  }

  const toggleComplete = (step = 0) => {
    const newCompleted = new Set(completedSteps)
    if (newCompleted.has(step)) {
      newCompleted.delete(step)
    } else {
      newCompleted.add(step)
    }
    setCompletedSteps(newCompleted)
  }

  const StepHeader = ({ step = 0, title = "", isExpanded = false, onToggle = () => {}, isCompleted = false }) => (
    <div 
      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
      onClick={onToggle}
    >
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0"
          onClick={(e) => {
            e.stopPropagation()
            toggleComplete(step)
          }}
        >
          {isCompleted ? (
            <CheckCircle className="w-4 h-4 text-green-600" />
          ) : (
            <Circle className="w-4 h-4 text-gray-400" />
          )}
        </Button>
        <span className="text-sm font-medium text-gray-600">{step}. {title}</span>
      </div>
      {isExpanded ? (
        <ChevronDown className="w-4 h-4 text-gray-500" />
      ) : (
        <ChevronRight className="w-4 h-4 text-gray-500" />
      )}
    </div>
  )

  return (
    <div className="w-full min-w-64 max-w-96 bg-white border-r-2 border-dashed border-gray-300 p-2 md:p-3 space-y-2 md:space-y-3 overflow-y-auto resize-x">
      {/* Progress Header */}
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-4 h-4 text-blue-600" />
          <h1 className="font-semibold text-blue-800 text-sm">Deployment Guide</h1>
        </div>
        <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(completedSteps.size / 3) * 100}%` }}
          />
        </div>
        <p className="text-xs text-blue-600">{completedSteps.size} of 3 steps completed</p>
      </div>
      {/* Step 1: Project Setup & Configuration */}
      <div className="space-y-2">
        <StepHeader 
          step={1} 
          title="Project Setup & Configuration"
          isExpanded={expandedSections.has(1)}
          onToggle={() => toggleSection(1)}
          isCompleted={completedSteps.has(1)}
        />
        {expandedSections.has(1) && (
          <div className="pl-4 space-y-4">
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Project Initialization</h3>
              <ProjectDropdowns />
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">AI Instructions</h3>
              <div className="relative">
                <Input 
                  placeholder="e.g., gpt-4-turbo, claude-3-sonnet, gemini-pro" 
                  className="pr-10 text-sm" 
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => navigator.clipboard.writeText("llms.txt")}
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Environment Setup</h3>
              <div className="relative">
                <Textarea
                  className="min-h-24 resize-none pr-8 text-xs font-mono"
                  placeholder={`# Environment variables
NODE_ENV=production
API_KEY=your_key_here
DATABASE_URL=postgresql://...

# Dependencies
npm install @pricing/core
pip install pricing-analytics`}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 bottom-2 h-6 w-6 p-0"
                  onClick={() => navigator.clipboard.writeText(document.querySelector("textarea")?.value || "")}
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              <div className="text-xs text-gray-400">
                📋 Copy and paste into your .env file
              </div>
            </div>

            <Button 
              size="sm" 
              className="w-full text-xs mt-4"
              onClick={() => toggleComplete(1)}
            >
              {completedSteps.has(1) ? "Setup Complete ✓" : "Complete Setup"}
            </Button>
          </div>
        )}
      </div>

      {/* Step 2: Deployment */}
      <div className="space-y-2">
        <StepHeader 
          step={2} 
          title="Deploy Application"
          isExpanded={expandedSections.has(2)}
          onToggle={() => toggleSection(2)}
          isCompleted={completedSteps.has(2)}
        />
        {expandedSections.has(2) && (
          <div className="pl-4 space-y-2">
            <div className="relative">
              <Textarea
                className="min-h-20 resize-none pr-8 text-xs font-mono"
                placeholder={`# Quick deploy commands:
vercel --prod
# or
npm run build && npm start`}
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 bottom-2 h-6 w-6 p-0"
                onClick={() => console.log("Deploying...")}
              >
                <Play className="w-3 h-3 text-green-600" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Step 3: Integration */}
      <div className="space-y-2">
        <StepHeader 
          step={3} 
          title="Export & Integrate"
          isExpanded={expandedSections.has(3)}
          onToggle={() => toggleSection(3)}
          isCompleted={completedSteps.has(3)}
        />
        {expandedSections.has(3) && (
          <div className="pl-4 space-y-2">
            <div className="flex gap-1">
              <Button variant="outline" size="sm" className="text-xs flex-1">
                <FileText className="w-3 h-3 mr-1" />
                Report
              </Button>
              <Button variant="outline" size="sm" className="text-xs flex-1">
                <FileCode className="w-3 h-3 mr-1" />
                API
              </Button>
            </div>
            <div className="relative">
              <Textarea 
                className="min-h-16 resize-none pr-8 text-xs font-mono"
                placeholder={`// Generated pricing API
export const pricingTiers = {
  basic: { price: 9.99, features: [...] },
  pro: { price: 19.99, features: [...] }
}`}
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 bottom-2 h-6 w-6 p-0"
                onClick={() => navigator.clipboard.writeText("Generated code copied!")}
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
            <div className="bg-green-50 p-2 rounded border border-green-200">
              <p className="text-xs text-green-700 font-medium">🎉 Ready to integrate into your application!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
