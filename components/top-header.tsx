"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, History } from "lucide-react"
import { CurrentRunsModal } from "./current-runs-modal"
import { apiService } from "@/lib/api-service"
import { Product } from "@/lib/api-types"

export function TopHeader() {
  const [selectedProject, setSelectedProject] = useState("")
  const [currentRunsOpen, setCurrentRunsOpen] = useState(false)
  const [projects, setProjects] = useState<Product[]>([])
  const [loadingProjects, setLoadingProjects] = useState(false)

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoadingProjects(true)
        const projectsData = await apiService.getAllProducts()
        setProjects(projectsData)
      } catch (err) {
        console.error('Failed to load projects:', err)
        // Keep projects empty array on error to prevent UI breakage
      } finally {
        setLoadingProjects(false)
      }
    }

    loadProjects()
  }, [])

  return (
    <>
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 ml-48 md:ml-40 lg:ml-48">
        <div className="bg-white rounded-full shadow-lg border border-gray-200 p-2 flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              className="pl-10 pr-4 py-2 rounded-full text-sm border-0 bg-transparent focus:outline-none w-48 md:w-64"
              placeholder="Search projects..."
            />
          </div>

          {/* Project Dropdown */}
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-32 md:w-40 rounded-full text-sm border-0 bg-transparent" disabled={loadingProjects}>
              <SelectValue placeholder={loadingProjects ? "Loading..." : "Project Name"} />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project._id} value={project._id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            size="sm"
            className="rounded-full bg-gray-700 hover:bg-gray-800 text-white px-4"
            onClick={() => setCurrentRunsOpen(true)}
          >
            <History className="w-4 h-4" />
            Historical Runs
          </Button>
        </div>
      </div>

      <CurrentRunsModal open={currentRunsOpen} onOpenChange={setCurrentRunsOpen} />
    </>
  )
}
