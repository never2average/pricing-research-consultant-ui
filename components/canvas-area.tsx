"use client"

import { useEffect, useRef, useState } from "react"
import CytoscapeComponent from "react-cytoscapejs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CurrentRunsModal } from "./current-runs-modal"
import { CustomerSegmentModal } from "./customer-segment-modal"

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

const initialElements = [
  // Customer Segment nodes
  { data: { id: "cs1", label: "CS1", type: "customerSegment" }, position: { x: 100, y: 100 } },
  { data: { id: "cs2", label: "CS2", type: "customerSegment" }, position: { x: 100, y: 200 } },
  { data: { id: "cs3", label: "CS3", type: "customerSegment" }, position: { x: 100, y: 300 } },

  // Pricing Plan nodes
  { data: { id: "pp1", label: "PP1", type: "pricingPlan" }, position: { x: 400, y: 100 } },
  { data: { id: "pp2", label: "PP2", type: "pricingPlan" }, position: { x: 400, y: 200 } },

  // Initial connections
  { data: { id: "e1", source: "cs1", target: "pp1", connectionType: "finalized", percentage: "100%" } },
  { data: { id: "e2", source: "cs2", target: "pp2", connectionType: "experimental", percentage: "60%" } },
  { data: { id: "e3", source: "cs2", target: "pp1", connectionType: "finalized", percentage: "40%" } },
]

export function CanvasArea() {
  const [elements, setElements] = useState(initialElements)
  const [connectionType, setConnectionType] = useState<"finalized" | "experimental">("finalized")
  const [isConnecting, setIsConnecting] = useState(false)
  const [sourceNode, setSourceNode] = useState<string | null>(null)
  const cyRef = useRef<any>(null)

  const [showCurrentRunsModal, setShowCurrentRunsModal] = useState(false)
  const [showCustomerSegmentModal, setShowCustomerSegmentModal] = useState(false)
  const [selectedNodeData, setSelectedNodeData] = useState<any>(null)

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

      cy.on("tap", "node", (evt: any) => {
        const node = evt.target
        const nodeType = node.data("type")
        const isShiftPressed = evt.originalEvent?.shiftKey

        console.log("[v0] Node clicked:", nodeType, "Shift pressed:", isShiftPressed, "Is connecting:", isConnecting)

        if (isShiftPressed) {
          // Connection mode with shift key
          if (nodeType === "customerSegment" && !isConnecting) {
            setIsConnecting(true)
            setSourceNode(node.id())
            cy.nodes().addClass("connecting")
            console.log("[v0] Started connection from:", node.id())
          } else if (nodeType === "pricingPlan" && isConnecting && sourceNode) {
            // Create new connection
            const newEdge = {
              data: {
                id: `e${Date.now()}`,
                source: sourceNode,
                target: node.id(),
                connectionType,
                percentage: "100%",
              },
            }

            const updatedElements = updatePercentages([...elements, newEdge])
            setElements(updatedElements)
            console.log("[v0] Created connection:", sourceNode, "->", node.id())

            // Reset connection state
            setIsConnecting(false)
            setSourceNode(null)
            cy.nodes().removeClass("connecting")
          }
        } else {
          // Modal opening mode without shift key
          if (nodeType === "customerSegment") {
            console.log("[v0] Opening customer segment modal")
            setSelectedNodeData(node.data())
            setShowCustomerSegmentModal(true)
          } else if (nodeType === "pricingPlan") {
            console.log("[v0] Opening current runs modal")
            setSelectedNodeData(node.data())
            setShowCurrentRunsModal(true)
          }
        }
      })

      // Cancel connection on background click
      cy.on("tap", (evt: any) => {
        if (evt.target === cy) {
          setIsConnecting(false)
          setSourceNode(null)
          cy.nodes().removeClass("connecting")
        }
      })

      cy.on("cxttap", "edge", (evt: any) => {
        const edge = evt.target
        const edgeId = edge.id()

        // Remove the edge from elements
        const updatedElements = elements.filter((el) => el.data.id !== edgeId)
        const recalculatedElements = updatePercentages(updatedElements)
        setElements(recalculatedElements)

        console.log("[v0] Deleted edge:", edgeId)
      })

      cy.on("zoom", (evt) => {
        if (evt.originalEvent && evt.originalEvent.type === "click") {
          evt.preventDefault()
          evt.stopPropagation()
        }
      })
    }
  }, [elements, connectionType, isConnecting, sourceNode])

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
        cy={(cy) => {
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

      <CustomerSegmentModal open={showCustomerSegmentModal} onOpenChange={setShowCustomerSegmentModal} />

      <style jsx>{`
        :global(.connecting) {
          border: 3px solid #fbbf24 !important;
          box-shadow: 0 0 10px rgba(251, 191, 36, 0.5) !important;
        }
      `}</style>
    </div>
  )
}
