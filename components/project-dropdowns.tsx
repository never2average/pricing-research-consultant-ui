"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, FileText, Database, DollarSign } from "lucide-react"
import { apiService } from "@/lib/api-service"
import { DataSource } from "@/lib/api-types"

const dropdownStaticConfig = [
  {
    key: "docs",
    label: "Product Data:",
    icon: FileText,
    defaultLabel: "Select option",
    storageKey: "selectedDocs",
    apiLoader: () => apiService.getProductSources(),
  },
  {
    key: "cdp",
    label: "Customer Data:",
    icon: Database,
    defaultLabel: "Select option",
    storageKey: "selectedCDP",
    apiLoader: () => apiService.getCustomerSegmentSources(),
  },
  {
    key: "revenue",
    label: "Revenue Data:",
    icon: DollarSign,
    defaultLabel: "Select option",
    storageKey: "selectedRevenue",
    apiLoader: () => apiService.getRevenueSources(),
  },
]

export function ProjectDropdowns() {
  const [selections, setSelections] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    dropdownStaticConfig.forEach((config) => {
      initial[config.key] = config.defaultLabel
    })
    return initial
  })

  const [dropdownOptions, setDropdownOptions] = useState<Record<string, DataSource[]>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [error, setError] = useState<Record<string, string | null>>({})

  // Load saved selections from localStorage
  useEffect(() => {
    const loadedSelections: Record<string, string> = {}
    dropdownStaticConfig.forEach((config) => {
      const saved = localStorage.getItem(config.storageKey)
      if (saved) {
        loadedSelections[config.key] = saved
      }
    })

    if (Object.keys(loadedSelections).length > 0) {
      setSelections((prev) => ({ ...prev, ...loadedSelections }))
    }
  }, [])

  // Load dropdown options from APIs
  useEffect(() => {
    const loadDropdownOptions = async () => {
      for (const config of dropdownStaticConfig) {
        try {
          setLoading(prev => ({ ...prev, [config.key]: true }))
          setError(prev => ({ ...prev, [config.key]: null }))
          
          const options = await config.apiLoader()
          setDropdownOptions(prev => ({ ...prev, [config.key]: options }))
        } catch (err) {
          console.error(`Failed to load ${config.key} options:`, err)
          let errorMessage = `Failed to load ${config.label.toLowerCase()}`
          
          if (err instanceof Error) {
            if (err.message.includes('Cannot connect to backend server')) {
              errorMessage = 'Backend server not accessible'
            } else if (err.message.includes('Failed to fetch')) {
              errorMessage = 'Network connection failed'
            } else {
              errorMessage = err.message
            }
          }
          
          setError(prev => ({ 
            ...prev, 
            [config.key]: errorMessage
          }))
          // Set empty options on error to prevent UI breakage
          setDropdownOptions(prev => ({ ...prev, [config.key]: [] }))
        } finally {
          setLoading(prev => ({ ...prev, [config.key]: false }))
        }
      }
    }

    loadDropdownOptions()
  }, [])

  const updateSelection = (key: string, value: string, storageKey: string) => {
    setSelections((prev) => ({ ...prev, [key]: value }))
    localStorage.setItem(storageKey, value)
  }

  return (
    <div className="flex flex-col gap-2">
      {dropdownStaticConfig.map((config) => {
        const IconComponent = config.icon
        const isLoading = loading[config.key]
        const hasError = error[config.key]
        const options = dropdownOptions[config.key] || []
        
        return (
          <div key={config.key} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <IconComponent className="w-3 h-3 text-gray-600" />
              <label className="text-xs font-medium text-gray-700 min-w-fit">{config.label}</label>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-transparent text-xs w-32 justify-between"
                  disabled={isLoading}
                >
                  <span className="truncate">
                    {isLoading ? "Loading..." : 
                     hasError ? "Error" :
                     selections[config.key]}
                  </span>
                  <ChevronDown className="w-3 h-3 ml-1 flex-shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {isLoading ? (
                  <DropdownMenuItem disabled>
                    <span className="text-gray-500">Loading...</span>
                  </DropdownMenuItem>
                ) : hasError ? (
                  <DropdownMenuItem disabled>
                    <span className="text-red-500 text-xs">{error[config.key]}</span>
                  </DropdownMenuItem>
                ) : options.length === 0 ? (
                  <DropdownMenuItem disabled>
                    <span className="text-gray-500">No data available</span>
                  </DropdownMenuItem>
                ) : (
                  options.map((dataSource) => (
                    <DropdownMenuItem
                      key={dataSource._id}
                      onClick={() => updateSelection(config.key, dataSource.name, config.storageKey)}
                    >
                      <div className="flex flex-col">
                        <span className="text-sm">{dataSource.name}</span>
                        <span className="text-xs text-gray-500">{dataSource.source_type}</span>
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      })}
    </div>
  )
}
