import { BaseEdge, EdgeLabelRenderer, getBezierPath, type EdgeProps } from "reactflow"

interface CustomEdgeData {
  type: "finalized" | "experimental"
  percentage?: number
}

export function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps<CustomEdgeData>) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const isExperimental = data?.type === "experimental"
  const strokeColor = isExperimental ? "#10b981" : "#3b82f6"
  const strokeDasharray = isExperimental ? "5,5" : "none"

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: strokeColor,
          strokeWidth: 2,
          strokeDasharray,
        }}
        markerEnd={`url(#arrowhead-${data?.type || "finalized"})`}
      />
      <EdgeLabelRenderer>
        {data?.percentage && data.percentage < 100 && (
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "all",
            }}
            className="bg-white px-2 py-1 rounded text-xs font-semibold text-gray-700 shadow-sm border"
          >
            {data.percentage}%
          </div>
        )}
      </EdgeLabelRenderer>
    </>
  )
}
