# Backend Integration Guide - Pricing Research Consultant UI

## System Overview

This is an AI-powered pricing optimization platform that enables:
- Product documentation analysis with vector stores
- Customer segment analysis and revenue forecasting
- AI-driven pricing model recommendations
- Visual mapping of customer segments to pricing plans
- Time-series revenue tracking and forecasting
- Customer satisfaction prediction and usage analysis

## API Base URL
All APIs are available at: `http://localhost:5000`

## Core Entities & Data Models (Actual API Response Types)

### 1. Customer Segments
```typescript
interface CustomerSegment {
  _id: string
  product?: string
  customer_segment_uid: string
  customer_segment_name: string
  customer_segment_description: string
  created_at?: string
  updated_at?: string
}
```

### 2. Pricing Plans
```typescript
interface PricingPlan {
  _id: string
  plan_name: string
  unit_price: number
  min_unit_count: number
  unit_calculation_logic: string
  min_unit_utilization_period: string
  created_at?: string
  updated_at?: string
}
```

### 3. Products
```typescript
interface Product {
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

interface Competitor {
  competitor_name: string
  website_url: string
  product_description: string
}
```

### 4. Segment-Plan Links
```typescript
interface SegmentPlanLink {
  _id: string
  customer_segment_id: string
  pricing_plan_id: string
  connection_type: "finalized" | "experimental"
  percentage?: number
  created_at?: string
  updated_at?: string
  is_active?: boolean
}
```

### 4. AI Analysis & Recommendations
```typescript
interface PricingModelAIGapDiagnosis {
  _id: string
  pricing_model: string  // ProductPricingModel reference
  ai_gap_diagnosis_summary: string
  ai_gap_diagnosis_reasoning: string
}

interface RecommendedPricingModel {
  _id: string
  product: string  // Product reference
  customer_segment: string  // CustomerSegment reference
  pricing_plan: string  // ProductPricingModel reference
  new_revenue_forecast_ts_data: TimeseriesData[]
}
```

### 5. Revenue & Analytics Data
```typescript
interface PricingPlanSegmentContribution {
  _id: string
  product: string  // Product reference
  customer_segment: string  // CustomerSegment reference
  pricing_plan: string  // ProductPricingModel reference
  revenue_ts_data: TimeseriesData[]
  active_subscriptions: TimeseriesData[]
  revenue_forecast_ts_data: TimeseriesData[]
  active_subscriptions_forecast: TimeseriesData[]
}

interface TimeseriesData {
  date: Date
  value: number
}
```

### 6. Customer Usage Analysis
```typescript
interface CustomerUsageAnalysis {
  _id: string
  product: string  // Product reference
  customer_segment: string  // CustomerSegment reference
  customer_uid: string
  customer_task_to_agent: string
  predicted_customer_satisfaction_response: number
  predicted_customer_satisfaction_response_reasoning: string
}
```

### 7. Orchestration Results (Background Tasks)
```typescript
interface OrchestrationResult {
  _id: string
  invocation_id: string
  step_name: string
  step_order: number
  product_id?: string
  step_input: any  // Dynamic field
  step_output: any  // Dynamic field
  created_at: Date
}
```

## Available API Endpoints (localhost:5000)

### Customer Segment APIs

#### GET /customer-segment/list
- **Purpose**: List all customer segments
- **Response**: `CustomerSegment[]`

#### GET /customer-segment/read
- **Purpose**: Get specific customer segment
- **Query Parameters**: `id` (required)
- **Response**: `CustomerSegment`

#### POST /customer-segment/create
- **Purpose**: Create new customer segment
- **Request Body**:
```json
{
  "customer_segment_name": "High-Value Enterprise Users",
  "customer_segment_uid": "HV_ENTERPRISE_001",
  "customer_segment_description": "Large enterprises with high usage and revenue potential",
  "product": "product_id"
}
```
- **Response**: `CustomerSegment`

#### DELETE /customer-segment/delete
- **Purpose**: Delete customer segment
- **Request Body**: `{ "id": "segment_id" }`
- **Response**: `{ "success": boolean }`

### Pricing Plan APIs

#### GET /pricing-plan/list
- **Purpose**: List all pricing plans
- **Response**: `PricingPlan[]`

#### GET /pricing-plan/read
- **Purpose**: Get specific pricing plan
- **Query Parameters**: `id` (required)
- **Response**: `PricingPlan`

#### POST /pricing-plan/create
- **Purpose**: Create new pricing plan
- **Request Body**:
```json
{
  "plan_name": "Premium Plan",
  "unit_price": 89.99,
  "min_unit_count": 1,
  "unit_calculation_logic": "per user per month",
  "min_unit_utilization_period": "monthly"
}
```
- **Response**: `PricingPlan`

#### DELETE /pricing-plan/delete
- **Purpose**: Delete pricing plan
- **Request Body**: `{ "id": "plan_id" }`
- **Response**: `{ "success": boolean }`

### Segment-Plan Link APIs

#### POST /customer-segment/pricing-plan/link/create
- **Purpose**: Create connection between segment and pricing plan
- **Request Body**:
```json
{
  "customer_segment_id": "segment_id",
  "pricing_plan_id": "plan_id", 
  "connection_type": "finalized" | "experimental"
}
```
- **Response**: `SegmentPlanLink`

#### PUT /customer-segment/pricing-plan/link/update
- **Purpose**: Update segment-plan link
- **Request Body**: `{ "id": "link_id", ...updates }`
- **Response**: `SegmentPlanLink`

#### DELETE /customer-segment/pricing-plan/link/delete
- **Purpose**: Delete segment-plan link
- **Request Body**: `{ "id": "link_id" }`
- **Response**: `{ "success": boolean }`

#### GET /customer-segment/pricing-plan/link/listall
- **Purpose**: Get all segment-plan links
- **Query Parameters**: `suggestions=true` (optional, for AI suggestions)
- **Response**: `SegmentPlanLinkWithDetails[]`

### Product APIs

#### GET /product/list
- **Purpose**: List all products (active)
- **Response**: `Product[]`

#### GET /product/listall
- **Purpose**: List all products (including inactive)
- **Response**: `Product[]`

#### POST /product/create
- **Purpose**: Create new product
- **Request Body**:
```json
{
  "name": "Advanced Analytics Platform",
  "icp_description": "Enterprise teams requiring data insights",
  "unit_level_cogs": "Server costs, API usage, storage",
  "features_description_summary": "Real-time analytics, custom dashboards, API access",
  "competitors": [
    {
      "competitor_name": "Competitor A",
      "website_url": "https://competitor-a.com",
      "product_description": "Similar analytics platform"
    }
  ],
  "product_documentations": [
    "https://docs.example.com/api"
  ]
}
```
- **Response**: `Product`

#### PUT /product/update
- **Purpose**: Update product
- **Request Body**: `{ "id": "product_id", ...updates }`
- **Response**: `Product`

#### DELETE /product/delete
- **Purpose**: Delete product
- **Request Body**: `{ "id": "product_id" }`
- **Response**: `{ "success": boolean }`

### Search API

#### POST /search
- **Purpose**: Search across products, segments, and pricing plans
- **Request Body**:
```json
{
  "query": "enterprise pricing"
}
```
- **Response**: `SearchResponse`

### Reporting APIs

#### POST /scheduled-reporting/create
- **Purpose**: Create scheduled report
- **Request Body**:
```json
{
  "name": "Monthly Revenue Report",
  "schedule_type": "monthly",
  "schedule_config": {
    "day_of_month": 1,
    "time": "09:00"
  },
  "sections": [
    {
      "id": "revenue_summary",
      "name": "Revenue Summary",
      "prompt": "Generate revenue summary"
    }
  ],
  "recipients": ["admin@company.com"]
}
```
- **Response**: `ScheduledReport`

### Historical & Orchestration APIs

#### GET /historical/allruns
- **Purpose**: Get all orchestration runs (current and historical)
- **Response**: `HistoricalRun[]`

#### GET /historical/runlogs
- **Purpose**: Get logs for specific orchestration run
- **Query Parameters**: `invocation_id` (required)
- **Response**: `RunLogsResponse`

#### POST /orchestration
- **Purpose**: Start new orchestration workflow
- **Request Body**:
```json
{
  "workflow_type": "pricing_analysis",
  "product_id": "product_id",
  "parameters": {
    "analysis_depth": "comprehensive",
    "include_forecasting": true
  }
}
```
- **Response**: `OrchestrationResponse`

### Integration & Data Source APIs

#### POST /productintegration/create
- **Purpose**: Create product integration
- **Request Body**:
```json
{
  "product_id": "product_id",
  "integration_type": "api",
  "config": {
    "endpoint": "https://api.example.com",
    "auth_token": "token"
  }
}
```
- **Response**: `ProductIntegration`

#### GET /productsources/list
- **Purpose**: List available product data sources
- **Response**: `DataSource[]`

#### GET /revenuesources/list
- **Purpose**: List available revenue data sources
- **Response**: `DataSource[]`

#### GET /customersegmentsources/list
- **Purpose**: List available customer segment data sources
- **Response**: `DataSource[]`

### Configuration APIs

#### GET /envs/get
- **Purpose**: Get environment configuration status
- **Response**: `EnvironmentConfig`

#### GET /llmstxt/get
- **Purpose**: Get LLM text configuration and prompts
- **Response**: `LLMTextConfig`

### Automation APIs

#### GET /automation/get
- **Purpose**: Get automation configurations
- **Response**: `AutomationConfig[]`

#### POST /automation/push
- **Purpose**: Update automation configuration
- **Request Body**: `AutomationConfig`
- **Response**: `{ "success": boolean }`

### AI Analysis & Recommendations

#### GET /api/ai-analysis/gap-diagnosis
- **Purpose**: Get AI gap diagnosis for pricing models
- **Query Parameters**: `pricing_model_id?`
- **Response**: `PricingModelAIGapDiagnosis[]`

#### POST /api/ai-analysis/gap-diagnosis
- **Purpose**: Generate AI gap diagnosis for a pricing model
- **Request Body**:
```json
{
  "pricing_model": "pricing_model_id",
  "context": "Additional context for AI analysis"
}
```
- **Response**: `PricingModelAIGapDiagnosis`

#### GET /api/recommendations/pricing
- **Purpose**: Get AI-generated pricing recommendations
- **Query Parameters**: `product_id?, customer_segment_id?`
- **Response**: `RecommendedPricingModel[]`

#### POST /api/recommendations/generate
- **Purpose**: Generate new pricing recommendations using AI
- **Request Body**:
```json
{
  "product": "product_id",
  "customer_segment": "segment_id",
  "analysis_prompt": "Focus on enterprise customers with high usage"
}
```
- **Response**: `RecommendedPricingModel`

### Revenue Analytics & Forecasting

#### GET /api/analytics/segment-contribution
- **Purpose**: Get revenue contribution by segment and pricing plan
- **Query Parameters**: `product_id?, segment_id?, plan_id?`
- **Response**: `PricingPlanSegmentContribution[]`

#### POST /api/analytics/segment-contribution
- **Purpose**: Create/update segment contribution data
- **Request Body**:
```json
{
  "product": "product_id",
  "customer_segment": "segment_id",
  "pricing_plan": "plan_id",
  "revenue_ts_data": [
    { "date": "2024-01-01T00:00:00Z", "value": 15000 },
    { "date": "2024-02-01T00:00:00Z", "value": 18000 }
  ],
  "active_subscriptions": [
    { "date": "2024-01-01T00:00:00Z", "value": 150 },
    { "date": "2024-02-01T00:00:00Z", "value": 180 }
  ]
}
```
- **Response**: `PricingPlanSegmentContribution`

#### GET /api/analytics/revenue-attribution
- **Purpose**: Get revenue attribution analysis for dashboard
- **Query Parameters**: `product_id, timeRange?`
- **Response**:
```json
{
  "items": [
    {
      "plan": "Premium",
      "segment": "Enterprise",
      "revenue": 2808000,
      "percentage": 68,
      "users": 1936,
      "avgRevenue": 1450
    }
  ],
  "totalRevenue": 4945000,
  "timeSeries": [
    {
      "month": "Aug",
      "Premium": 2.1,
      "Enterprise": 1.8,
      "totalRevenue": 3.9
    }
  ]
}
```

### Customer Usage Analysis

#### GET /api/usage-analysis
- **Purpose**: Get customer usage analysis data
- **Query Parameters**: `product_id?, segment_id?, customer_uid?`
- **Response**: `CustomerUsageAnalysis[]`

#### POST /api/usage-analysis
- **Purpose**: Create customer usage analysis entry
- **Request Body**:
```json
{
  "product": "product_id",
  "customer_segment": "segment_id",
  "customer_uid": "customer_123",
  "customer_task_to_agent": "Generate monthly reports with custom filters",
  "predicted_customer_satisfaction_response": 8.5,
  "predicted_customer_satisfaction_response_reasoning": "High usage of advanced features suggests satisfaction"
}
```
- **Response**: `CustomerUsageAnalysis`

### Orchestration & Background Tasks

#### GET /api/orchestration/runs
- **Purpose**: List orchestration runs (current/historical)
- **Query Parameters**: `invocation_id?, product_id?, status?`
- **Response**: `OrchestrationResult[] (grouped by invocation_id)`

#### POST /api/orchestration/start
- **Purpose**: Start new orchestration workflow
- **Request Body**:
```json
{
  "workflow_type": "pricing_analysis" | "customer_segmentation" | "revenue_forecast",
  "product_id": "product_id",
  "parameters": {
    "analysis_depth": "comprehensive",
    "include_forecasting": true
  }
}
```
- **Response**: `{ invocation_id: string, status: "started" }`

#### GET /api/orchestration/runs/:invocation_id
- **Purpose**: Get specific orchestration run details
- **Response**:
```json
{
  "invocation_id": "uuid",
  "status": "running" | "completed" | "failed",
  "steps": "OrchestrationResult[]",
  "progress": {
    "completed_steps": 5,
    "total_steps": 8,
    "current_step": "AI Analysis"
  }
}
```

#### GET /api/orchestration/runs/:invocation_id/logs
- **Purpose**: Get real-time logs for orchestration run
- **Response**: `OrchestrationResult[] (formatted as logs)`

### Reports

#### GET /api/reports
- **Purpose**: List available report templates
- **Response**:
```json
[
  {
    "id": "pricing_optimization_report",
    "name": "Pricing Optimization Report",
    "description": "Comprehensive analysis of pricing models and recommendations"
  }
]
```

#### POST /api/reports/generate
- **Purpose**: Generate custom report
- **Request Body**:
```json
{
  "name": "Monthly Revenue Report",
  "product_id": "product_id",
  "sections": [
    {
      "name": "Executive Summary",
      "prompt": "Generate executive summary of key pricing metrics"
    },
    {
      "name": "Revenue Analysis", 
      "prompt": "Analyze revenue trends by customer segment"
    }
  ],
  "time_range": {
    "start": "2024-01-01",
    "end": "2024-12-31"
  }
}
```
- **Response**: `{ report_id: string, generation_status: "started" }`

#### GET /api/reports/:report_id/status
- **Purpose**: Check report generation status
- **Response**: `{ status: "generating" | "completed" | "failed", download_url?: string }`

#### GET /api/analytics/performance-insights
- **Purpose**: Get AI-generated performance insights for UI dashboard
- **Query Parameters**: `product_id, segment_id?, plan_id?`
- **Response**:
```json
{
  "underperformingPlan": {
    "plan_name": "Basic Plan",
    "efficiency": 0.65,
    "valueGap": -12.4,
    "potentialRevenue": 125000
  },
  "overperformingPlan": {
    "plan_name": "Premium Plan", 
    "efficiency": 1.23,
    "valueGap": 8.7,
    "revenue": 2808000
  },
  "recommendations": [
    "Increase Premium plan rollout to Enterprise segment",
    "Review Basic plan pricing for better conversion",
    "Focus retention efforts on Premium subscribers"
  ],
  "potentialCapture": 450000
}
```

## WebSocket Events (Real-time Updates)

### Connection: `/ws`

#### Events to Listen For:
- `orchestration_updated`: When orchestration run status changes
- `orchestration_step_completed`: When individual orchestration step completes
- `orchestration_log`: New log entries for orchestration runs
- `revenue_data_updated`: When revenue analytics are recalculated
- `ai_analysis_completed`: When AI analysis/recommendations finish
- `vector_store_updated`: When product documentation vector store is updated
- `canvas_connection_updated`: When segment-to-plan connections change

#### Events to Emit:
- `subscribe_orchestration`: Subscribe to specific orchestration run updates
  ```json
  { "invocation_id": "uuid" }
  ```
- `unsubscribe_orchestration`: Unsubscribe from orchestration updates
- `subscribe_product_updates`: Subscribe to product-specific updates
  ```json
  { "product_id": "product_id" }
  ```

## Background Services Required

### 1. AI Analysis Engine
- Processes product documentation using OpenAI vector stores
- Generates pricing model gap diagnosis using LLM
- Creates pricing recommendations based on customer segments
- Handles competitive analysis and market positioning

### 2. Orchestration Engine
- Manages multi-step AI workflows (pricing analysis, segmentation, forecasting)
- Tracks workflow progress and logs each step
- Handles error recovery and workflow resumption
- Sends real-time updates via WebSocket

### 3. Revenue Analytics Service
- Calculates revenue attribution by segment and pricing plan
- Processes time-series data for forecasting
- Generates performance insights and recommendations
- Updates customer satisfaction predictions

### 4. Vector Store Management
- Monitors changes to product documentation URLs
- Downloads and processes documentation files
- Creates and updates OpenAI vector stores
- Handles vector store cleanup and optimization

## MongoDB Database Setup

Your existing MongoDB schema using MongoEngine is already well-structured. Here are the key considerations:

### Database Indexes
```python
# Add these indexes to your MongoDB collections for better performance

# Products collection
db.product.createIndex({ "name": 1 })
db.product.createIndex({ "vector_store_id": 1 })

# Customer Segments
db.customer_segment.createIndex({ "product": 1 })
db.customer_segment.createIndex({ "customer_segment_uid": 1 })
db.customer_segment.createIndex({ "product": 1, "customer_segment_name": 1 })

# Pricing Models
db.product_pricing_model.createIndex({ "plan_name": 1 })
db.product_pricing_model.createIndex({ "unit_price": 1 })

# Pricing Mappings
db.product_pricing_mapping.createIndex({ "product": 1, "is_active": 1 })
db.product_pricing_mapping.createIndex({ "pricing_model": 1 })

# Revenue Data (for time-series queries)
db.pricing_plan_segment_contribution.createIndex({ "product": 1, "customer_segment": 1 })
db.pricing_plan_segment_contribution.createIndex({ "pricing_plan": 1 })
db.pricing_plan_segment_contribution.createIndex({ "revenue_ts_data.date": 1 })

# Orchestration Results
db.orchestration_result.createIndex({ "invocation_id": 1, "step_order": 1 })
db.orchestration_result.createIndex({ "product_id": 1 })
db.orchestration_result.createIndex({ "created_at": -1 })

# Usage Analysis
db.customer_usage_analysis.createIndex({ "product": 1, "customer_segment": 1 })
db.customer_usage_analysis.createIndex({ "customer_uid": 1 })
```

### Data Relationships & Population
Your MongoEngine models already handle references properly. For API responses, you'll want to populate related fields:

```python
# Example: Get product with populated pricing mappings
product = Product.objects.get(id=product_id)
mappings = ProductPricingMapping.objects(product=product).populate('pricing_model')

# Example: Get segment with revenue data
segment = CustomerSegment.objects.get(id=segment_id).populate('product')
revenue_data = PricingPlanSegmentContribution.objects(customer_segment=segment)
```

## Additional Database Collections to Consider

### 1. User Management & Authentication
```python
class User(Document):
    email = StringField(required=True, unique=True)
    password_hash = StringField(required=True)
    first_name = StringField()
    last_name = StringField()
    role = StringField(choices=['admin', 'analyst', 'viewer'], default='analyst')
    company = StringField()
    is_active = BooleanField(default=True)
    last_login = DateTimeField()
    created_at = DateTimeField(default=datetime.utcnow)
    
    # User preferences
    dashboard_config = DynamicField()  # Store custom dashboard layouts
    notification_settings = DynamicField()

class UserSession(Document):
    user = ReferenceField(User)
    session_token = StringField(required=True, unique=True)
    expires_at = DateTimeField(required=True)
    ip_address = StringField()
    user_agent = StringField()
    created_at = DateTimeField(default=datetime.utcnow)
```

### 2. Workspaces/Projects Management
```python
class Workspace(Document):
    name = StringField(required=True)
    description = StringField()
    owner = ReferenceField(User)
    members = ListField(ReferenceField(User))
    settings = DynamicField()
    is_active = BooleanField(default=True)
    created_at = DateTimeField(default=datetime.utcnow)

class WorkspaceProduct(Document):
    workspace = ReferenceField(Workspace)
    product = ReferenceField(Product)
    role = StringField(choices=['primary', 'comparison', 'archived'])
    added_by = ReferenceField(User)
    added_at = DateTimeField(default=datetime.utcnow)
```

### 3. Enhanced Competitive Intelligence
```python
class CompetitorAnalysis(Document):
    product = ReferenceField(Product)
    competitor_name = StringField()
    pricing_data = ListField(EmbeddedDocumentListField(TimeseriesData))
    feature_comparison = DynamicField()
    market_position = StringField()
    ai_analysis_summary = StringField()
    analysis_date = DateTimeField(default=datetime.utcnow)
    data_source = StringField()  # 'manual', 'scraped', 'api'
    
class MarketIntelligence(Document):
    product = ReferenceField(Product)
    market_segment = StringField()
    market_size = FloatField()
    growth_rate = FloatField()
    pricing_trends = ListField(EmbeddedDocumentListField(TimeseriesData))
    key_insights = ListField(StringField())
    data_date = DateTimeField()
    created_at = DateTimeField(default=datetime.utcnow)
```

### 4. Pricing Experiments & What-If Scenarios
```python
class PricingExperiment(Document):
    name = StringField(required=True)
    product = ReferenceField(Product)
    experiment_type = StringField(choices=['price_change', 'new_tier', 'bundling'])
    hypothesis = StringField()
    target_segments = ListField(ReferenceField(CustomerSegment))
    
    # Experiment parameters
    baseline_pricing = ReferenceField(ProductPricingModel)
    experimental_pricing = DynamicField()  # New pricing structure
    
    # Predictions and results
    predicted_impact = DynamicField()
    actual_results = DynamicField()
    
    status = StringField(choices=['draft', 'running', 'completed', 'cancelled'])
    start_date = DateTimeField()
    end_date = DateTimeField()
    created_by = ReferenceField(User)
    created_at = DateTimeField(default=datetime.utcnow)

class ScenarioAnalysis(Document):
    name = StringField(required=True)
    product = ReferenceField(Product)
    scenario_type = StringField(choices=['optimistic', 'realistic', 'pessimistic'])
    assumptions = DynamicField()
    projections = EmbeddedDocumentListField(TimeseriesData)
    created_by = ReferenceField(User)
    created_at = DateTimeField(default=datetime.utcnow)
```

### 5. Customer Feedback & Satisfaction
```python
class CustomerFeedback(Document):
    product = ReferenceField(Product)
    customer_segment = ReferenceField(CustomerSegment)
    customer_uid = StringField()
    
    # Feedback data
    satisfaction_score = FloatField()  # 1-10
    price_perception = StringField(choices=['too_expensive', 'fair', 'cheap'])
    feature_requests = ListField(StringField())
    churn_risk = StringField(choices=['low', 'medium', 'high'])
    
    # Metadata
    feedback_source = StringField()  # 'survey', 'support', 'interview'
    feedback_date = DateTimeField()
    tags = ListField(StringField())
    created_at = DateTimeField(default=datetime.utcnow)

class CustomerBehaviorInsights(Document):
    product = ReferenceField(Product)
    customer_segment = ReferenceField(CustomerSegment)
    
    # Behavioral patterns
    usage_patterns = DynamicField()
    engagement_metrics = DynamicField()
    conversion_funnel = DynamicField()
    
    # AI-generated insights
    behavior_summary = StringField()
    recommendations = ListField(StringField())
    
    analysis_date = DateTimeField()
    created_at = DateTimeField(default=datetime.utcnow)
```

### 6. Notifications & Alerts
```python
class Alert(Document):
    type = StringField(choices=['price_anomaly', 'competitor_change', 'revenue_drop', 'churn_spike'])
    severity = StringField(choices=['low', 'medium', 'high', 'critical'])
    title = StringField(required=True)
    message = StringField(required=True)
    
    # Context
    product = ReferenceField(Product)
    customer_segment = ReferenceField(CustomerSegment)
    pricing_model = ReferenceField(ProductPricingModel)
    
    # Alert data
    trigger_data = DynamicField()
    threshold_breached = DynamicField()
    
    # Status
    is_acknowledged = BooleanField(default=False)
    acknowledged_by = ReferenceField(User)
    acknowledged_at = DateTimeField()
    is_resolved = BooleanField(default=False)
    
    created_at = DateTimeField(default=datetime.utcnow)

class NotificationPreference(Document):
    user = ReferenceField(User)
    product = ReferenceField(Product)
    alert_types = ListField(StringField())
    channels = ListField(StringField())  # ['email', 'in_app', 'slack']
    frequency = StringField(choices=['immediate', 'hourly', 'daily'])
    is_active = BooleanField(default=True)
```

### 7. Templates & Reusable Configurations
```python
class AnalysisTemplate(Document):
    name = StringField(required=True)
    description = StringField()
    template_type = StringField(choices=['segment_analysis', 'pricing_optimization', 'competitor_analysis'])
    
    # Template configuration
    parameters = DynamicField()
    ai_prompts = DynamicField()
    report_sections = ListField(DynamicField())
    
    # Usage tracking
    usage_count = IntField(default=0)
    created_by = ReferenceField(User)
    is_public = BooleanField(default=False)
    created_at = DateTimeField(default=datetime.utcnow)

class DashboardTemplate(Document):
    name = StringField(required=True)
    layout_config = DynamicField()  # Chart positions, sizes, types
    filters = DynamicField()
    created_by = ReferenceField(User)
    is_shared = BooleanField(default=False)
    created_at = DateTimeField(default=datetime.utcnow)
```

### 8. Audit Trail & Change History
```python
class AuditLog(Document):
    user = ReferenceField(User)
    action = StringField(required=True)  # 'create', 'update', 'delete'
    entity_type = StringField(required=True)  # 'Product', 'CustomerSegment', etc.
    entity_id = StringField(required=True)
    
    # Change details
    old_values = DynamicField()
    new_values = DynamicField()
    changes_summary = StringField()
    
    # Context
    ip_address = StringField()
    user_agent = StringField()
    session_id = StringField()
    
    created_at = DateTimeField(default=datetime.utcnow)

class DataVersions(Document):
    entity_type = StringField(required=True)
    entity_id = StringField(required=True)
    version_number = IntField(required=True)
    data_snapshot = DynamicField()
    change_reason = StringField()
    created_by = ReferenceField(User)
    created_at = DateTimeField(default=datetime.utcnow)
```

### 9. Integration & Data Sources
```python
class DataSource(Document):
    name = StringField(required=True)
    source_type = StringField(choices=['api', 'csv_upload', 'database', 'webhook'])
    connection_config = DynamicField()
    
    # Status
    is_active = BooleanField(default=True)
    last_sync = DateTimeField()
    sync_status = StringField(choices=['success', 'failed', 'partial'])
    error_message = StringField()
    
    created_by = ReferenceField(User)
    created_at = DateTimeField(default=datetime.utcnow)

class DataImport(Document):
    data_source = ReferenceField(DataSource)
    import_type = StringField(choices=['full', 'incremental'])
    
    # Import details
    records_processed = IntField(default=0)
    records_success = IntField(default=0)
    records_failed = IntField(default=0)
    
    # Status
    status = StringField(choices=['pending', 'processing', 'completed', 'failed'])
    error_logs = ListField(StringField())
    
    started_at = DateTimeField()
    completed_at = DateTimeField()
    created_at = DateTimeField(default=datetime.utcnow)
```

### 10. AI Model Management
```python
class AIModel(Document):
    name = StringField(required=True)
    model_type = StringField(choices=['pricing_optimization', 'customer_segmentation', 'churn_prediction'])
    provider = StringField(choices=['openai', 'claude', 'custom'])
    
    # Model configuration
    model_config = DynamicField()
    training_data_refs = ListField(StringField())
    
    # Performance metrics
    accuracy_metrics = DynamicField()
    last_evaluation = DateTimeField()
    
    # Status
    status = StringField(choices=['training', 'active', 'deprecated'])
    version = StringField()
    
    created_at = DateTimeField(default=datetime.utcnow)

class PredictionLog(Document):
    ai_model = ReferenceField(AIModel)
    input_data = DynamicField()
    prediction_result = DynamicField()
    confidence_score = FloatField()
    
    # Context
    product = ReferenceField(Product)
    customer_segment = ReferenceField(CustomerSegment)
    
    # Validation (if actual outcome is known later)
    actual_outcome = DynamicField()
    prediction_accuracy = FloatField()
    
    created_at = DateTimeField(default=datetime.utcnow)
```

## Environment Variables

```bash
# MongoDB Database
MONGODB_URI=mongodb://localhost:27017/pricing_research
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pricing_research

# OpenAI Integration (required for your vector stores and AI analysis)
OPENAI_API_KEY=sk-your-openai-api-key

# Optional: Additional AI providers
CLAUDE_API_KEY=your_claude_key
GEMINI_API_KEY=your_gemini_key

# Authentication
JWT_SECRET=your_jwt_secret_for_api_auth
SESSION_SECRET=your_session_secret_for_cookies

# Email (for report notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# File Storage (for temporary documentation downloads)
TEMP_FILE_DIR=/tmp/pricing_docs
MAX_FILE_SIZE_MB=50

# Application
NODE_ENV=production
PORT=3001
FRONTEND_URL=http://localhost:3000

# WebSocket
WS_PORT=3002
WS_CORS_ORIGINS=http://localhost:3000,https://yourdomain.com

# Background Processing
ORCHESTRATION_TIMEOUT_MINUTES=30
MAX_CONCURRENT_ORCHESTRATIONS=5

# Rate Limiting
RATE_LIMIT_REQUESTS_PER_MINUTE=100
RATE_LIMIT_AI_REQUESTS_PER_MINUTE=20
```

## Security Considerations

1. **OpenAI API Key Protection**: Store OpenAI API key securely, never expose in frontend
2. **Vector Store Security**: Implement access controls for vector store operations
3. **Input Validation**: Validate all URLs before downloading documentation files
4. **Rate Limiting**: Implement rate limiting on expensive AI operations and vector store creation
5. **File Upload Security**: Validate file types and sizes for documentation uploads
6. **MongoDB Security**: Use MongoDB authentication and connection encryption
7. **CORS**: Configure proper CORS policies for frontend communication

## Performance Optimizations

1. **MongoDB Indexing**: Create appropriate indexes as shown in the database section
2. **Vector Store Caching**: Cache vector store results to reduce OpenAI API calls
3. **Background Processing**: Use async operations for AI analysis and orchestration
4. **Connection Pooling**: Use MongoEngine connection pooling for database connections
5. **Data Pagination**: Implement pagination for time-series data and large result sets
6. **Redis Caching**: Cache frequently accessed analytics data and AI responses
7. **File Cleanup**: Automatically clean up temporary documentation files after processing

## Integration Points with Your UI Components

### Canvas Area → API Mapping
- **Canvas Data**: `GET /api/canvas/data` → Returns nodes/edges for Cytoscape
- **Create Connection**: `POST /api/canvas/connections` → Creates segment-to-plan mapping
- **Delete Connection**: `DELETE /api/canvas/connections/:id` → Removes mapping

### Customer Segment Modal → API Mapping
- **Segment Details**: `GET /api/customer-segments/:id` → Revenue analytics & experiments
- **Revenue Attribution**: `GET /api/analytics/revenue-attribution` → Time-series charts
- **Performance Insights**: `GET /api/analytics/performance-insights` → AI recommendations

### Pricing Plan Modal → API Mapping
- **Plan Details**: `GET /api/pricing-models/:id` → AI diagnosis & segment data
- **Financial Projections**: `GET /api/analytics/segment-contribution` → Revenue scenarios

### Background Tasks → API Mapping
- **Current Runs**: `GET /api/orchestration/runs` → Active/historical orchestrations
- **Run Logs**: `GET /api/orchestration/runs/:id/logs` → Real-time progress
- **Start Analysis**: `POST /api/orchestration/start` → Begin AI workflow

## UI Data Schemas (Previously Used Dummy Data)

The UI components expect the following data structures for proper functionality. These are derived from the previous dummy data and should be populated from the API responses above:

### Canvas Visualization Data
```typescript
interface CanvasData {
  nodes: CanvasNode[]
  edges: CanvasEdge[]
}

interface CanvasNode {
  data: {
    id: string
    label: string
    type: "customerSegment" | "pricingPlan"
    segment_id?: string
    plan_id?: string
  }
  position: { x: number, y: number }
}

interface CanvasEdge {
  data: {
    id: string
    source: string
    target: string
    connectionType: "finalized" | "experimental"
    percentage?: string
  }
}
```

### Customer Segment Modal Data
```typescript
interface SegmentModalData {
  name: string
  filterQuery: string
  totalUsers: number
  growthData: {
    userGrowth: string
    usageGrowth: string
    revenueGrowth: string
  }
  abTest: {
    planA: PlanData
    planB: PlanData
  }
  metrics: {
    avgRevenue: string
    engagementScore: number
    churnRate: string
  }
}

interface PlanData {
  name: string
  percentage: number
  users: number
  roi: string
  avgRevenue: string
  conversionRate: string
  churnRate: string
  weightage: string
}
```

### Pricing Plan Modal Data
```typescript
interface PricingExperiment {
  id: string
  name: string
  hypothesis: string
  status: "running" | "paused" | "completed"
  rollout: string
  conversion: string
  activeSince: string
  grossMargin: string
  price: string
  description: string
}

interface SegmentRevenueContribution {
  segment: string
  revenue: number
  percentage: number
  color: string
}
```

### Historical Runs Data
```typescript
interface RunData {
  id: string
  name: string
  status: "running" | "paused" | "completed"
  startTime: string
  startDate: Date
  duration: string
  participants: number
  conversion: string
  type: string
  taskDetails: string
}
```

### Integration Points

1. **Canvas Area**: Use `apiService.getCanvasData()` to populate nodes and edges
2. **Customer Segment Modal**: Use `apiService.getCustomerSegment(id)` and transform to match `SegmentModalData`
3. **Pricing Plan Modal**: Use `apiService.getPricingPlan(id)` and related revenue APIs
4. **Current Runs Modal**: Use `apiService.getAllRuns()` and `apiService.getRunLogs(id)`
5. **Create/Edit Modals**: Use respective create/update API methods

This integration guide provides the complete backend architecture needed to support your AI-powered pricing optimization UI. The system handles sophisticated AI analysis, real-time orchestration monitoring, and automated vector store management while maintaining scalability and performance.
