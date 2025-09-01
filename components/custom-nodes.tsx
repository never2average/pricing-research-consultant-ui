import { Handle, Position } from "reactflow"

interface NodeData {
  label: string
}

export function CustomerSegmentNode({ data }: { data: NodeData }) {
  return (
    <div className="w-16 h-16 rounded-full border-2 border-blue-600 bg-blue-100 text-blue-800 flex items-center justify-center font-semibold text-base shadow-lg hover:shadow-xl transition-shadow">
      {data.label}
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-blue-600 border-2 border-white" />
    </div>
  )
}

export function PricingPlanNode({ data }: { data: NodeData }) {
  return (
    <div className="w-16 h-16 rounded-lg border-2 border-green-600 bg-green-100 text-green-800 flex items-center justify-center font-semibold text-base shadow-lg hover:shadow-xl transition-shadow">
      {data.label}
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-green-600 border-2 border-white" />
    </div>
  )
}
