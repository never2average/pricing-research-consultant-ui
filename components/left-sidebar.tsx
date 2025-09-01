"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Copy, FileText, FileCode, Play } from "lucide-react"
import { ProjectDropdowns } from "./project-dropdowns"
import { FormSection } from "./form-section"

export function LeftSidebar() {
  return (
    <div className="w-full md:w-80 bg-white border-r-2 border-dashed border-gray-300 p-2 md:p-3 space-y-2 md:space-y-3 overflow-y-auto">
      {/* Add a new project */}
      <div className="space-y-1 md:space-y-2">
        <h1 className="font-semibold text-gray-900 text-lg">Add a new project</h1>
        <ProjectDropdowns />
      </div>

      {/* Configure coding agent */}
      <FormSection title="Configure coding agent">
        <div className="relative">
          <Input placeholder="llms.txt" className="pr-10 text-sm" />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-gray-100"
              onClick={() => navigator.clipboard.writeText("llms.txt")}
            >
              <Copy className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
            </Button>
          </div>
        </div>
      </FormSection>

      {/* Setup your environment */}
      <FormSection title="Setup your environment">
        <div className="relative">
          <Textarea
            className="min-h-28 md:min-h-40 resize-none pr-10 text-sm"
            placeholder="Enter environment configuration..."
          />
          <div className="absolute right-3 bottom-3">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-gray-100"
              onClick={() => navigator.clipboard.writeText(document.querySelector("textarea")?.value || "")}
            >
              <Copy className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
            </Button>
          </div>
        </div>
      </FormSection>

      {/* Host your automation */}
      <FormSection title="Host your automation">
        <div className="relative">
          <Textarea
            className="min-h-24 md:min-h-32 resize-none pr-10 text-sm"
            placeholder="Enter automation hosting details..."
          />
          <div className="absolute right-3 bottom-3">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-gray-100"
              onClick={() =>
                console.log("[v0] Running automation:", document.querySelectorAll("textarea")[1]?.value || "")
              }
            >
              <Play className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
            </Button>
          </div>
        </div>
      </FormSection>

      {/* Implement new pricing recommendations */}
      <FormSection title="Implement new pricing recommendations">
        <div className="flex gap-2 mb-2">
          <Button variant="outline" size="sm" className="text-xs md:text-sm bg-transparent">
            <FileText className="w-3 h-3 md:w-4 md:h-4 mr-1" />
            Export PDF
          </Button>
          <Button variant="outline" size="sm" className="text-xs md:text-sm bg-transparent">
            <FileCode className="w-3 h-3 md:w-4 md:h-4 mr-1" />
            Export JSON
          </Button>
        </div>
        <div className="relative">
          <Textarea className="min-h-20 md:min-h-24 resize-none pr-10 text-sm" placeholder="Enter pricing details..." />
          <div className="absolute right-3 bottom-3">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-gray-100"
              onClick={() => navigator.clipboard.writeText(document.querySelectorAll("textarea")[2]?.value || "")}
            >
              <Copy className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
            </Button>
          </div>
        </div>
      </FormSection>
    </div>
  )
}
