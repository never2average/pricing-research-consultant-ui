"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, FileText, Database, DollarSign } from "lucide-react"

const dropdownConfig = [
  {
    key: "docs",
    label: "Product Data:",
    icon: FileText,
    defaultLabel: "Select option",
    storageKey: "selectedDocs",
    options: [
      { label: "API Documentation", value: "API Documentation" },
      { label: "User Guide", value: "User Guide" },
      { label: "Technical Specs", value: "Technical Specs" },
    ],
  },
  {
    key: "cdp",
    label: "Customer Data:",
    icon: Database,
    defaultLabel: "Select option",
    storageKey: "selectedCDP",
    options: [
      { label: "Customer Data", value: "Customer Data" },
      { label: "Analytics Platform", value: "Analytics Platform" },
      { label: "Data Pipeline", value: "Data Pipeline" },
    ],
  },
  {
    key: "revenue",
    label: "Revenue Data:",
    icon: DollarSign,
    defaultLabel: "Select option",
    storageKey: "selectedRevenue",
    options: [
      { label: "Revenue Tracking", value: "Revenue Tracking" },
      { label: "Pricing Models", value: "Pricing Models" },
      { label: "Financial Reports", value: "Financial Reports" },
    ],
  },
]

export function ProjectDropdowns() {
  const [selections, setSelections] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    dropdownConfig.forEach((config) => {
      initial[config.key] = config.defaultLabel
    })
    return initial
  })

  useEffect(() => {
    const loadedSelections: Record<string, string> = {}
    dropdownConfig.forEach((config) => {
      const saved = localStorage.getItem(config.storageKey)
      if (saved) {
        loadedSelections[config.key] = saved
      }
    })

    if (Object.keys(loadedSelections).length > 0) {
      setSelections((prev) => ({ ...prev, ...loadedSelections }))
    }
  }, [])

  const updateSelection = (key: string, value: string, storageKey: string) => {
    setSelections((prev) => ({ ...prev, [key]: value }))
    localStorage.setItem(storageKey, value)
  }

  return (
    <div className="flex flex-col gap-2">
      {dropdownConfig.map((config) => {
        const IconComponent = config.icon
        return (
          <div key={config.key} className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <IconComponent className="w-3 h-3 text-gray-600" />
              <label className="text-xs font-medium text-gray-700 min-w-fit">{config.label}</label>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="bg-transparent text-xs md:text-sm flex-1">
                  {selections[config.key]} <ChevronDown className="w-3 h-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {config.options.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => updateSelection(config.key, option.value, config.storageKey)}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      })}
    </div>
  )
}
