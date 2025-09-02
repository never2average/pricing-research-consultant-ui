"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Copy, FileText, FileCode, Play, CheckCircle, Circle, ChevronDown, ChevronRight, AlertCircle, Lightbulb } from "lucide-react"
import { ProjectDropdowns } from "./project-dropdowns"
import { FormSection } from "./form-section"
import { apiService } from "@/lib/api-service"
import { EnvironmentConfig, LLMTextConfig } from "@/lib/api-types"

export function LeftSidebar() {
  const [completedSteps, setCompletedSteps] = useState(new Set())
  const [expandedSections, setExpandedSections] = useState(new Set([1])) // Start with step 1
  const [envConfig, setEnvConfig] = useState("")
  const [llmModel, setLlmModel] = useState("")
  const [deploymentStatus, setDeploymentStatus] = useState("")
  const [generatedCode, setGeneratedCode] = useState("")
  const [loading, setLoading] = useState(false)
  
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

  // Load environment configuration on mount
  useEffect(() => {
    const loadConfiguration = async () => {
      try {
        const [envData, llmData] = await Promise.all([
          apiService.getEnvironmentConfig(),
          apiService.getLLMTextConfig()
        ])

        // Build environment config display
        const envLines = []
        envLines.push("# Environment Status")
        envLines.push(`NODE_ENV=production`)
        envLines.push(`DATABASE_CONNECTED=${envData.database_connected ? 'true' : 'false'}`)
        envLines.push(`OPENAI_API_CONFIGURED=${envData.openai_api_key_configured ? 'true' : 'false'}`)
        envLines.push(`VECTOR_STORE_ENABLED=${envData.vector_store_enabled ? 'true' : 'false'}`)
        envLines.push("")
        envLines.push("# Services Status")
        Object.entries(envData.services_status).forEach(([service, status]) => {
          envLines.push(`${service.toUpperCase()}_STATUS=${status}`)
        })
        
        setEnvConfig(envLines.join('\n'))
        
        // Set default LLM model if available
        if (llmData.system_prompts) {
          setLlmModel("gpt-4-turbo")
        }
      } catch (error) {
        console.error("Failed to load configuration:", error)
        setEnvConfig("# Error loading environment configuration\n# Please check API connection")
      }
    }

    loadConfiguration()
  }, [])

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

  const handleDeploy = async () => {
    setLoading(true)
    setDeploymentStatus("Deploying...")
    try {
      const response = await apiService.startOrchestration({
        workflow_type: "full_analysis",
        parameters: {
          analysis_depth: "comprehensive",
          include_forecasting: true
        }
      })
      
      setDeploymentStatus(`Deployment started! Invocation ID: ${response.invocation_id}`)
      toggleComplete(2)
    } catch (error) {
      setDeploymentStatus("Deployment failed. Please check logs.")
      console.error("Deployment error:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateExportCode = async () => {
    try {
      const [segments, plans, links] = await Promise.all([
        apiService.getCustomerSegments(),
        apiService.getPricingPlans(),
        apiService.getAllSegmentPlanLinks()
      ])

      const exportCode = `// Generated Pricing Configuration
export const pricingTiers = {
${plans.map(plan => `  ${plan.plan_name.toLowerCase().replace(/\s+/g, '_')}: {
    price: ${plan.unit_price},
    minUnits: ${plan.min_unit_count},
    period: "${plan.min_unit_utilization_period}",
    calculation: "${plan.unit_calculation_logic}"
  }`).join(',\n')}
}

export const customerSegments = {
${segments.map(segment => `  ${segment.customer_segment_name.toLowerCase().replace(/\s+/g, '_')}: {
    name: "${segment.customer_segment_name}",
    description: "${segment.customer_segment_description}"
  }`).join(',\n')}
}

// Active segment-plan connections
export const segmentPlanMappings = [
${links.filter(link => link.is_active !== false).map(link => `  {
    segmentId: "${link.customer_segment_id}",
    planId: "${link.pricing_plan_id}",
    type: "${link.connection_type}",
    percentage: ${link.percentage || 100}
  }`).join(',\n')}
]`

      setGeneratedCode(exportCode)
      toggleComplete(3)
    } catch (error) {
      console.error("Failed to generate export code:", error)
      setGeneratedCode("// Error generating export code\n// Please check API connection")
    }
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
                  value={llmModel}
                  onChange={(e) => setLlmModel(e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => navigator.clipboard.writeText(llmModel)}
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
                  value={envConfig}
                  onChange={(e) => setEnvConfig(e.target.value)}
                  placeholder="Loading environment configuration..."
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 bottom-2 h-6 w-6 p-0"
                  onClick={() => navigator.clipboard.writeText(envConfig)}
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
                value={deploymentStatus || `# Quick deploy commands:
vercel --prod
# or
npm run build && npm start
# or
Click the play button to start automated orchestration`}
                readOnly
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 bottom-2 h-6 w-6 p-0"
                onClick={handleDeploy}
                disabled={loading}
              >
                <Play className={`w-3 h-3 ${loading ? 'text-gray-400' : 'text-green-600'}`} />
              </Button>
            </div>
            {deploymentStatus && (
              <div className="bg-blue-50 p-2 rounded border border-blue-200">
                <p className="text-xs text-blue-700">{deploymentStatus}</p>
              </div>
            )}
            <Button 
              size="sm" 
              className="w-full text-xs mt-2"
              onClick={() => toggleComplete(2)}
            >
              {completedSteps.has(2) ? "Deployment Complete ✓" : "Mark as Deployed"}
            </Button>
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
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs flex-1"
                onClick={generateExportCode}
                disabled={loading}
              >
                <FileText className="w-3 h-3 mr-1" />
                Generate Report
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs flex-1"
                onClick={generateExportCode}
                disabled={loading}
              >
                <FileCode className="w-3 h-3 mr-1" />
                Generate API
              </Button>
            </div>
            <div className="relative">
              <Textarea 
                className="min-h-16 resize-none pr-8 text-xs font-mono"
                value={generatedCode || `// Click "Generate API" to create your pricing configuration
// This will pull live data from your segments and pricing plans
export const pricingTiers = {
  // Generated from API data...
}`}
                readOnly
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 bottom-2 h-6 w-6 p-0"
                onClick={() => navigator.clipboard.writeText(generatedCode || "No code generated yet")}
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
            {generatedCode && (
              <div className="bg-green-50 p-2 rounded border border-green-200">
                <p className="text-xs text-green-700 font-medium">🎉 Ready to integrate into your application!</p>
              </div>
            )}
            <Button 
              size="sm" 
              className="w-full text-xs mt-2"
              onClick={() => toggleComplete(3)}
            >
              {completedSteps.has(3) ? "Integration Complete ✓" : "Mark as Integrated"}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
