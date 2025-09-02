declare module 'react-cytoscapejs' {
  import * as React from 'react'
  
  interface CytoscapeComponentProps {
    elements?: any[]
    style?: React.CSSProperties
    stylesheet?: any[]
    cy?: (cy: any) => void
    layout?: any
    wheelSensitivity?: number
    minZoom?: number
    maxZoom?: number
    zoomingEnabled?: boolean
    userZoomingEnabled?: boolean
    panningEnabled?: boolean
    userPanningEnabled?: boolean
    boxSelectionEnabled?: boolean
    selectionType?: string
    autoungrabify?: boolean
    autounselectify?: boolean
  }

  const CytoscapeComponent: React.FC<CytoscapeComponentProps>
  export default CytoscapeComponent
}
