"use client"

import { LeftSidebar } from "@/components/left-sidebar"
import { TopHeader } from "@/components/top-header"
import { CanvasArea } from "@/components/canvas-area"
import { FloatingActionButtons } from "@/components/floating-action-buttons"

export default function WorkflowManager() {
  return (
    <div className="h-screen bg-gray-50 flex">
      <LeftSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopHeader />
        <CanvasArea />
        <FloatingActionButtons />
      </div>
    </div>
  )
}
