"use client"

import { useEffect, useRef, useState } from "react"
import CytoscapeComponent from "react-cytoscapejs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CurrentRunsModal } from "./current-runs-modal"
import { CustomerSegmentModal } from "./customer-segment-modal"
import { PricingPlanModal } from "./pricing-plan-modal"
import { apiService } from "@/lib/api-service"
import { CanvasData, CanvasNode, CanvasEdge } from "@/lib/api-types"

const cytoscapeStylesheet = [
  {
    selector: 'node[type="customerSegment"]',
    style: {
      "background-color": "#3b82f6",
      "border-color": "#1d4ed8",
      "border-width": 2,
      color: "white",
      label: "data(label)",
      "text-valign": "center",
      "text-halign": "center",
      "font-size": "12px",
      "font-weight": "bold",
      width: 60,
      height: 60,
      shape: "ellipse",
    },
  },
  {
    selector: 'node[type="pricingPlan"]',
    style: {
      "background-color": "#10b981",
      "border-color": "#059669",
      "border-width": 2,
      color: "white",
      label: "data(label)",
      "text-valign": "center",
      "text-halign": "center",
      "font-size": "12px",
      "font-weight": "bold",
      width: 80,
      height: 50,
      shape: "roundrectangle",
    },
  },
  {
    selector: 'edge[connectionType="finalized"]',
    style: {
      width: 3,
      "line-color": "#3b82f6",
      "target-arrow-color": "#3b82f6",
      "target-arrow-shape": "triangle",
      "curve-style": "bezier",
      "arrow-scale": 1.2,
    },
  },
  {
    selector: 'edge[connectionType="experimental"]',
    style: {
      width: 3,
      "line-color": "#10b981",
      "target-arrow-color": "#10b981",
      "target-arrow-shape": "triangle",
      "curve-style": "bezier",
      "line-style": "dashed",
      "arrow-scale": 1.2,
    },
  },
  {
    selector: "edge",
    style: {
      label: "data(percentage)",
      "font-size": "10px",
      "font-weight": "bold",
      "text-background-color": "white",
      "text-background-opacity": 0.8,
      "text-background-padding": "2px",
      "text-border-color": "#ccc",
      "text-border-width": 1,
      "text-border-opacity": 0.5,
    },
  },
]

// Initial empty elements - will be loaded from API
const initialElements: any[] = []

export function CanvasArea() {
  const [elements, setElements] = useState(initialElements)
  const [connectionType, setConnectionType] = useState<"finalized" | "experimental">("finalized")
  const [isConnecting, setIsConnecting] = useState(false)
  const [sourceNode, setSourceNode] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const cyRef = useRef<any>(null)

  const [showCurrentRunsModal, setShowCurrentRunsModal] = useState(false)
  const [showCustomerSegmentModal, setShowCustomerSegmentModal] = useState(false)
  const [showPricingPlanModal, setShowPricingPlanModal] = useState(false)
  const [selectedNodeData, setSelectedNodeData] = useState<any>(null)

  // Load canvas data from API on component mount
  useEffect(() => {
    loadCanvasData()
  }, [])

  const loadCanvasData = async () => {
    try {
      setLoading(true)
      setError(null)
      const canvasData = await apiService.getCanvasData()
      
      // Convert API data to cytoscape format
      const cytoscapeElements = [
        ...canvasData.nodes.map(node => ({
          data: node.data,
          position: node.position
        })),
        ...canvasData.edges.map(edge => ({
          data: edge.data
        }))
      ]
      
      setElements(updatePercentages(cytoscapeElements))
    } catch (err) {
      console.error('Failed to load canvas data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load canvas data')
    } finally {
      setLoading(false)
    }
  }

  const updatePercentages = (newElements: any[]) => {
    const edges = newElements.filter((el) => el.data.source)
    const connectionsBySource = new Map<string, any[]>()

    edges.forEach((edge) => {
      if (!connectionsBySource.has(edge.data.source)) {
        connectionsBySource.set(edge.data.source, [])
      }
      connectionsBySource.get(edge.data.source)!.push(edge)
    })

    return newElements.map((el) => {
      if (el.data.source) {
        const sourceConnections = connectionsBySource.get(el.data.source)!
        if (sourceConnections.length === 1) {
          return { ...el, data: { ...el.data, percentage: "100%" } }
        } else {
          const percentage = Math.round(100 / sourceConnections.length)
          return { ...el, data: { ...el.data, percentage: `${percentage}%` } }
        }
      }
      return el
    })
  }

  useEffect(() => {
    if (cyRef.current) {
      const cy = cyRef.current

      const handleNodeTap = async (evt: any) => {
        const node = evt.target
        const nodeType = node.data("type")
        const nodeData = node.data()
        const isShiftPressed = evt.originalEvent?.shiftKey

        console.log("[API] Node clicked:", nodeType, "Shift pressed:", isShiftPressed, "Is connecting:", isConnecting)

        if (isShiftPressed) {
          // Connection mode with shift key
          if (nodeType === "customerSegment" && !isConnecting) {
            setIsConnecting(true)
            setSourceNode(node.id())
            cy.nodes().addClass("connecting")
            console.log("[API] Started connection from:", node.id())
          } else if (nodeType === "pricingPlan" && isConnecting && sourceNode) {
            try {
              // Extract actual segment and plan IDs from the node data
              const sourceNodeData = cy.getElementById(sourceNode).data()
              const sourceSegmentId = sourceNodeData.segment_id
              const targetPlanId = nodeData.plan_id
              
              console.log("[API] Creating connection:", sourceSegmentId, "->", targetPlanId)
              
              const result = await apiService.createCanvasConnection(
                sourceSegmentId,
                targetPlanId,
                connectionType
              )
              
              if (result.success) {
                console.log("[API] Connection created successfully")
                // Reload canvas data to reflect the new connection
                await loadCanvasData()
              } else {
                console.error('[API] Failed to create connection')
              }
            } catch (err) {
              console.error('[API] Error creating connection:', err)
            }

            // Reset connection state
            setIsConnecting(false)
            setSourceNode(null)
            cy.nodes().removeClass("connecting")
          }
        } else {
          // Modal opening mode without shift key
          if (nodeType === "customerSegment") {
            console.log("[API] Opening customer segment modal")
            setSelectedNodeData(nodeData)
            setShowCustomerSegmentModal(true)
          } else if (nodeType === "pricingPlan") {
            console.log("[API] Opening pricing plan modal")
            setSelectedNodeData(nodeData)
            setShowPricingPlanModal(true)
          }
        }
      }

      const handleEdgeRightClick = async (evt: any) => {
        const edge = evt.target
        const edgeData = edge.data()

        try {
          console.log("[API] Deleting connection:", edgeData.link_id)
          
          // Delete the connection via API
          if (edgeData.link_id) {
            const result = await apiService.deleteCanvasConnection(edgeData.link_id)
            if (result.success) {
              console.log("[API] Connection deleted successfully")
              // Reload canvas data to reflect the deletion
              await loadCanvasData()
            } else {
              console.error('[API] Failed to delete connection')
            }
          }
        } catch (err) {
          console.error('[API] Error deleting connection:', err)
        }
      }

      cy.on("tap", "node", handleNodeTap)

      // Cancel connection on background click
      cy.on("tap", (evt: any) => {
        if (evt.target === cy) {
          setIsConnecting(false)
          setSourceNode(null)
          cy.nodes().removeClass("connecting")
        }
      })

      cy.on("cxttap", "edge", handleEdgeRightClick)

      cy.on("zoom", (evt: any) => {
        if (evt.originalEvent && evt.originalEvent.type === "click") {
          evt.preventDefault()
          evt.stopPropagation()
        }
      })

      return () => {
        cy.off("tap", "node", handleNodeTap)
        cy.off("cxttap", "edge", handleEdgeRightClick)
      }
    }
  }, [elements, connectionType, isConnecting, sourceNode, loadCanvasData])

  if (loading) {
    return (
      <div className="flex-1 relative bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading canvas data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 relative bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">Error loading canvas data: {error}</div>
      </div>
    )
  }

  return (
    <div className="flex-1 relative bg-gray-50">
      <div className="absolute bottom-6 left-6 bg-white p-4 rounded-xl shadow-lg z-20 border border-gray-200">
        <div className="space-y-3">
          <div className="space-y-1 text-xs text-gray-600">
            <div>• Click nodes to view details</div>
            <div>• Hold Shift + click CS → PP to connect</div>
            <div>• Auto-calculates percentages</div>
            <div>• Right-click arrows to delete</div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">Connection Type:</label>
            <Select
              value={connectionType}
              onValueChange={(value: "finalized" | "experimental") => setConnectionType(value)}
            >
              <SelectTrigger className="w-full text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="finalized">Finalized (Solid)</SelectItem>
                <SelectItem value="experimental">Experimental (Dashed)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isConnecting && <div className="text-xs text-blue-600 font-medium">Click a Pricing Plan to connect</div>}
        </div>
      </div>

      <CytoscapeComponent
        elements={elements}
        style={{ width: "100%", height: "100%" }}
        stylesheet={cytoscapeStylesheet}
        cy={(cy: any) => {
          cyRef.current = cy
          cy.autoungrabify(false)
          cy.autounselectify(true)
          cy.boxSelectionEnabled(false)
        }}
        layout={{
          name: "preset",
        }}
        wheelSensitivity={0.2}
        minZoom={0.5}
        maxZoom={2}
        zoomingEnabled={true}
        userZoomingEnabled={true}
        panningEnabled={true}
        userPanningEnabled={true}
        boxSelectionEnabled={false}
        selectionType="single"
        autoungrabify={false}
        autounselectify={true}
      />

      <CurrentRunsModal open={showCurrentRunsModal} onOpenChange={setShowCurrentRunsModal} />

      <CustomerSegmentModal 
        open={showCustomerSegmentModal} 
        onOpenChange={setShowCustomerSegmentModal} 
        segmentData={selectedNodeData}
      />

      <PricingPlanModal 
        open={showPricingPlanModal} 
        onOpenChange={setShowPricingPlanModal} 
        planData={selectedNodeData}
      />

      <style jsx>{`
        :global(.connecting) {
          border: 3px solid #fbbf24 !important;
          box-shadow: 0 0 10px rgba(251, 191, 36, 0.5) !important;
        }
      `}</style>
    </div>
  )
}
