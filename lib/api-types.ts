// API Response Types for localhost:5000 endpoints

export interface CustomerSegment {
  _id: string
  product?: string
  customer_segment_uid: string
  customer_segment_name: string
  customer_segment_description: string
  created_at?: string
  updated_at?: string
}

export interface PricingPlan {
  _id: string
  plan_name: string
  unit_price: number
  min_unit_count: number
  unit_calculation_logic: string
  min_unit_utilization_period: string
  created_at?: string
  updated_at?: string
}

export interface Product {
  _id: string
  name: string
  icp_description?: string
  unit_level_cogs?: string
  features_description_summary?: string
  competitors?: Competitor[]
  product_documentations?: string[]
  vector_store_id?: string
  created_at?: string
  updated_at?: string
}

export interface Competitor {
  competitor_name: string
  website_url: string
  product_description: string
}

export interface SegmentPlanLink {
  _id: string
  customer_segment_id: string
  pricing_plan_id: string
  connection_type: "finalized" | "experimental"
  percentage?: number
  created_at?: string
  updated_at?: string
  is_active?: boolean
}

export interface SegmentPlanLinkWithDetails extends SegmentPlanLink {
  customer_segment?: CustomerSegment
  pricing_plan?: PricingPlan
}

export interface SearchResult {
  type: "customer_segment" | "pricing_plan" | "product" | "other"
  id: string
  title: string
  description: string
  score?: number
}

export interface SearchResponse {
  results: SearchResult[]
  total_count: number
  query: string
}

export interface ScheduledReport {
  _id: string
  name: string
  schedule_type: string
  schedule_config: any
  report_sections: ReportSection[]
  recipients: string[]
  created_at: string
  status: "active" | "paused" | "completed"
}

export interface ReportSection {
  id: string
  name: string
  prompt: string
  section_type?: string
}

export interface HistoricalRun {
  _id: string
  invocation_id: string
  task_type: string
  task_name: string
  status: "running" | "completed" | "failed" | "paused"
  started_at: string
  completed_at?: string
  duration?: string
  participants?: number
  conversion?: string
  task_details: string
  progress?: {
    completed_steps: number
    total_steps: number
    current_step?: string
  }
}

export interface RunLog {
  timestamp: string
  level: "INFO" | "ERROR" | "WARNING" | "DEBUG"
  message: string
  step_name?: string
  details?: any
}

export interface RunLogsResponse {
  invocation_id: string
  logs: RunLog[]
  status: string
}

export interface ProductIntegration {
  _id: string
  product_id: string
  integration_type: string
  config: any
  status: "active" | "inactive" | "pending"
  created_at: string
}

export interface DataSource {
  _id: string
  name: string
  source_type: string
  connection_status: "connected" | "disconnected" | "error"
  last_sync?: string
  config?: any
}

export interface EnvironmentConfig {
  openai_api_key_configured: boolean
  database_connected: boolean
  vector_store_enabled: boolean
  services_status: {
    [key: string]: "running" | "stopped" | "error"
  }
}

export interface LLMTextConfig {
  system_prompts: {
    [key: string]: string
  }
  analysis_templates: {
    [key: string]: string
  }
  response_formats: {
    [key: string]: any
  }
}

export interface AutomationConfig {
  _id: string
  name: string
  automation_type: string
  trigger_config: any
  action_config: any
  is_active: boolean
  last_run?: string
  next_run?: string
}

export interface OrchestrationRequest {
  workflow_type: "pricing_analysis" | "customer_segmentation" | "revenue_forecast" | "full_analysis"
  product_id?: string
  parameters?: {
    analysis_depth?: "basic" | "comprehensive"
    include_forecasting?: boolean
    target_segments?: string[]
    [key: string]: any
  }
}

export interface OrchestrationResponse {
  invocation_id: string
  status: "started" | "running" | "completed" | "failed"
  message: string
}

// Canvas-specific types for visualization
export interface CanvasNode {
  data: {
    id: string
    label: string
    type: "customerSegment" | "pricingPlan"
    segment_id?: string
    plan_id?: string
  }
  position: {
    x: number
    y: number
  }
}

export interface CanvasEdge {
  data: {
    id: string
    source: string
    target: string
    connectionType: "finalized" | "experimental"
    percentage?: string
    link_id?: string
  }
}

export interface CanvasData {
  nodes: CanvasNode[]
  edges: CanvasEdge[]
}

// Revenue analysis types for modals
export interface RevenueTimeSeriesData {
  date: string
  value: number
}

export interface SegmentRevenueData {
  segment_id: string
  segment_name: string
  revenue_data: RevenueTimeSeriesData[]
  active_subscriptions: RevenueTimeSeriesData[]
  forecast_data?: RevenueTimeSeriesData[]
}

export interface PlanRevenueData {
  plan_id: string
  plan_name: string
  revenue_data: RevenueTimeSeriesData[]
  segment_contributions: {
    segment_id: string
    segment_name: string
    contribution_percentage: number
    revenue: number
  }[]
}

// API Error Response
export interface APIError {
  error: string
  message: string
  details?: any
}

// Generic API Response wrapper
export interface APIResponse<T> {
  success: boolean
  data?: T
  error?: APIError
}

// List response wrapper
export interface ListResponse<T> {
  items: T[]
  total_count: number
  page?: number
  page_size?: number
}
