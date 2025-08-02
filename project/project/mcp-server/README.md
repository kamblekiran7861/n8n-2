# MCP Server Configuration for Agentic DevOps Platform

## Overview
This MCP (Model Context Protocol) server acts as the central communication hub for all DevOps agents, providing LLM integration and context sharing capabilities.

## Environment Variables Required

```bash
# MCP Server Configuration
MCP_SERVER_TOKEN=your-secure-token-here
MCP_SERVER_PORT=3000

# LLM Configuration
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
LLM_MODEL=gpt-4

# GitHub Integration
GITHUB_TOKEN=your-github-token
GITHUB_WEBHOOK_SECRET=your-webhook-secret

# Azure Cloud Configuration
AZURE_SUBSCRIPTION_ID=your-subscription-id
AZURE_CLIENT_ID=your-client-id
AZURE_CLIENT_SECRET=your-client-secret
AZURE_TENANT_ID=your-tenant-id

# Kubernetes Configuration
KUBECONFIG_PATH=/path/to/kubeconfig
KUBERNETES_NAMESPACE=default

# Docker Registry
DOCKER_REGISTRY_URL=your-registry.azurecr.io
DOCKER_REGISTRY_USERNAME=your-username
DOCKER_REGISTRY_PASSWORD=your-password

# Notification Services
SLACK_WEBHOOK_URL=your-slack-webhook-url
PAGERDUTY_ROUTING_KEY=your-pagerduty-key

# Monitoring
PROMETHEUS_URL=http://prometheus:9090
GRAFANA_URL=http://grafana:3000
```

## Agent Endpoints

### Code Review Agent
- **POST** `/agent/code-review`
- Analyzes pull requests using LLM for code quality, security, and best practices

### Test Writer Agent  
- **POST** `/agent/test-writer`
- Generates comprehensive test suites automatically using LLM analysis

### Build Predictor Agent
- **POST** `/agent/build-predictor`
- Predicts build outcomes and suggests optimizations

### Docker/K8s Handler Agent
- **POST** `/agent/docker-handler`
- Manages containerization and Kubernetes deployments

### Deploy Agent
- **POST** `/agent/deploy`
- Handles deployment orchestration across environments

### Monitor Agent
- **POST** `/agent/monitor`
- Real-time monitoring and anomaly detection with auto-remediation

### Rollback Agent
- **POST** `/agent/rollback`
- Automated rollback capabilities with LLM-driven decision making

## LLM Integration Endpoints

### Intent Analysis
- **POST** `/llm/intent-analysis`
- Analyzes user messages to determine DevOps intent and extract entities

### Response Generation
- **POST** `/llm/response-generation`
- Generates conversational responses based on agent outputs

### Security Report Generation
- **POST** `/llm/security-report`
- Creates comprehensive security and compliance reports

## Monitoring Endpoints

### Active Deployments
- **GET** `/monitoring/deployments`
- Returns list of active deployments for health monitoring

### Health Check
- **POST** `/agent/monitor/health-check`
- Performs health checks on specific deployments

## Setup Instructions

1. **Import Workflows**: Import all JSON files into your n8n instance
2. **Configure Environment**: Set all required environment variables in n8n
3. **Deploy MCP Server**: Deploy the MCP server with proper authentication
4. **Test Webhooks**: Configure GitHub webhooks to trigger the main pipeline
5. **Verify Integrations**: Test all agent communications through the MCP server

## Workflow Descriptions

### 1. Main DevOps Pipeline (`main-devops-pipeline.json`)
- Triggered by GitHub PR events
- Orchestrates Code Review → Test Writer → Build Predictor → Docker Handler → Deploy → Monitor
- Includes approval gates and automated notifications

### 2. Monitoring & Rollback (`monitoring-rollback-workflow.json`)
- Scheduled health checks every 5 minutes
- Automatic anomaly detection and rollback triggers
- PagerDuty integration for critical alerts

### 3. Conversational Interface (`conversational-agent-workflow.json`)
- Natural language processing for DevOps commands
- Intent-based routing to appropriate agents
- Conversational response generation

### 4. Extensibility Demo (`extensibility-demo-workflow.json`)
- Demonstrates adding new agents (Security, Cost Analyzer, SRE)
- Shows how agents can be plugged into existing workflows
- Auto-remediation capabilities

## Agent Communication Flow

```
User/GitHub → n8n Webhook → MCP Server → LLM Analysis → Agent Execution → Response Generation → User/System
```

Each agent communicates through the MCP server, which provides:
- Context sharing between agents
- LLM integration for intelligent decision making
- Audit logging and traceability
- Error handling and retry mechanisms

## Extensibility

To add new agents:
1. Create new endpoint in MCP server
2. Add agent node to n8n workflow
3. Configure LLM integration for the agent
4. Connect to existing workflow pipeline
5. Update monitoring and logging

This architecture allows infinite scalability and easy addition of specialized DevOps agents.