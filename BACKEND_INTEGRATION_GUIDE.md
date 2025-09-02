# Backend Integration Guide - Pricing Research Consultant UI

## System Overview

This is a sophisticated pricing research and experimentation platform that enables:
- Visual customer segment to pricing plan mapping
- A/B testing of pricing strategies  
- Real-time experiment monitoring
- Automated report generation
- Revenue attribution analysis
- Financial projections and unit economics

## Core Entities & Data Models

### 1. Customer Segments
```typescript
interface CustomerSegment {
  id: string
  name: string
  sqlQuery: string
  columnSearch?: string
  totalUsers: number
  filterQuery: string
  metrics: {
    avgRevenue: string
    engagementScore: number
    churnRate: string
  }
  growthData: {
    userGrowth: string
    usageGrowth: string  
    revenueGrowth: string
  }
  createdAt: Date
  updatedAt: Date
}
```

### 2. Pricing Plans
```typescript
interface PricingPlan {
  id: string
  name: string
  price: number
  description: string
  features: string[]
  isActive: boolean
  experiments: PriceExperiment[]
  createdAt: Date
  updatedAt: Date
}
```

### 3. Price Experiments
```typescript
interface PriceExperiment {
  id: string
  name: string
  hypothesis: string
  experimentGoal: 'competitiveness' | 'roi_extractions' | 'optimization'
  customerSegments: string[]
  prompt: string
  status: 'running' | 'paused' | 'completed' | 'cancelled'
  rolloutPercentage: number
  conversionRate: number
  grossMargin: number
  activeSince: Date
  results?: ExperimentResults
  createdAt: Date
  updatedAt: Date
}

interface ExperimentResults {
  conversionRate: number
  revenueImpact: number
  userCount: number
  churnRate: number
  roi: string
}
```

### 4. Reports
```typescript
interface Report {
  id: string
  name: string
  frequency: string // cron expression
  sections: ReportSection[]
  isActive: boolean
  lastGenerated?: Date
  nextScheduled: Date
  createdAt: Date
  updatedAt: Date
}

interface ReportSection {
  id: string
  name: string
  prompt: string
  order: number
}
```

### 5. Connections (Segment-to-Plan Mapping)
```typescript
interface Connection {
  id: string
  sourceSegmentId: string
  targetPlanId: string
  connectionType: 'finalized' | 'experimental'
  percentage: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
```

### 6. Current Runs (Background Tasks)
```typescript
interface CurrentRun {
  id: string
  name: string
  type: 'pricing experiment' | 'customer segmentation' | 'report generation' | 'data sync'
  status: 'running' | 'paused' | 'completed' | 'failed'
  startTime: Date
  duration: string
  participants?: number
  conversion?: string
  taskDetails: string
  logs: RunLog[]
}

interface RunLog {
  id: string
  runId: string
  level: 'info' | 'warn' | 'error' | 'success'
  message: string
  timestamp: Date
}
```

### 7. Projects
```typescript
interface Project {
  id: string
  name: string
  description?: string
  productData?: string
  customerData?: string
  revenueData?: string
  aiInstructions?: string
  environmentConfig?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
```

## Required API Endpoints

### Customer Segments

#### GET /api/customer-segments
- **Purpose**: List all customer segments
- **Response**: `CustomerSegment[]`

#### POST /api/customer-segments
- **Purpose**: Create new customer segment
- **Request Body**:
```json
{
  "name": "High-Value Enterprise Users",
  "sqlQuery": "SELECT * FROM customers WHERE user_type = 'enterprise' AND monthly_spend > 500",
  "columnSearch": "revenue, user_type"
}
```
- **Response**: `CustomerSegment`

#### GET /api/customer-segments/:id
- **Purpose**: Get specific segment with detailed analytics
- **Response**: 
```json
{
  "segment": "CustomerSegment",
  "analytics": {
    "revenueAttribution": "RevenueAttributionData",
    "experiments": "PriceExperiment[]",
    "timeSeries": "TimeSeriesData[]"
  }
}
```

#### PUT /api/customer-segments/:id
- **Purpose**: Update customer segment
- **Request Body**: `Partial<CustomerSegment>`
- **Response**: `CustomerSegment`

#### DELETE /api/customer-segments/:id
- **Purpose**: Delete customer segment
- **Response**: `{ success: boolean }`

### Pricing Plans

#### GET /api/pricing-plans
- **Purpose**: List all pricing plans
- **Response**: `PricingPlan[]`

#### POST /api/pricing-plans
- **Purpose**: Create new pricing plan
- **Request Body**: `Omit<PricingPlan, 'id' | 'createdAt' | 'updatedAt'>`
- **Response**: `PricingPlan`

#### GET /api/pricing-plans/:id
- **Purpose**: Get specific pricing plan with experiments and segment data
- **Response**:
```json
{
  "plan": "PricingPlan",
  "experiments": "PriceExperiment[]",
  "segmentAttribution": "SegmentAttributionData[]",
  "financialProjections": "FinancialProjections"
}
```

#### PUT /api/pricing-plans/:id
- **Purpose**: Update pricing plan
- **Request Body**: `Partial<PricingPlan>`
- **Response**: `PricingPlan`

#### DELETE /api/pricing-plans/:id
- **Purpose**: Delete pricing plan
- **Response**: `{ success: boolean }`

### Price Experiments

#### GET /api/price-experiments
- **Purpose**: List all price experiments
- **Response**: `PriceExperiment[]`

#### POST /api/price-experiments
- **Purpose**: Create new price experiment
- **Request Body**:
```json
{
  "experimentGoal": "roi_extractions",
  "customerSegments": ["segment-id-1", "segment-id-2"],
  "prompt": "Test premium pricing for enterprise users"
}
```
- **Response**: `PriceExperiment`

#### GET /api/price-experiments/:id
- **Purpose**: Get experiment details with results
- **Response**: `PriceExperiment`

#### PUT /api/price-experiments/:id
- **Purpose**: Update experiment (pause, resume, modify)
- **Request Body**: `Partial<PriceExperiment>`
- **Response**: `PriceExperiment`

#### POST /api/price-experiments/:id/actions
- **Purpose**: Perform actions on experiments
- **Request Body**:
```json
{
  "action": "pause" | "resume" | "stop" | "retire",
  "segmentId"?: "string" // for segment-specific actions
}
```
- **Response**: `{ success: boolean }`

### Connections (Canvas)

#### GET /api/connections
- **Purpose**: Get all segment-to-plan connections
- **Response**: `Connection[]`

#### POST /api/connections
- **Purpose**: Create new connection
- **Request Body**:
```json
{
  "sourceSegmentId": "segment-id",
  "targetPlanId": "plan-id",
  "connectionType": "finalized"
}
```
- **Response**: `Connection`

#### DELETE /api/connections/:id
- **Purpose**: Delete connection
- **Response**: `{ success: boolean }`

#### GET /api/connections/canvas-data
- **Purpose**: Get formatted data for canvas visualization
- **Response**:
```json
{
  "nodes": [
    {
      "data": { "id": "cs1", "label": "CS1", "type": "customerSegment" },
      "position": { "x": 100, "y": 100 }
    }
  ],
  "edges": [
    {
      "data": {
        "id": "e1",
        "source": "cs1", 
        "target": "pp1",
        "connectionType": "finalized",
        "percentage": "100%"
      }
    }
  ]
}
```

### Reports

#### GET /api/reports
- **Purpose**: List all reports
- **Response**: `Report[]`

#### POST /api/reports
- **Purpose**: Create scheduled report
- **Request Body**:
```json
{
  "name": "Monthly Revenue Report",
  "frequency": "0 9 1 * *",
  "sections": [
    {
      "name": "Executive Summary",
      "prompt": "Generate executive summary of key metrics"
    }
  ]
}
```
- **Response**: `Report`

#### GET /api/reports/:id
- **Purpose**: Get report details
- **Response**: `Report`

#### PUT /api/reports/:id
- **Purpose**: Update report configuration
- **Request Body**: `Partial<Report>`
- **Response**: `Report`

#### DELETE /api/reports/:id
- **Purpose**: Delete report
- **Response**: `{ success: boolean }`

#### POST /api/reports/:id/generate
- **Purpose**: Manually trigger report generation
- **Response**: `{ runId: string }`

### Current Runs

#### GET /api/current-runs
- **Purpose**: List all current/historical runs
- **Response**: `CurrentRun[]`

#### GET /api/current-runs/:id
- **Purpose**: Get specific run details
- **Response**: `CurrentRun`

#### GET /api/current-runs/:id/logs
- **Purpose**: Get real-time logs for a run
- **Response**: `RunLog[]`

#### POST /api/current-runs/:id/actions
- **Purpose**: Control run execution
- **Request Body**:
```json
{
  "action": "pause" | "resume" | "stop"
}
```
- **Response**: `{ success: boolean }`

### Projects

#### GET /api/projects
- **Purpose**: List all projects
- **Response**: `Project[]`

#### POST /api/projects
- **Purpose**: Create new project
- **Request Body**: `Omit<Project, 'id' | 'createdAt' | 'updatedAt'>`
- **Response**: `Project`

#### GET /api/projects/:id
- **Purpose**: Get project configuration
- **Response**: `Project`

#### PUT /api/projects/:id
- **Purpose**: Update project configuration
- **Request Body**: `Partial<Project>`
- **Response**: `Project`

### Analytics & Insights

#### GET /api/analytics/revenue-attribution
- **Purpose**: Get revenue attribution analysis
- **Query Parameters**: `segmentId?, planId?, timeRange?`
- **Response**:
```json
{
  "items": [
    {
      "plan": "Premium",
      "impressionRatio": 68,
      "revenueAttribution": 72,
      "revenue": 2808000,
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

#### GET /api/analytics/performance-insights
- **Purpose**: Get AI-generated performance insights
- **Query Parameters**: `segmentId?, planId?`
- **Response**:
```json
{
  "underperformingPlan": "PlanAnalysis | null",
  "overperformingPlan": "PlanAnalysis | null", 
  "recommendations": "string[]",
  "potentialCapture": "number"
}
```

## WebSocket Events (Real-time Updates)

### Connection: `/ws`

#### Events to Listen For:
- `experiment_updated`: When experiment metrics change
- `run_status_changed`: When background run status changes
- `run_log`: New log entries for current runs
- `connection_updated`: When canvas connections change
- `segment_metrics_updated`: When segment metrics are recalculated

#### Events to Emit:
- `subscribe_run`: Subscribe to specific run updates
- `unsubscribe_run`: Unsubscribe from run updates
- `subscribe_experiment`: Subscribe to experiment updates

## Background Services Required

### 1. Experiment Engine
- Continuously monitors A/B test performance
- Calculates conversion rates, revenue impact
- Sends real-time updates via WebSocket
- Handles automatic experiment stopping based on statistical significance

### 2. Report Generator
- Executes cron jobs for scheduled reports
- Processes report sections using AI/LLM integration
- Generates PDF/HTML reports
- Sends notifications on completion

### 3. Data Sync Service
- Synchronizes customer data from external sources
- Updates segment calculations based on SQL queries
- Maintains data freshness for analytics

### 4. Analytics Calculator
- Processes revenue attribution calculations
- Generates time-series data for charts
- Calculates unit economics and financial projections
- Updates performance insights

## Database Schema (SQL)

```sql
-- Customer Segments
CREATE TABLE customer_segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  sql_query TEXT NOT NULL,
  column_search VARCHAR(500),
  total_users INTEGER DEFAULT 0,
  filter_query TEXT,
  avg_revenue DECIMAL(10,2),
  engagement_score DECIMAL(3,2),
  churn_rate DECIMAL(5,4),
  user_growth VARCHAR(50),
  usage_growth VARCHAR(50),
  revenue_growth VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Pricing Plans
CREATE TABLE pricing_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  features JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Price Experiments
CREATE TABLE price_experiments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  hypothesis TEXT,
  experiment_goal VARCHAR(50) NOT NULL,
  customer_segments JSONB,
  prompt TEXT,
  status VARCHAR(50) DEFAULT 'running',
  rollout_percentage INTEGER,
  conversion_rate DECIMAL(5,4),
  gross_margin DECIMAL(5,4),
  active_since TIMESTAMP DEFAULT NOW(),
  results JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Connections
CREATE TABLE connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_segment_id UUID REFERENCES customer_segments(id) ON DELETE CASCADE,
  target_plan_id UUID REFERENCES pricing_plans(id) ON DELETE CASCADE,
  connection_type VARCHAR(50) NOT NULL,
  percentage INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Reports
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  frequency VARCHAR(100) NOT NULL, -- cron expression
  sections JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_generated TIMESTAMP,
  next_scheduled TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Current Runs
CREATE TABLE current_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'running',
  start_time TIMESTAMP DEFAULT NOW(),
  duration VARCHAR(50),
  participants INTEGER,
  conversion VARCHAR(50),
  task_details TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Run Logs
CREATE TABLE run_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID REFERENCES current_runs(id) ON DELETE CASCADE,
  level VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  product_data VARCHAR(255),
  customer_data VARCHAR(255),
  revenue_data VARCHAR(255),
  ai_instructions TEXT,
  environment_config TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/pricing_research
REDIS_URL=redis://localhost:6379

# External APIs
OPENAI_API_KEY=your_openai_key
CLAUDE_API_KEY=your_claude_key

# Authentication
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret

# Email (for reports)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password

# Storage
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
S3_BUCKET_NAME=pricing-reports

# Application
NODE_ENV=production
PORT=3001
FRONTEND_URL=http://localhost:3000
```

## Security Considerations

1. **Authentication**: Implement JWT-based authentication for all API endpoints
2. **Data Privacy**: Ensure customer data queries are sanitized and access-controlled
3. **Rate Limiting**: Implement rate limiting on expensive operations like report generation
4. **Input Validation**: Validate all SQL queries for segments to prevent injection attacks
5. **CORS**: Configure proper CORS policies for frontend communication

## Performance Optimizations

1. **Caching**: Use Redis for caching frequently accessed analytics data
2. **Database Indexing**: Index frequently queried fields (segment IDs, experiment status, etc.)
3. **Background Processing**: Use job queues (Bull/BullMQ) for heavy computations
4. **Connection Pooling**: Use connection pooling for database connections
5. **Data Pagination**: Implement pagination for list endpoints

This integration guide provides the complete backend architecture needed to support your pricing research consultant UI. The system handles complex analytics, real-time experiment monitoring, and automated reporting while maintaining scalability and performance.
