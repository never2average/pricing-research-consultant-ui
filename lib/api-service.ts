import { 
  CustomerSegment,
  PricingPlan,
  Product,
  SegmentPlanLink,
  SegmentPlanLinkWithDetails,
  SearchResponse,
  ScheduledReport,
  HistoricalRun,
  RunLogsResponse,
  ProductIntegration,
  DataSource,
  EnvironmentConfig,
  LLMTextConfig,
  AutomationConfig,
  OrchestrationRequest,
  OrchestrationResponse,
  CanvasData,
  APIResponse,
  ListResponse,
  ReportSection
} from './api-types'

const API_BASE_URL = 'http://localhost:5000'

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    }

    const config: RequestInit = {
      headers: defaultHeaders,
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      }
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error)
      throw error
    }
  }

  // Customer Segment APIs
  async getCustomerSegments(): Promise<CustomerSegment[]> {
    return this.request<CustomerSegment[]>('/customer-segment/list')
  }

  async getCustomerSegment(id: string): Promise<CustomerSegment> {
    return this.request<CustomerSegment>(`/customer-segment/read?id=${id}`)
  }

  async createCustomerSegment(segment: Omit<CustomerSegment, '_id'>): Promise<CustomerSegment> {
    return this.request<CustomerSegment>('/customer-segment/create', {
      method: 'POST',
      body: JSON.stringify(segment)
    })
  }

  async deleteCustomerSegment(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>('/customer-segment/delete', {
      method: 'DELETE',
      body: JSON.stringify({ id })
    })
  }

  // Pricing Plan APIs
  async getPricingPlans(): Promise<PricingPlan[]> {
    return this.request<PricingPlan[]>('/pricing-plan/list')
  }

  async getPricingPlan(id: string): Promise<PricingPlan> {
    return this.request<PricingPlan>(`/pricing-plan/read?id=${id}`)
  }

  async createPricingPlan(plan: Omit<PricingPlan, '_id'>): Promise<PricingPlan> {
    return this.request<PricingPlan>('/pricing-plan/create', {
      method: 'POST',
      body: JSON.stringify(plan)
    })
  }

  async deletePricingPlan(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>('/pricing-plan/delete', {
      method: 'DELETE',
      body: JSON.stringify({ id })
    })
  }

  // Segment-Plan Link APIs
  async createSegmentPlanLink(link: {
    customer_segment_id: string
    pricing_plan_id: string
    connection_type: "finalized" | "experimental"
  }): Promise<SegmentPlanLink> {
    return this.request<SegmentPlanLink>('/customer-segment/pricing-plan/link/create', {
      method: 'POST',
      body: JSON.stringify(link)
    })
  }

  async updateSegmentPlanLink(linkId: string, updates: Partial<SegmentPlanLink>): Promise<SegmentPlanLink> {
    return this.request<SegmentPlanLink>('/customer-segment/pricing-plan/link/update', {
      method: 'PUT',
      body: JSON.stringify({ id: linkId, ...updates })
    })
  }

  async deleteSegmentPlanLink(linkId: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>('/customer-segment/pricing-plan/link/delete', {
      method: 'DELETE',
      body: JSON.stringify({ id: linkId })
    })
  }

  async getAllSegmentPlanLinks(includeSuggestions = false): Promise<SegmentPlanLinkWithDetails[]> {
    const endpoint = `/customer-segment/pricing-plan/link/listall${includeSuggestions ? '?suggestions=true' : ''}`
    return this.request<SegmentPlanLinkWithDetails[]>(endpoint)
  }

  // Search API
  async search(query: string): Promise<SearchResponse> {
    return this.request<SearchResponse>('/search', {
      method: 'POST',
      body: JSON.stringify({ query })
    })
  }

  // Reporting API
  async createScheduledReport(report: {
    name: string
    schedule_type: string
    schedule_config: any
    sections: ReportSection[]
    recipients?: string[]
  }): Promise<ScheduledReport> {
    return this.request<ScheduledReport>('/scheduled-reporting/create', {
      method: 'POST',
      body: JSON.stringify(report)
    })
  }

  // Historical APIs
  async getAllRuns(): Promise<HistoricalRun[]> {
    return this.request<HistoricalRun[]>('/historical/allruns')
  }

  async getRunLogs(invocationId: string): Promise<RunLogsResponse> {
    return this.request<RunLogsResponse>(`/historical/runlogs?invocation_id=${invocationId}`)
  }

  // Product APIs
  async getProducts(): Promise<Product[]> {
    return this.request<Product[]>('/product/list')
  }

  async getAllProducts(): Promise<Product[]> {
    return this.request<Product[]>('/product/listall')
  }

  async createProduct(product: Omit<Product, '_id'>): Promise<Product> {
    return this.request<Product>('/product/create', {
      method: 'POST',
      body: JSON.stringify(product)
    })
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    return this.request<Product>('/product/update', {
      method: 'PUT',
      body: JSON.stringify({ id, ...updates })
    })
  }

  async deleteProduct(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>('/product/delete', {
      method: 'DELETE',
      body: JSON.stringify({ id })
    })
  }

  // Product Integration APIs
  async createProductIntegration(integration: {
    product_id: string
    integration_type: string
    config: any
  }): Promise<ProductIntegration> {
    return this.request<ProductIntegration>('/productintegration/create', {
      method: 'POST',
      body: JSON.stringify(integration)
    })
  }

  // Data Sources APIs
  async getProductSources(): Promise<DataSource[]> {
    return this.request<DataSource[]>('/productsources/list')
  }

  async getRevenueSources(): Promise<DataSource[]> {
    return this.request<DataSource[]>('/revenuesources/list')
  }

  async getCustomerSegmentSources(): Promise<DataSource[]> {
    return this.request<DataSource[]>('/customersegmentsources/list')
  }

  // Configuration APIs
  async getEnvironmentConfig(): Promise<EnvironmentConfig> {
    return this.request<EnvironmentConfig>('/envs/get')
  }

  async getLLMTextConfig(): Promise<LLMTextConfig> {
    return this.request<LLMTextConfig>('/llmstxt/get')
  }

  // Automation APIs
  async getAutomationConfig(): Promise<AutomationConfig[]> {
    return this.request<AutomationConfig[]>('/automation/get')
  }

  async pushAutomationConfig(config: AutomationConfig): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>('/automation/push', {
      method: 'POST',
      body: JSON.stringify(config)
    })
  }

  // Orchestration API
  async startOrchestration(request: OrchestrationRequest): Promise<OrchestrationResponse> {
    return this.request<OrchestrationResponse>('/orchestration', {
      method: 'POST',
      body: JSON.stringify(request)
    })
  }

  // Canvas Data Helper - converts API data to canvas format
  async getCanvasData(): Promise<CanvasData> {
    try {
      const [segments, plans, links] = await Promise.all([
        this.getCustomerSegments(),
        this.getPricingPlans(),
        this.getAllSegmentPlanLinks()
      ])

      const nodes = [
        ...segments.map((segment, index) => ({
          data: {
            id: `cs-${segment._id}`,
            label: segment.customer_segment_name,
            type: "customerSegment" as const,
            segment_id: segment._id
          },
          position: { x: 100, y: 100 + (index * 100) }
        })),
        ...plans.map((plan, index) => ({
          data: {
            id: `pp-${plan._id}`,
            label: plan.plan_name,
            type: "pricingPlan" as const,
            plan_id: plan._id
          },
          position: { x: 400, y: 100 + (index * 100) }
        }))
      ]

      const edges = links.map((link, index) => ({
        data: {
          id: `edge-${link._id}`,
          source: `cs-${link.customer_segment_id}`,
          target: `pp-${link.pricing_plan_id}`,
          connectionType: link.connection_type,
          percentage: link.percentage ? `${link.percentage}%` : undefined,
          link_id: link._id
        }
      }))

      return { nodes, edges }
    } catch (error) {
      console.error('Failed to load canvas data:', error)
      // Return empty canvas data on error to prevent UI crash
      return { nodes: [], edges: [] }
    }
  }

  // Canvas Connection Helpers
  async createCanvasConnection(
    sourceSegmentId: string,
    targetPlanId: string,
    connectionType: "finalized" | "experimental"
  ): Promise<{ success: boolean; connection_id: string }> {
    try {
      const link = await this.createSegmentPlanLink({
        customer_segment_id: sourceSegmentId,
        pricing_plan_id: targetPlanId,
        connection_type: connectionType
      })
      return { success: true, connection_id: link._id }
    } catch (error) {
      console.error('Failed to create canvas connection:', error)
      return { success: false, connection_id: '' }
    }
  }

  async deleteCanvasConnection(linkId: string): Promise<{ success: boolean }> {
    return this.deleteSegmentPlanLink(linkId)
  }
}

// Export singleton instance
export const apiService = new ApiService()
export default apiService
