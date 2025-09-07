"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LeftSidebar } from "@/components/left-sidebar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, History, Plus } from "lucide-react"
import { CurrentRunsModal } from "@/components/current-runs-modal"
import { CreateExperimentModal } from "@/components/create-experiment-modal"
import { apiService } from "@/lib/api-service"
import { Product } from "@/lib/api-types"

export default function WorkflowManager() {
  const router = useRouter()
  const [selectedProject, setSelectedProject] = useState("")
  const [currentRunsOpen, setCurrentRunsOpen] = useState(false)
  const [createExperimentOpen, setCreateExperimentOpen] = useState(false)
  const [projects, setProjects] = useState<Product[]>([])
  const [loadingProjects, setLoadingProjects] = useState(false)
  const [selectedProductData, setSelectedProductData] = useState<Product | null>(null)
  const [loadingDocuments, setLoadingDocuments] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredProjects, setFilteredProjects] = useState<Product[]>([])
  const [experiments, setExperiments] = useState<any[]>([])
  const [loadingExperiments, setLoadingExperiments] = useState(false)

  const handleCreateExperiment = () => {
    setCreateExperimentOpen(true)
  }

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoadingProjects(true)
        const projectsData = await apiService.getAllProducts()
        setProjects(projectsData)
        setFilteredProjects(projectsData)
      } catch (err) {
        console.error('Failed to load projects:', err)
        // Keep projects empty array on error to prevent UI breakage
      } finally {
        setLoadingProjects(false)
      }
    }

    loadProjects()
  }, [])

  useEffect(() => {
    const loadExperiments = async () => {
      try {
        setLoadingExperiments(true)
        const runs = await apiService.getAllRuns()
        
        // Transform runs into experiment format for display
        const experimentData = runs.slice(0, 4).map((run, index) => {
          const objectives = [
            { label: "Revenue Optimization", variant: "default" as const },
            { label: "Market Penetration", variant: "secondary" as const },
            { label: "Customer Retention", variant: "outline" as const },
            { label: "Margin Improvement", variant: "destructive" as const }
          ]
          
          const usecases = ["A/B Price Testing", "Dynamic Pricing", "Bundle Optimization", "Competitor Analysis"]
          
          const statusMap = {
            running: { label: "Running", color: "bg-green-100 text-green-800" },
            completed: { label: "Completed", color: "bg-blue-100 text-blue-800" },
            failed: { label: "Failed", color: "bg-red-100 text-red-800" },
            paused: { label: "Pending", color: "bg-yellow-100 text-yellow-800" }
          }
          
          const status = statusMap[run.status as keyof typeof statusMap] || statusMap.paused
          
          return {
            id: run._id,
            experimentId: run._id.slice(-6).toUpperCase(),
            product: run.task_name || `Product ${index + 1}`,
            objective: objectives[index % objectives.length],
            usecase: usecases[index % usecases.length],
            startDate: new Date(run.started_at).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }),
            endDate: run.completed_at ? 
              new Date(run.completed_at).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }) :
              new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }),
            status
          }
        })
        
        setExperiments(experimentData)
      } catch (err) {
        console.error('Failed to load experiments:', err)
      } finally {
        setLoadingExperiments(false)
      }
    }

    loadExperiments()
  }, [])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProjects(projects)
    } else {
      const filtered = projects.filter(project => 
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.icp_description && project.icp_description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (project.features_description_summary && project.features_description_summary.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      setFilteredProjects(filtered)
    }
  }, [searchQuery, projects])

  useEffect(() => {
    const loadSelectedProductData = async () => {
      if (!selectedProject) {
        setSelectedProductData(null)
        return
      }

      try {
        setLoadingDocuments(true)
        // First try to find in existing projects data
        const existingProject = projects.find(p => p._id === selectedProject)
        if (existingProject) {
          setSelectedProductData(existingProject)
        }
      } catch (err) {
        console.error('Failed to load selected product data:', err)
        setSelectedProductData(null)
      } finally {
        setLoadingDocuments(false)
      }
    }

    loadSelectedProductData()
  }, [selectedProject, projects])

  const handleRowClick = (experimentId: string) => {
    router.push(`/experiment/${experimentId}`)
  }

  return (
    <div className="h-screen bg-gray-50 flex">
      <LeftSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Pricing Experiments Table */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      className="pl-10 pr-4 py-2 rounded-full text-sm w-72 md:w-96 lg:w-[500px]"
                      placeholder="Search projects..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  {/* Project Dropdown */}
                  <Select value={selectedProject} onValueChange={setSelectedProject}>
                    <SelectTrigger className="w-32 md:w-40 rounded-full text-sm" disabled={loadingProjects}>
                      <SelectValue placeholder={loadingProjects ? "Loading..." : "Project Name"} />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredProjects.map((project) => (
                        <SelectItem key={project._id} value={project._id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Create Experiment Button - moved to the right */}
                <Button 
                  onClick={handleCreateExperiment}
                  className="rounded-full text-sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Experiment
                </Button>
              </div>
            </div>

            {/* Projects List Section */}
            {(searchQuery || filteredProjects.length > 0) && (
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    {searchQuery ? `Search Results (${filteredProjects.length})` : `All Projects (${filteredProjects.length})`}
                  </h3>
                  {searchQuery && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSearchQuery("")}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Clear Search
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-64 overflow-y-auto">
                  {filteredProjects.map((project) => (
                    <div 
                      key={project._id} 
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedProject === project._id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedProject(project._id)}
                    >
                      <h4 className="font-medium text-gray-900 mb-2">{project.name}</h4>
                      {project.icp_description && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {project.icp_description}
                        </p>
                      )}
                      {project.features_description_summary && (
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {project.features_description_summary}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Documents Section - shows when project is selected */}
            {selectedProductData && (
              <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {selectedProductData.name} - Product Documents
                    </h3>
                    {selectedProductData.icp_description && (
                      <p className="text-sm text-gray-600 mb-3">
                        <strong>ICP Description:</strong> {selectedProductData.icp_description}
                      </p>
                    )}
                    {selectedProductData.features_description_summary && (
                      <p className="text-sm text-gray-600 mb-3">
                        <strong>Features Summary:</strong> {selectedProductData.features_description_summary}
                      </p>
                    )}
                    {loadingDocuments ? (
                      <div className="text-sm text-gray-500">Loading documents...</div>
                    ) : selectedProductData.product_documentations && selectedProductData.product_documentations.length > 0 ? (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Product Documentation:</h4>
                        <div className="space-y-2">
                          {selectedProductData.product_documentations.map((doc, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span className="text-sm text-gray-600">{doc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">No documents available for this product.</div>
                    )}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedProject("")}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <span className="text-lg">&times;</span>
                  </Button>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Experiment ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pricing Objective
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pricing Usecase
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Started On
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ETA
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Agent Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loadingExperiments ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                        Loading experiments...
                      </td>
                    </tr>
                  ) : experiments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                        No experiments found
                      </td>
                    </tr>
                  ) : (
                    experiments.map((experiment) => (
                      <tr
                        key={experiment.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleRowClick(experiment.experimentId)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {experiment.experimentId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {experiment.product}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={experiment.objective.variant}>{experiment.objective.label}</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {experiment.usecase}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {experiment.startDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {experiment.endDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${experiment.status.color}`}>
                            {experiment.status.label}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <CurrentRunsModal open={currentRunsOpen} onOpenChange={setCurrentRunsOpen} />
      <CreateExperimentModal 
        open={createExperimentOpen} 
        onOpenChange={setCreateExperimentOpen}
        products={projects}
        loadingProducts={loadingProjects}
      />
    </div>
  )
}
