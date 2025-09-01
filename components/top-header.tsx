"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye } from "lucide-react"
import { CurrentRunsModal } from "./current-runs-modal"

export function TopHeader() {
  const [selectedProject, setSelectedProject] = useState("")
  const [currentRunsOpen, setCurrentRunsOpen] = useState(false)

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
            <SelectTrigger className="w-32 md:w-40 rounded-full text-sm border-0 bg-transparent">
              <SelectValue placeholder="Project Name" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="project1">Project Alpha</SelectItem>
              <SelectItem value="project2">Project Beta</SelectItem>
              <SelectItem value="project3">Project Gamma</SelectItem>
            </SelectContent>
          </Select>

          <Button
            size="sm"
            className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-4"
            onClick={() => setCurrentRunsOpen(true)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Current Runs
          </Button>
        </div>
      </div>

      <CurrentRunsModal open={currentRunsOpen} onOpenChange={setCurrentRunsOpen} />
    </>
  )
}
