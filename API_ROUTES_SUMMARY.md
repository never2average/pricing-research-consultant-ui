# Pricing Research Consultant API Routes

## API Overview
- **Framework**: FastAPI
- **Database**: MongoDB (MongoEngine)
- **Port**: 8000
- **CORS**: Enabled for localhost:3000, 3001

## Route Groups

### 🧑‍🤝‍🧑 Customer Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/customer-segment/list` | Get all customer segments |
| GET | `/customer-segment/read` | Get customer segment by ID |
| POST | `/customer-segment/create` | Create new customer segment |
| DELETE | `/customer-segment/delete` | Delete customer segment |

### 💰 Pricing Management  
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/pricing-plan/list` | Get all pricing plans |
| GET | `/pricing-plan/read` | Get pricing plan by ID |
| POST | `/pricing-plan/create` | Create new pricing plan |
| DELETE | `/pricing-plan/delete` | Delete pricing plan |

### 🔗 Segment-Plan Linking
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/customer-segment/pricing-plan/link/create` | Link segment to plan |
| PUT | `/customer-segment/pricing-plan/link/update` | Update segment-plan link |
| DELETE | `/customer-segment/pricing-plan/link/delete` | Delete segment-plan link |
| GET | `/customer-segment/pricing-plan/link/listall` | Get all links with details |

### 📦 Product Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/product/list` | Get all products |
| POST | `/product/create` | Create new product |
| PUT | `/product/update` | Update product |
| DELETE | `/product/delete` | Delete product |
| POST | `/productintegration/create` | Create product integration |

### 🧪 Experiment Workflow
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/experiments/` | Create new pricing experiment |
| GET | `/experiments` | Get experiments by stage/number |
| GET | `/experiments/all-runs/{experiment_number}` | Get all experiment runs |
| GET | `/experiments/ready-for-deployment` | Get deployable experiments |
| POST | `/experiments/{experiment_number}/deploy` | Deploy experiment |

### 📊 Data Sources
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/productsources/list` | Get product data sources |
| GET | `/revenuesources/list` | Get revenue data sources |
| GET | `/customersegmentsources/list` | Get segment data sources |

### 🔍 Search & Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/search` | Search across entities |
| GET | `/historical/allruns` | Get all historical runs |
| GET | `/historical/runlogs` | Get run logs by invocation ID |
| POST | `/scheduled-reporting/create` | Create scheduled report |

### 🎨 Canvas & Visualization
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/canvas/data` | Get canvas nodes and edges |
| POST | `/canvas/connection/create` | Create canvas connection |
| DELETE | `/canvas/connection/delete` | Delete canvas connection |

### ⚙️ System Configuration
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/envs/get` | Get environment config |
| GET | `/llmstxt/get` | Get LLM text config |
| GET | `/automation/get` | Get automation config |
| POST | `/automation/push` | Update automation config |
| POST | `/orchestration` | Start orchestration workflow |

## Key Features

### Authentication
- **Status**: Optional (no authentication currently implemented)
- **CORS**: Configured for local development

### Database Models
- **CustomerSegment**: Customer segmentation data
- **Product**: Product information and documentation
- **PricingExperimentRequest**: Experiment requests
- **PricingExperimentRuns**: Experiment execution data

### Experiment Stages
1. `product_context_initialized`
2. `segments_loaded`
3. `positioning_usage_analysis_done`
4. `roi_gap_analyzer_run`
5. `experimental_plan_generated`
6. `simulations_run`
7. `scenario_builder_completed`
8. `cashflow_feasibility_runs_completed`
9. `completed`
10. `deployed`
11. `feedback_collected`

### Response Types
- **Success**: `SuccessResponseAPI`
- **Error**: Standard HTTP exceptions with detail messages
- **Health**: `HealthCheckResponseAPI`
- **Lists**: Typed arrays of entity models

## Usage Examples

### Create Customer Segment
```bash
curl -X POST "http://localhost:8000/customer-segment/create" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_segment_uid": "enterprise_users",
    "customer_segment_name": "Enterprise Users",
    "customer_segment_description": "Large enterprise customers"
  }'
```

### Start Experiment
```bash
curl -X POST "http://localhost:8000/experiments/" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "product_id_here",
    "objective": "Increase revenue",
    "usecase": "Enterprise pricing optimization"
  }'
```

### Health Check
```bash
curl -X GET "http://localhost:8000/health"
```

## Architecture Notes

- **Async Support**: All routes are async-enabled
- **Error Handling**: Consistent exception handling across all endpoints
- **Threading**: ThreadPoolExecutor with 4 workers for background tasks
- **Vector Stores**: OpenAI integration for document processing
- **Real-time Updates**: Background task processing for experiments



================================================================================
PYDANTIC API INPUT/OUTPUT SCHEMAS
================================================================================

----------------------------------------
API INPUTS
----------------------------------------

--- CustomerSegmentAPI ---
{
  "properties": {
    "product": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Product"
    },
    "customer_segment_uid": {
      "title": "Customer Segment Uid",
      "type": "string"
    },
    "customer_segment_name": {
      "title": "Customer Segment Name",
      "type": "string"
    },
    "customer_segment_description": {
      "title": "Customer Segment Description",
      "type": "string"
    },
    "created_at": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Created At"
    },
    "updated_at": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Updated At"
    }
  },
  "required": [
    "customer_segment_uid",
    "customer_segment_name",
    "customer_segment_description"
  ],
  "title": "CustomerSegmentAPI",
  "type": "object"
}

--- PricingPlanAPI ---
{
  "properties": {
    "plan_name": {
      "title": "Plan Name",
      "type": "string"
    },
    "unit_price": {
      "title": "Unit Price",
      "type": "number"
    },
    "min_unit_count": {
      "title": "Min Unit Count",
      "type": "integer"
    },
    "unit_calculation_logic": {
      "title": "Unit Calculation Logic",
      "type": "string"
    },
    "min_unit_utilization_period": {
      "title": "Min Unit Utilization Period",
      "type": "string"
    },
    "created_at": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Created At"
    },
    "updated_at": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Updated At"
    }
  },
  "required": [
    "plan_name",
    "unit_price",
    "min_unit_count",
    "unit_calculation_logic",
    "min_unit_utilization_period"
  ],
  "title": "PricingPlanAPI",
  "type": "object"
}

--- ProductAPI ---
{
  "$defs": {
    "CompetitorAPI": {
      "properties": {
        "competitor_name": {
          "title": "Competitor Name",
          "type": "string"
        },
        "website_url": {
          "title": "Website Url",
          "type": "string"
        },
        "product_description": {
          "title": "Product Description",
          "type": "string"
        }
      },
      "required": [
        "competitor_name",
        "website_url",
        "product_description"
      ],
      "title": "CompetitorAPI",
      "type": "object"
    }
  },
  "properties": {
    "name": {
      "title": "Name",
      "type": "string"
    },
    "icp_description": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Icp Description"
    },
    "unit_level_cogs": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Unit Level Cogs"
    },
    "features_description_summary": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Features Description Summary"
    },
    "competitors": {
      "anyOf": [
        {
          "items": {
            "$ref": "#/$defs/CompetitorAPI"
          },
          "type": "array"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Competitors"
    },
    "product_documentations": {
      "anyOf": [
        {
          "items": {
            "type": "string"
          },
          "type": "array"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Product Documentations"
    },
    "vector_store_id": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Vector Store Id"
    },
    "created_at": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Created At"
    },
    "updated_at": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Updated At"
    }
  },
  "required": [
    "name"
  ],
  "title": "ProductAPI",
  "type": "object"
}

--- CreateSegmentPlanLinkRequestAPI ---
{
  "$defs": {
    "ConnectionType": {
      "enum": [
        "finalized",
        "experimental"
      ],
      "title": "ConnectionType",
      "type": "string"
    }
  },
  "properties": {
    "customer_segment_id": {
      "title": "Customer Segment Id",
      "type": "string"
    },
    "pricing_plan_id": {
      "title": "Pricing Plan Id",
      "type": "string"
    },
    "connection_type": {
      "$ref": "#/$defs/ConnectionType"
    }
  },
  "required": [
    "customer_segment_id",
    "pricing_plan_id",
    "connection_type"
  ],
  "title": "CreateSegmentPlanLinkRequestAPI",
  "type": "object"
}

--- UpdateSegmentPlanLinkRequestAPI ---
{
  "$defs": {
    "ConnectionType": {
      "enum": [
        "finalized",
        "experimental"
      ],
      "title": "ConnectionType",
      "type": "string"
    }
  },
  "properties": {
    "id": {
      "title": "Id",
      "type": "string"
    },
    "customer_segment_id": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Customer Segment Id"
    },
    "pricing_plan_id": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Pricing Plan Id"
    },
    "connection_type": {
      "anyOf": [
        {
          "$ref": "#/$defs/ConnectionType"
        },
        {
          "type": "null"
        }
      ],
      "default": null
    },
    "percentage": {
      "anyOf": [
        {
          "type": "number"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Percentage"
    },
    "is_active": {
      "anyOf": [
        {
          "type": "boolean"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Is Active"
    }
  },
  "required": [
    "id"
  ],
  "title": "UpdateSegmentPlanLinkRequestAPI",
  "type": "object"
}

--- DeleteRequestAPI ---
{
  "properties": {
    "id": {
      "title": "Id",
      "type": "string"
    }
  },
  "required": [
    "id"
  ],
  "title": "DeleteRequestAPI",
  "type": "object"
}

--- SearchRequestAPI ---
{
  "properties": {
    "query": {
      "title": "Query",
      "type": "string"
    }
  },
  "required": [
    "query"
  ],
  "title": "SearchRequestAPI",
  "type": "object"
}

--- CreateScheduledReportRequestAPI ---
{
  "$defs": {
    "ReportSectionAPI": {
      "properties": {
        "id": {
          "title": "Id",
          "type": "string"
        },
        "name": {
          "title": "Name",
          "type": "string"
        },
        "prompt": {
          "title": "Prompt",
          "type": "string"
        },
        "section_type": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Section Type"
        }
      },
      "required": [
        "id",
        "name",
        "prompt"
      ],
      "title": "ReportSectionAPI",
      "type": "object"
    }
  },
  "properties": {
    "name": {
      "title": "Name",
      "type": "string"
    },
    "schedule_type": {
      "title": "Schedule Type",
      "type": "string"
    },
    "schedule_config": {
      "title": "Schedule Config"
    },
    "sections": {
      "items": {
        "$ref": "#/$defs/ReportSectionAPI"
      },
      "title": "Sections",
      "type": "array"
    },
    "recipients": {
      "anyOf": [
        {
          "items": {
            "type": "string"
          },
          "type": "array"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Recipients"
    }
  },
  "required": [
    "name",
    "schedule_type",
    "schedule_config",
    "sections"
  ],
  "title": "CreateScheduledReportRequestAPI",
  "type": "object"
}

--- CreateProductIntegrationRequestAPI ---
{
  "properties": {
    "product_id": {
      "title": "Product Id",
      "type": "string"
    },
    "integration_type": {
      "title": "Integration Type",
      "type": "string"
    },
    "config": {
      "title": "Config"
    }
  },
  "required": [
    "product_id",
    "integration_type",
    "config"
  ],
  "title": "CreateProductIntegrationRequestAPI",
  "type": "object"
}

--- CreateCanvasConnectionRequestAPI ---
{
  "$defs": {
    "ConnectionType": {
      "enum": [
        "finalized",
        "experimental"
      ],
      "title": "ConnectionType",
      "type": "string"
    }
  },
  "properties": {
    "customer_segment_id": {
      "title": "Customer Segment Id",
      "type": "string"
    },
    "pricing_plan_id": {
      "title": "Pricing Plan Id",
      "type": "string"
    },
    "connection_type": {
      "$ref": "#/$defs/ConnectionType"
    }
  },
  "required": [
    "customer_segment_id",
    "pricing_plan_id",
    "connection_type"
  ],
  "title": "CreateCanvasConnectionRequestAPI",
  "type": "object"
}

--- OrchestrationRequestAPI ---
{
  "$defs": {
    "WorkflowType": {
      "enum": [
        "pricing_analysis",
        "customer_segmentation",
        "revenue_forecast",
        "full_analysis"
      ],
      "title": "WorkflowType",
      "type": "string"
    }
  },
  "properties": {
    "workflow_type": {
      "$ref": "#/$defs/WorkflowType"
    },
    "product_id": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Product Id"
    },
    "parameters": {
      "anyOf": [
        {
          "additionalProperties": true,
          "type": "object"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Parameters"
    }
  },
  "required": [
    "workflow_type"
  ],
  "title": "OrchestrationRequestAPI",
  "type": "object"
}

--- AutomationConfigAPI ---
{
  "properties": {
    "name": {
      "title": "Name",
      "type": "string"
    },
    "automation_type": {
      "title": "Automation Type",
      "type": "string"
    },
    "trigger_config": {
      "title": "Trigger Config"
    },
    "action_config": {
      "title": "Action Config"
    },
    "is_active": {
      "title": "Is Active",
      "type": "boolean"
    },
    "last_run": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Last Run"
    },
    "next_run": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Next Run"
    }
  },
  "required": [
    "name",
    "automation_type",
    "trigger_config",
    "action_config",
    "is_active"
  ],
  "title": "AutomationConfigAPI",
  "type": "object"
}

----------------------------------------
API OUTPUTS
----------------------------------------

--- CustomerSegmentAPI ---
{
  "properties": {
    "product": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Product"
    },
    "customer_segment_uid": {
      "title": "Customer Segment Uid",
      "type": "string"
    },
    "customer_segment_name": {
      "title": "Customer Segment Name",
      "type": "string"
    },
    "customer_segment_description": {
      "title": "Customer Segment Description",
      "type": "string"
    },
    "created_at": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Created At"
    },
    "updated_at": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Updated At"
    }
  },
  "required": [
    "customer_segment_uid",
    "customer_segment_name",
    "customer_segment_description"
  ],
  "title": "CustomerSegmentAPI",
  "type": "object"
}

--- PricingPlanAPI ---
{
  "properties": {
    "plan_name": {
      "title": "Plan Name",
      "type": "string"
    },
    "unit_price": {
      "title": "Unit Price",
      "type": "number"
    },
    "min_unit_count": {
      "title": "Min Unit Count",
      "type": "integer"
    },
    "unit_calculation_logic": {
      "title": "Unit Calculation Logic",
      "type": "string"
    },
    "min_unit_utilization_period": {
      "title": "Min Unit Utilization Period",
      "type": "string"
    },
    "created_at": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Created At"
    },
    "updated_at": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Updated At"
    }
  },
  "required": [
    "plan_name",
    "unit_price",
    "min_unit_count",
    "unit_calculation_logic",
    "min_unit_utilization_period"
  ],
  "title": "PricingPlanAPI",
  "type": "object"
}

--- ProductAPI ---
{
  "$defs": {
    "CompetitorAPI": {
      "properties": {
        "competitor_name": {
          "title": "Competitor Name",
          "type": "string"
        },
        "website_url": {
          "title": "Website Url",
          "type": "string"
        },
        "product_description": {
          "title": "Product Description",
          "type": "string"
        }
      },
      "required": [
        "competitor_name",
        "website_url",
        "product_description"
      ],
      "title": "CompetitorAPI",
      "type": "object"
    }
  },
  "properties": {
    "name": {
      "title": "Name",
      "type": "string"
    },
    "icp_description": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Icp Description"
    },
    "unit_level_cogs": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Unit Level Cogs"
    },
    "features_description_summary": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Features Description Summary"
    },
    "competitors": {
      "anyOf": [
        {
          "items": {
            "$ref": "#/$defs/CompetitorAPI"
          },
          "type": "array"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Competitors"
    },
    "product_documentations": {
      "anyOf": [
        {
          "items": {
            "type": "string"
          },
          "type": "array"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Product Documentations"
    },
    "vector_store_id": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Vector Store Id"
    },
    "created_at": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Created At"
    },
    "updated_at": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Updated At"
    }
  },
  "required": [
    "name"
  ],
  "title": "ProductAPI",
  "type": "object"
}

--- SegmentPlanLinkAPI ---
{
  "$defs": {
    "ConnectionType": {
      "enum": [
        "finalized",
        "experimental"
      ],
      "title": "ConnectionType",
      "type": "string"
    }
  },
  "properties": {
    "customer_segment_id": {
      "title": "Customer Segment Id",
      "type": "string"
    },
    "pricing_plan_id": {
      "title": "Pricing Plan Id",
      "type": "string"
    },
    "connection_type": {
      "$ref": "#/$defs/ConnectionType"
    },
    "percentage": {
      "anyOf": [
        {
          "type": "number"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Percentage"
    },
    "created_at": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Created At"
    },
    "updated_at": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Updated At"
    },
    "is_active": {
      "anyOf": [
        {
          "type": "boolean"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Is Active"
    }
  },
  "required": [
    "customer_segment_id",
    "pricing_plan_id",
    "connection_type"
  ],
  "title": "SegmentPlanLinkAPI",
  "type": "object"
}

--- SegmentPlanLinkWithDetailsAPI ---
{
  "$defs": {
    "ConnectionType": {
      "enum": [
        "finalized",
        "experimental"
      ],
      "title": "ConnectionType",
      "type": "string"
    },
    "CustomerSegmentAPI": {
      "properties": {
        "product": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Product"
        },
        "customer_segment_uid": {
          "title": "Customer Segment Uid",
          "type": "string"
        },
        "customer_segment_name": {
          "title": "Customer Segment Name",
          "type": "string"
        },
        "customer_segment_description": {
          "title": "Customer Segment Description",
          "type": "string"
        },
        "created_at": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Created At"
        },
        "updated_at": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Updated At"
        }
      },
      "required": [
        "customer_segment_uid",
        "customer_segment_name",
        "customer_segment_description"
      ],
      "title": "CustomerSegmentAPI",
      "type": "object"
    },
    "PricingPlanAPI": {
      "properties": {
        "plan_name": {
          "title": "Plan Name",
          "type": "string"
        },
        "unit_price": {
          "title": "Unit Price",
          "type": "number"
        },
        "min_unit_count": {
          "title": "Min Unit Count",
          "type": "integer"
        },
        "unit_calculation_logic": {
          "title": "Unit Calculation Logic",
          "type": "string"
        },
        "min_unit_utilization_period": {
          "title": "Min Unit Utilization Period",
          "type": "string"
        },
        "created_at": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Created At"
        },
        "updated_at": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Updated At"
        }
      },
      "required": [
        "plan_name",
        "unit_price",
        "min_unit_count",
        "unit_calculation_logic",
        "min_unit_utilization_period"
      ],
      "title": "PricingPlanAPI",
      "type": "object"
    }
  },
  "properties": {
    "customer_segment_id": {
      "title": "Customer Segment Id",
      "type": "string"
    },
    "pricing_plan_id": {
      "title": "Pricing Plan Id",
      "type": "string"
    },
    "connection_type": {
      "$ref": "#/$defs/ConnectionType"
    },
    "percentage": {
      "anyOf": [
        {
          "type": "number"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Percentage"
    },
    "created_at": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Created At"
    },
    "updated_at": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Updated At"
    },
    "is_active": {
      "anyOf": [
        {
          "type": "boolean"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Is Active"
    },
    "customer_segment": {
      "anyOf": [
        {
          "$ref": "#/$defs/CustomerSegmentAPI"
        },
        {
          "type": "null"
        }
      ],
      "default": null
    },
    "pricing_plan": {
      "anyOf": [
        {
          "$ref": "#/$defs/PricingPlanAPI"
        },
        {
          "type": "null"
        }
      ],
      "default": null
    }
  },
  "required": [
    "customer_segment_id",
    "pricing_plan_id",
    "connection_type"
  ],
  "title": "SegmentPlanLinkWithDetailsAPI",
  "type": "object"
}

--- SearchResponseAPI ---
{
  "$defs": {
    "SearchResultAPI": {
      "properties": {
        "type": {
          "$ref": "#/$defs/SearchResultType"
        },
        "id": {
          "title": "Id",
          "type": "string"
        },
        "title": {
          "title": "Title",
          "type": "string"
        },
        "description": {
          "title": "Description",
          "type": "string"
        },
        "score": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Score"
        }
      },
      "required": [
        "type",
        "id",
        "title",
        "description"
      ],
      "title": "SearchResultAPI",
      "type": "object"
    },
    "SearchResultType": {
      "enum": [
        "customer_segment",
        "pricing_plan",
        "product",
        "other"
      ],
      "title": "SearchResultType",
      "type": "string"
    }
  },
  "properties": {
    "results": {
      "items": {
        "$ref": "#/$defs/SearchResultAPI"
      },
      "title": "Results",
      "type": "array"
    },
    "total_count": {
      "title": "Total Count",
      "type": "integer"
    },
    "query": {
      "title": "Query",
      "type": "string"
    }
  },
  "required": [
    "results",
    "total_count",
    "query"
  ],
  "title": "SearchResponseAPI",
  "type": "object"
}

--- ScheduledReportAPI ---
{
  "$defs": {
    "ReportSectionAPI": {
      "properties": {
        "id": {
          "title": "Id",
          "type": "string"
        },
        "name": {
          "title": "Name",
          "type": "string"
        },
        "prompt": {
          "title": "Prompt",
          "type": "string"
        },
        "section_type": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Section Type"
        }
      },
      "required": [
        "id",
        "name",
        "prompt"
      ],
      "title": "ReportSectionAPI",
      "type": "object"
    },
    "ScheduledReportStatus": {
      "enum": [
        "active",
        "paused",
        "completed"
      ],
      "title": "ScheduledReportStatus",
      "type": "string"
    }
  },
  "properties": {
    "name": {
      "title": "Name",
      "type": "string"
    },
    "schedule_type": {
      "title": "Schedule Type",
      "type": "string"
    },
    "schedule_config": {
      "title": "Schedule Config"
    },
    "report_sections": {
      "items": {
        "$ref": "#/$defs/ReportSectionAPI"
      },
      "title": "Report Sections",
      "type": "array"
    },
    "recipients": {
      "items": {
        "type": "string"
      },
      "title": "Recipients",
      "type": "array"
    },
    "created_at": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Created At"
    },
    "status": {
      "anyOf": [
        {
          "$ref": "#/$defs/ScheduledReportStatus"
        },
        {
          "type": "null"
        }
      ],
      "default": null
    }
  },
  "required": [
    "name",
    "schedule_type",
    "schedule_config",
    "report_sections",
    "recipients"
  ],
  "title": "ScheduledReportAPI",
  "type": "object"
}

--- HistoricalRunAPI ---
{
  "$defs": {
    "HistoricalRunStatus": {
      "enum": [
        "running",
        "completed",
        "failed",
        "paused"
      ],
      "title": "HistoricalRunStatus",
      "type": "string"
    },
    "ProgressAPI": {
      "properties": {
        "completed_steps": {
          "title": "Completed Steps",
          "type": "integer"
        },
        "total_steps": {
          "title": "Total Steps",
          "type": "integer"
        },
        "current_step": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Current Step"
        }
      },
      "required": [
        "completed_steps",
        "total_steps"
      ],
      "title": "ProgressAPI",
      "type": "object"
    }
  },
  "properties": {
    "invocation_id": {
      "title": "Invocation Id",
      "type": "string"
    },
    "task_type": {
      "title": "Task Type",
      "type": "string"
    },
    "task_name": {
      "title": "Task Name",
      "type": "string"
    },
    "status": {
      "$ref": "#/$defs/HistoricalRunStatus"
    },
    "started_at": {
      "title": "Started At",
      "type": "string"
    },
    "completed_at": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Completed At"
    },
    "duration": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Duration"
    },
    "participants": {
      "anyOf": [
        {
          "type": "integer"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Participants"
    },
    "conversion": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Conversion"
    },
    "task_details": {
      "title": "Task Details",
      "type": "string"
    },
    "progress": {
      "anyOf": [
        {
          "$ref": "#/$defs/ProgressAPI"
        },
        {
          "type": "null"
        }
      ],
      "default": null
    }
  },
  "required": [
    "invocation_id",
    "task_type",
    "task_name",
    "status",
    "started_at",
    "task_details"
  ],
  "title": "HistoricalRunAPI",
  "type": "object"
}

--- RunLogsResponseAPI ---
{
  "$defs": {
    "RunLogAPI": {
      "properties": {
        "timestamp": {
          "title": "Timestamp",
          "type": "string"
        },
        "level": {
          "$ref": "#/$defs/RunLogLevel"
        },
        "message": {
          "title": "Message",
          "type": "string"
        },
        "step_name": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Step Name"
        },
        "details": {
          "anyOf": [
            {},
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Details"
        }
      },
      "required": [
        "timestamp",
        "level",
        "message"
      ],
      "title": "RunLogAPI",
      "type": "object"
    },
    "RunLogLevel": {
      "enum": [
        "INFO",
        "ERROR",
        "WARNING",
        "DEBUG"
      ],
      "title": "RunLogLevel",
      "type": "string"
    }
  },
  "properties": {
    "invocation_id": {
      "title": "Invocation Id",
      "type": "string"
    },
    "logs": {
      "items": {
        "$ref": "#/$defs/RunLogAPI"
      },
      "title": "Logs",
      "type": "array"
    },
    "status": {
      "title": "Status",
      "type": "string"
    }
  },
  "required": [
    "invocation_id",
    "logs",
    "status"
  ],
  "title": "RunLogsResponseAPI",
  "type": "object"
}

--- ProductIntegrationAPI ---
{
  "$defs": {
    "ProductIntegrationStatus": {
      "enum": [
        "active",
        "inactive",
        "pending"
      ],
      "title": "ProductIntegrationStatus",
      "type": "string"
    }
  },
  "properties": {
    "product_id": {
      "title": "Product Id",
      "type": "string"
    },
    "integration_type": {
      "title": "Integration Type",
      "type": "string"
    },
    "config": {
      "title": "Config"
    },
    "status": {
      "$ref": "#/$defs/ProductIntegrationStatus"
    },
    "created_at": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Created At"
    }
  },
  "required": [
    "product_id",
    "integration_type",
    "config",
    "status"
  ],
  "title": "ProductIntegrationAPI",
  "type": "object"
}

--- DataSourceAPI ---
{
  "$defs": {
    "DataSourceConnectionStatus": {
      "enum": [
        "connected",
        "disconnected",
        "error"
      ],
      "title": "DataSourceConnectionStatus",
      "type": "string"
    }
  },
  "properties": {
    "name": {
      "title": "Name",
      "type": "string"
    },
    "source_type": {
      "title": "Source Type",
      "type": "string"
    },
    "connection_status": {
      "$ref": "#/$defs/DataSourceConnectionStatus"
    },
    "last_sync": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Last Sync"
    },
    "config": {
      "anyOf": [
        {},
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Config"
    }
  },
  "required": [
    "name",
    "source_type",
    "connection_status"
  ],
  "title": "DataSourceAPI",
  "type": "object"
}

--- EnvironmentConfigAPI ---
{
  "$defs": {
    "ServiceStatus": {
      "enum": [
        "running",
        "stopped",
        "error"
      ],
      "title": "ServiceStatus",
      "type": "string"
    }
  },
  "properties": {
    "openai_api_key_configured": {
      "title": "Openai Api Key Configured",
      "type": "boolean"
    },
    "database_connected": {
      "title": "Database Connected",
      "type": "boolean"
    },
    "vector_store_enabled": {
      "title": "Vector Store Enabled",
      "type": "boolean"
    },
    "services_status": {
      "additionalProperties": {
        "$ref": "#/$defs/ServiceStatus"
      },
      "title": "Services Status",
      "type": "object"
    }
  },
  "required": [
    "openai_api_key_configured",
    "database_connected",
    "vector_store_enabled",
    "services_status"
  ],
  "title": "EnvironmentConfigAPI",
  "type": "object"
}

--- LLMTextConfigAPI ---
{
  "properties": {
    "system_prompts": {
      "additionalProperties": {
        "type": "string"
      },
      "title": "System Prompts",
      "type": "object"
    },
    "analysis_templates": {
      "additionalProperties": {
        "type": "string"
      },
      "title": "Analysis Templates",
      "type": "object"
    },
    "response_formats": {
      "additionalProperties": true,
      "title": "Response Formats",
      "type": "object"
    }
  },
  "required": [
    "system_prompts",
    "analysis_templates",
    "response_formats"
  ],
  "title": "LLMTextConfigAPI",
  "type": "object"
}

--- OrchestrationResponseAPI ---
{
  "$defs": {
    "OrchestrationStatus": {
      "enum": [
        "started",
        "running",
        "completed",
        "failed"
      ],
      "title": "OrchestrationStatus",
      "type": "string"
    }
  },
  "properties": {
    "invocation_id": {
      "title": "Invocation Id",
      "type": "string"
    },
    "status": {
      "$ref": "#/$defs/OrchestrationStatus"
    },
    "message": {
      "title": "Message",
      "type": "string"
    }
  },
  "required": [
    "invocation_id",
    "status",
    "message"
  ],
  "title": "OrchestrationResponseAPI",
  "type": "object"
}

--- CanvasDataAPI ---
{
  "$defs": {
    "CanvasEdgeAPI": {
      "properties": {
        "data": {
          "$ref": "#/$defs/CanvasEdgeDataAPI"
        }
      },
      "required": [
        "data"
      ],
      "title": "CanvasEdgeAPI",
      "type": "object"
    },
    "CanvasEdgeDataAPI": {
      "properties": {
        "id": {
          "title": "Id",
          "type": "string"
        },
        "source": {
          "title": "Source",
          "type": "string"
        },
        "target": {
          "title": "Target",
          "type": "string"
        },
        "connectionType": {
          "$ref": "#/$defs/ConnectionType"
        },
        "percentage": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Percentage"
        },
        "link_id": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Link Id"
        }
      },
      "required": [
        "id",
        "source",
        "target",
        "connectionType"
      ],
      "title": "CanvasEdgeDataAPI",
      "type": "object"
    },
    "CanvasNodeAPI": {
      "properties": {
        "data": {
          "$ref": "#/$defs/CanvasNodeDataAPI"
        },
        "position": {
          "$ref": "#/$defs/CanvasPositionAPI"
        }
      },
      "required": [
        "data",
        "position"
      ],
      "title": "CanvasNodeAPI",
      "type": "object"
    },
    "CanvasNodeDataAPI": {
      "properties": {
        "id": {
          "title": "Id",
          "type": "string"
        },
        "label": {
          "title": "Label",
          "type": "string"
        },
        "type": {
          "$ref": "#/$defs/CanvasNodeType"
        },
        "segment_id": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Segment Id"
        },
        "plan_id": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Plan Id"
        }
      },
      "required": [
        "id",
        "label",
        "type"
      ],
      "title": "CanvasNodeDataAPI",
      "type": "object"
    },
    "CanvasNodeType": {
      "enum": [
        "customerSegment",
        "pricingPlan"
      ],
      "title": "CanvasNodeType",
      "type": "string"
    },
    "CanvasPositionAPI": {
      "properties": {
        "x": {
          "title": "X",
          "type": "number"
        },
        "y": {
          "title": "Y",
          "type": "number"
        }
      },
      "required": [
        "x",
        "y"
      ],
      "title": "CanvasPositionAPI",
      "type": "object"
    },
    "ConnectionType": {
      "enum": [
        "finalized",
        "experimental"
      ],
      "title": "ConnectionType",
      "type": "string"
    }
  },
  "properties": {
    "nodes": {
      "items": {
        "$ref": "#/$defs/CanvasNodeAPI"
      },
      "title": "Nodes",
      "type": "array"
    },
    "edges": {
      "items": {
        "$ref": "#/$defs/CanvasEdgeAPI"
      },
      "title": "Edges",
      "type": "array"
    }
  },
  "required": [
    "nodes",
    "edges"
  ],
  "title": "CanvasDataAPI",
  "type": "object"
}

--- HealthCheckResponseAPI ---
{
  "properties": {
    "status": {
      "title": "Status",
      "type": "string"
    },
    "timestamp": {
      "title": "Timestamp",
      "type": "string"
    }
  },
  "required": [
    "status",
    "timestamp"
  ],
  "title": "HealthCheckResponseAPI",
  "type": "object"
}

--- SuccessResponseAPI ---
{
  "properties": {
    "success": {
      "title": "Success",
      "type": "boolean"
    }
  },
  "required": [
    "success"
  ],
  "title": "SuccessResponseAPI",
  "type": "object"
}

--- CreateCanvasConnectionResponseAPI ---
{
  "properties": {
    "success": {
      "title": "Success",
      "type": "boolean"
    },
    "connection_id": {
      "title": "Connection Id",
      "type": "string"
    }
  },
  "required": [
    "success",
    "connection_id"
  ],
  "title": "CreateCanvasConnectionResponseAPI",
  "type": "object"
}

--- APIResponseAPI ---
{
  "$defs": {
    "APIErrorAPI": {
      "properties": {
        "error": {
          "title": "Error",
          "type": "string"
        },
        "message": {
          "title": "Message",
          "type": "string"
        },
        "details": {
          "anyOf": [
            {},
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Details"
        }
      },
      "required": [
        "error",
        "message"
      ],
      "title": "APIErrorAPI",
      "type": "object"
    }
  },
  "properties": {
    "success": {
      "title": "Success",
      "type": "boolean"
    },
    "data": {
      "anyOf": [
        {},
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Data"
    },
    "error": {
      "anyOf": [
        {
          "$ref": "#/$defs/APIErrorAPI"
        },
        {
          "type": "null"
        }
      ],
      "default": null
    }
  },
  "required": [
    "success"
  ],
  "title": "APIResponseAPI",
  "type": "object"
}

--- ListResponseAPI ---
{
  "properties": {
    "items": {
      "items": {},
      "title": "Items",
      "type": "array"
    },
    "total_count": {
      "title": "Total Count",
      "type": "integer"
    },
    "page": {
      "anyOf": [
        {
          "type": "integer"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Page"
    },
    "page_size": {
      "anyOf": [
        {
          "type": "integer"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Page Size"
    }
  },
  "required": [
    "items",
    "total_count"
  ],
  "title": "ListResponseAPI",
  "type": "object"
}

----------------------------------------
INTERNAL MODELS
----------------------------------------

--- TsObjectPydantic ---
{
  "properties": {
    "usage_value_in_units": {
      "anyOf": [
        {
          "type": "number"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Usage Value In Units"
    },
    "usage_unit": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Usage Unit"
    },
    "target_date": {
      "anyOf": [
        {
          "format": "date-time",
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Target Date"
    }
  },
  "title": "TsObjectPydantic",
  "type": "object"
}

--- CustomerSegmentPydantic ---
{
  "properties": {
    "segment_name": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Segment Name"
    },
    "segment_cdp_uid": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Segment Cdp Uid"
    },
    "segment_description": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Segment Description"
    },
    "segment_filter_logic": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Segment Filter Logic"
    },
    "segment_usage_summary": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Segment Usage Summary"
    },
    "segment_revenue_attribution_summary": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Segment Revenue Attribution Summary"
    }
  },
  "title": "CustomerSegmentPydantic",
  "type": "object"
}

--- CompetitorsPydantic ---
{
  "properties": {
    "name": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Name"
    },
    "url": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Url"
    },
    "background_research_docs": {
      "anyOf": [
        {
          "items": {
            "type": "string"
          },
          "type": "array"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Background Research Docs"
    },
    "competitor_vs_id": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Competitor Vs Id"
    }
  },
  "title": "CompetitorsPydantic",
  "type": "object"
}

--- ProductPydantic ---
{
  "$defs": {
    "CompetitorsPydantic": {
      "properties": {
        "name": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Name"
        },
        "url": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Url"
        },
        "background_research_docs": {
          "anyOf": [
            {
              "items": {
                "type": "string"
              },
              "type": "array"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Background Research Docs"
        },
        "competitor_vs_id": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Competitor Vs Id"
        }
      },
      "title": "CompetitorsPydantic",
      "type": "object"
    }
  },
  "properties": {
    "product_name": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Product Name"
    },
    "product_industry": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Product Industry"
    },
    "product_description": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Product Description"
    },
    "product_icp_summary": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Product Icp Summary"
    },
    "product_categories": {
      "anyOf": [
        {
          "items": {
            "type": "string"
          },
          "type": "array"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Product Categories"
    },
    "product_categories_vs_id": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Product Categories Vs Id"
    },
    "product_feature_docs": {
      "anyOf": [
        {
          "items": {
            "type": "string"
          },
          "type": "array"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Product Feature Docs"
    },
    "product_feature_docs_vs_id": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Product Feature Docs Vs Id"
    },
    "product_marketing_docs": {
      "anyOf": [
        {
          "items": {
            "type": "string"
          },
          "type": "array"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Product Marketing Docs"
    },
    "product_marketing_docs_vs_id": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Product Marketing Docs Vs Id"
    },
    "product_technical_docs": {
      "anyOf": [
        {
          "items": {
            "type": "string"
          },
          "type": "array"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Product Technical Docs"
    },
    "product_technical_docs_vs_id": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Product Technical Docs Vs Id"
    },
    "product_usage_docs": {
      "anyOf": [
        {
          "items": {
            "type": "string"
          },
          "type": "array"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Product Usage Docs"
    },
    "product_usage_docs_vs_id": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Product Usage Docs Vs Id"
    },
    "product_competitors": {
      "anyOf": [
        {
          "$ref": "#/$defs/CompetitorsPydantic"
        },
        {
          "type": "null"
        }
      ],
      "default": null
    }
  },
  "title": "ProductPydantic",
  "type": "object"
}

--- MonthlyProjection ---
{
  "properties": {
    "month": {
      "title": "Month",
      "type": "string"
    },
    "conservative_estimate": {
      "anyOf": [
        {
          "type": "number"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Conservative Estimate"
    },
    "realistic_estimate": {
      "anyOf": [
        {
          "type": "number"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Realistic Estimate"
    },
    "optimistic_estimate": {
      "anyOf": [
        {
          "type": "number"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Optimistic Estimate"
    },
    "confidence_interval_lower": {
      "anyOf": [
        {
          "type": "number"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Confidence Interval Lower"
    },
    "confidence_interval_upper": {
      "anyOf": [
        {
          "type": "number"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Confidence Interval Upper"
    }
  },
  "required": [
    "month"
  ],
  "title": "MonthlyProjection",
  "type": "object"
}

--- BreakEvenAnalysis ---
{
  "properties": {
    "conservative_break_even_months": {
      "anyOf": [
        {
          "type": "integer"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Conservative Break Even Months"
    },
    "realistic_break_even_months": {
      "anyOf": [
        {
          "type": "integer"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Realistic Break Even Months"
    },
    "optimistic_break_even_months": {
      "anyOf": [
        {
          "type": "integer"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Optimistic Break Even Months"
    },
    "customer_acquisition_required": {
      "anyOf": [
        {
          "type": "integer"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Customer Acquisition Required"
    },
    "break_even_conditions": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Break Even Conditions"
    }
  },
  "title": "BreakEvenAnalysis",
  "type": "object"
}

--- InvestmentRequirements ---
{
  "properties": {
    "upfront_investment": {
      "anyOf": [
        {
          "type": "number"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Upfront Investment"
    },
    "ongoing_monthly_costs": {
      "anyOf": [
        {
          "type": "number"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Ongoing Monthly Costs"
    },
    "infrastructure_costs": {
      "anyOf": [
        {
          "type": "number"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Infrastructure Costs"
    },
    "personnel_costs": {
      "anyOf": [
        {
          "type": "number"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Personnel Costs"
    },
    "system_costs": {
      "anyOf": [
        {
          "type": "number"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "System Costs"
    },
    "total_investment_12_months": {
      "anyOf": [
        {
          "type": "number"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Total Investment 12 Months"
    }
  },
  "title": "InvestmentRequirements",
  "type": "object"
}

--- RiskAssessment ---
{
  "properties": {
    "high_risk_factors": {
      "anyOf": [
        {
          "items": {
            "type": "string"
          },
          "type": "array"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "High Risk Factors"
    },
    "medium_risk_factors": {
      "anyOf": [
        {
          "items": {
            "type": "string"
          },
          "type": "array"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Medium Risk Factors"
    },
    "low_risk_factors": {
      "anyOf": [
        {
          "items": {
            "type": "string"
          },
          "type": "array"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Low Risk Factors"
    },
    "financial_risk_amount": {
      "anyOf": [
        {
          "type": "number"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Financial Risk Amount"
    },
    "risk_mitigation_strategies": {
      "anyOf": [
        {
          "items": {
            "type": "string"
          },
          "type": "array"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Risk Mitigation Strategies"
    }
  },
  "title": "RiskAssessment",
  "type": "object"
}

--- SensitivityAnalysis ---
{
  "properties": {
    "key_variables": {
      "anyOf": [
        {
          "items": {
            "type": "string"
          },
          "type": "array"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Key Variables"
    },
    "customer_acquisition_impact": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Customer Acquisition Impact"
    },
    "pricing_sensitivity": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Pricing Sensitivity"
    },
    "market_response_impact": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Market Response Impact"
    }
  },
  "title": "SensitivityAnalysis",
  "type": "object"
}

--- FinancingNeeds ---
{
  "properties": {
    "external_financing_required": {
      "anyOf": [
        {
          "type": "boolean"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "External Financing Required"
    },
    "financing_amount": {
      "anyOf": [
        {
          "type": "number"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Financing Amount"
    },
    "financing_timeline": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Financing Timeline"
    },
    "recommended_financing_type": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Recommended Financing Type"
    }
  },
  "title": "FinancingNeeds",
  "type": "object"
}

--- CashflowAnalysisResult ---
{
  "$defs": {
    "BreakEvenAnalysis": {
      "properties": {
        "conservative_break_even_months": {
          "anyOf": [
            {
              "type": "integer"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Conservative Break Even Months"
        },
        "realistic_break_even_months": {
          "anyOf": [
            {
              "type": "integer"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Realistic Break Even Months"
        },
        "optimistic_break_even_months": {
          "anyOf": [
            {
              "type": "integer"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Optimistic Break Even Months"
        },
        "customer_acquisition_required": {
          "anyOf": [
            {
              "type": "integer"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Customer Acquisition Required"
        },
        "break_even_conditions": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Break Even Conditions"
        }
      },
      "title": "BreakEvenAnalysis",
      "type": "object"
    },
    "FinancingNeeds": {
      "properties": {
        "external_financing_required": {
          "anyOf": [
            {
              "type": "boolean"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "External Financing Required"
        },
        "financing_amount": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Financing Amount"
        },
        "financing_timeline": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Financing Timeline"
        },
        "recommended_financing_type": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Recommended Financing Type"
        }
      },
      "title": "FinancingNeeds",
      "type": "object"
    },
    "InvestmentRequirements": {
      "properties": {
        "upfront_investment": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Upfront Investment"
        },
        "ongoing_monthly_costs": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Ongoing Monthly Costs"
        },
        "infrastructure_costs": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Infrastructure Costs"
        },
        "personnel_costs": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Personnel Costs"
        },
        "system_costs": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "System Costs"
        },
        "total_investment_12_months": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Total Investment 12 Months"
        }
      },
      "title": "InvestmentRequirements",
      "type": "object"
    },
    "MonthlyProjection": {
      "properties": {
        "month": {
          "title": "Month",
          "type": "string"
        },
        "conservative_estimate": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Conservative Estimate"
        },
        "realistic_estimate": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Realistic Estimate"
        },
        "optimistic_estimate": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Optimistic Estimate"
        },
        "confidence_interval_lower": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Confidence Interval Lower"
        },
        "confidence_interval_upper": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Confidence Interval Upper"
        }
      },
      "required": [
        "month"
      ],
      "title": "MonthlyProjection",
      "type": "object"
    },
    "RiskAssessment": {
      "properties": {
        "high_risk_factors": {
          "anyOf": [
            {
              "items": {
                "type": "string"
              },
              "type": "array"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "High Risk Factors"
        },
        "medium_risk_factors": {
          "anyOf": [
            {
              "items": {
                "type": "string"
              },
              "type": "array"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Medium Risk Factors"
        },
        "low_risk_factors": {
          "anyOf": [
            {
              "items": {
                "type": "string"
              },
              "type": "array"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Low Risk Factors"
        },
        "financial_risk_amount": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Financial Risk Amount"
        },
        "risk_mitigation_strategies": {
          "anyOf": [
            {
              "items": {
                "type": "string"
              },
              "type": "array"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Risk Mitigation Strategies"
        }
      },
      "title": "RiskAssessment",
      "type": "object"
    },
    "SensitivityAnalysis": {
      "properties": {
        "key_variables": {
          "anyOf": [
            {
              "items": {
                "type": "string"
              },
              "type": "array"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Key Variables"
        },
        "customer_acquisition_impact": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Customer Acquisition Impact"
        },
        "pricing_sensitivity": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Pricing Sensitivity"
        },
        "market_response_impact": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Market Response Impact"
        }
      },
      "title": "SensitivityAnalysis",
      "type": "object"
    }
  },
  "properties": {
    "cash_flow_summary": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Cash Flow Summary"
    },
    "monthly_projections": {
      "anyOf": [
        {
          "items": {
            "$ref": "#/$defs/MonthlyProjection"
          },
          "type": "array"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Monthly Projections"
    },
    "break_even_analysis": {
      "anyOf": [
        {
          "$ref": "#/$defs/BreakEvenAnalysis"
        },
        {
          "type": "null"
        }
      ],
      "default": null
    },
    "investment_requirements": {
      "anyOf": [
        {
          "$ref": "#/$defs/InvestmentRequirements"
        },
        {
          "type": "null"
        }
      ],
      "default": null
    },
    "risk_assessment": {
      "anyOf": [
        {
          "$ref": "#/$defs/RiskAssessment"
        },
        {
          "type": "null"
        }
      ],
      "default": null
    },
    "sensitivity_analysis": {
      "anyOf": [
        {
          "$ref": "#/$defs/SensitivityAnalysis"
        },
        {
          "type": "null"
        }
      ],
      "default": null
    },
    "financing_needs": {
      "anyOf": [
        {
          "$ref": "#/$defs/FinancingNeeds"
        },
        {
          "type": "null"
        }
      ],
      "default": null
    },
    "approval_recommendation": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Approval Recommendation"
    },
    "key_assumptions": {
      "anyOf": [
        {
          "items": {
            "type": "string"
          },
          "type": "array"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Key Assumptions"
    }
  },
  "title": "CashflowAnalysisResult",
  "type": "object"
}

--- PricingExperimentPydantic ---
{
  "$defs": {
    "CompetitorsPydantic": {
      "properties": {
        "name": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Name"
        },
        "url": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Url"
        },
        "background_research_docs": {
          "anyOf": [
            {
              "items": {
                "type": "string"
              },
              "type": "array"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Background Research Docs"
        },
        "competitor_vs_id": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Competitor Vs Id"
        }
      },
      "title": "CompetitorsPydantic",
      "type": "object"
    },
    "CustomerSegmentPydantic": {
      "properties": {
        "segment_name": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Segment Name"
        },
        "segment_cdp_uid": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Segment Cdp Uid"
        },
        "segment_description": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Segment Description"
        },
        "segment_filter_logic": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Segment Filter Logic"
        },
        "segment_usage_summary": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Segment Usage Summary"
        },
        "segment_revenue_attribution_summary": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Segment Revenue Attribution Summary"
        }
      },
      "title": "CustomerSegmentPydantic",
      "type": "object"
    },
    "ExperimentGenStage": {
      "enum": [
        "product_context_initialized",
        "segments_loaded",
        "positioning_usage_analysis_done",
        "roi_gap_analyzer_run",
        "experimental_plan_generated",
        "simulations_run",
        "scenario_builder_completed",
        "cashflow_feasibility_runs_completed",
        "completed",
        "deployed",
        "feedback_collected"
      ],
      "title": "ExperimentGenStage",
      "type": "string"
    },
    "ProductPydantic": {
      "properties": {
        "product_name": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Product Name"
        },
        "product_industry": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Product Industry"
        },
        "product_description": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Product Description"
        },
        "product_icp_summary": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Product Icp Summary"
        },
        "product_categories": {
          "anyOf": [
            {
              "items": {
                "type": "string"
              },
              "type": "array"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Product Categories"
        },
        "product_categories_vs_id": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Product Categories Vs Id"
        },
        "product_feature_docs": {
          "anyOf": [
            {
              "items": {
                "type": "string"
              },
              "type": "array"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Product Feature Docs"
        },
        "product_feature_docs_vs_id": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Product Feature Docs Vs Id"
        },
        "product_marketing_docs": {
          "anyOf": [
            {
              "items": {
                "type": "string"
              },
              "type": "array"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Product Marketing Docs"
        },
        "product_marketing_docs_vs_id": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Product Marketing Docs Vs Id"
        },
        "product_technical_docs": {
          "anyOf": [
            {
              "items": {
                "type": "string"
              },
              "type": "array"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Product Technical Docs"
        },
        "product_technical_docs_vs_id": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Product Technical Docs Vs Id"
        },
        "product_usage_docs": {
          "anyOf": [
            {
              "items": {
                "type": "string"
              },
              "type": "array"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Product Usage Docs"
        },
        "product_usage_docs_vs_id": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Product Usage Docs Vs Id"
        },
        "product_competitors": {
          "anyOf": [
            {
              "$ref": "#/$defs/CompetitorsPydantic"
            },
            {
              "type": "null"
            }
          ],
          "default": null
        }
      },
      "title": "ProductPydantic",
      "type": "object"
    },
    "TsObjectPydantic": {
      "properties": {
        "usage_value_in_units": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Usage Value In Units"
        },
        "usage_unit": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Usage Unit"
        },
        "target_date": {
          "anyOf": [
            {
              "format": "date-time",
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Target Date"
        }
      },
      "title": "TsObjectPydantic",
      "type": "object"
    }
  },
  "properties": {
    "product": {
      "anyOf": [
        {
          "$ref": "#/$defs/ProductPydantic"
        },
        {
          "type": "null"
        }
      ],
      "default": null
    },
    "experiment_number": {
      "anyOf": [
        {
          "type": "integer"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Experiment Number"
    },
    "experiment_gen_stage": {
      "anyOf": [
        {
          "$ref": "#/$defs/ExperimentGenStage"
        },
        {
          "type": "null"
        }
      ],
      "default": null
    },
    "objective": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Objective"
    },
    "usecase": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Usecase"
    },
    "product_seed_context": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Product Seed Context"
    },
    "relevant_segment": {
      "anyOf": [
        {
          "$ref": "#/$defs/CustomerSegmentPydantic"
        },
        {
          "type": "null"
        }
      ],
      "default": null
    },
    "positioning_summary": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Positioning Summary"
    },
    "usage_summary": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Usage Summary"
    },
    "roi_gaps": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Roi Gaps"
    },
    "experimental_pricing_plan": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Experimental Pricing Plan"
    },
    "simulation_result": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Simulation Result"
    },
    "usage_projections": {
      "anyOf": [
        {
          "items": {
            "$ref": "#/$defs/TsObjectPydantic"
          },
          "type": "array"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Usage Projections"
    },
    "revenue_projections": {
      "anyOf": [
        {
          "items": {
            "$ref": "#/$defs/TsObjectPydantic"
          },
          "type": "array"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Revenue Projections"
    },
    "cashflow_feasibility_comments": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Cashflow Feasibility Comments"
    },
    "cashflow_no_negative_impact_approval_given": {
      "anyOf": [
        {
          "type": "boolean"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Cashflow No Negative Impact Approval Given"
    },
    "experiment_is_deployed": {
      "anyOf": [
        {
          "type": "boolean"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Experiment Is Deployed"
    },
    "experiment_deployed_on": {
      "anyOf": [
        {
          "format": "date-time",
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Experiment Deployed On"
    },
    "experiment_feedback_summary": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Experiment Feedback Summary"
    }
  },
  "title": "PricingExperimentPydantic",
  "type": "object"
}

================================================================================
END OF PYDANTIC SCHEMAS
================================================================================

