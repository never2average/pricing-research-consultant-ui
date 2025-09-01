"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, BarChart3, DollarSign, Users } from "lucide-react"
import { CustomerSegmentModal } from "./customer-segment-modal"

export function FloatingActionButtons() {
  const [customerSegmentOpen, setCustomerSegmentOpen] = useState(false)

  return (
    <>
      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 flex flex-col gap-2 md:gap-3 z-10 items-end">
        <Button className="rounded-full shadow-lg bg-gray-700 hover:bg-gray-800 text-white text-xs md:text-sm px-3 py-2">
          <Plus className="w-3 h-3 md:w-4 md:h-4 " />
          <BarChart3 className="w-3 h-3 md:w-4 md:h-4" />
          Reports
        </Button>
        <Button className="rounded-full shadow-lg bg-gray-700 hover:bg-gray-800 text-white text-xs md:text-sm px-4 py-2">
          <Plus className="w-3 h-3 md:w-4 md:h-4 " />
          <DollarSign className="w-3 h-3 md:w-4 md:h-4" />
          Price experiment
        </Button>
        <Button
          className="rounded-full shadow-lg bg-gray-700 hover:bg-gray-800 text-white text-xs md:text-sm px-2 py-1"
          onClick={() => setCustomerSegmentOpen(true)}
        >
          <Plus className="w-3 h-3 md:w-4 md:h-4 " />
          <Users className="w-3 h-3 md:w-4 md:h-4" />
          Customer segment
        </Button>
      </div>

      <CustomerSegmentModal open={customerSegmentOpen} onOpenChange={setCustomerSegmentOpen} />
    </>
  )
}
