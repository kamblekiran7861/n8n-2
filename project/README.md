# Agentic AI DevOps Platform

A comprehensive multi-agent DevOps automation platform powered by LLM intelligence and MCP (Model Context Protocol) server architecture.

## 🚀 Features

### Multi-Agent Orchestration
- **Code Review Agent**: AI-powered code analysis for quality, security, and best practices
- **Test Writer Agent**: Automatic generation of comprehensive test suites
- **Build Predictor Agent**: Intelligent build optimization and resource prediction
- **Deploy Agent**: Automated containerization and Kubernetes deployment
- **Monitor Agent**: Real-time health monitoring with anomaly detection
- **Security Agent**: Vulnerability scanning and auto-remediation
- **Cost Analyzer Agent**: Cloud cost optimization recommendations
- **SRE Reliability Agent**: Site reliability engineering assessments

### LLM-Powered Intelligence
- Natural language processing for DevOps commands
- Intelligent code analysis and recommendations
- Automated decision making for deployments and rollbacks
- Context-aware agent communication via MCP server

### Self-Healing Operations
- Automated health monitoring every 5 minutes
- Intelligent anomaly detection with LLM analysis
- Automatic rollback triggers based on performance metrics
- Comprehensive alerting via Slack, PagerDuty, Teams, and email

### Conversational Interface
- Natural language DevOps commands
- Intent recognition and entity extraction
- Contextual responses and follow-up suggestions
- Real-time agent communication logs

## 🏗️ Architecture

```
GitHub Events → n8n Workflows → MCP Server → LLM Models → DevOps Actions
                     ↓
            Agent Orchestration & Context Sharing
                     ↓
        Azure/K8s Deployments & Monitoring
```

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** for build tooling

### Backend (MCP Server)
- **Node.js** with Express.js
- **TypeScript** for type safety
- **OpenAI & Anthropic APIs** for LLM integration
- **Kubernetes Client** for container orchestration
- **GitHub API** for repository integration
- **Azure SDK** for cloud services

### Workflow Orchestration
- **n8n** for visual workflow automation
- **Custom MCP Server** for agent communication
- **Docker & Kubernetes** for deployment

### Monitoring & Observability
- **Winston** for structured logging
- **Prometheus** metrics integration
- **Grafana** dashboard support
- **Custom health check endpoints**

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Kubernetes cluster access
- n8n instance
- OpenAI/Anthropic API keys
- GitHub token
- Azure subscription (optional)

### 1. Clone and Setup Frontend
```bash
git clone <repository-url>
cd agentic-devops-platform
npm install
npm run dev
```

### 2. Setup MCP Server
```bash
cd mcp-server
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

### 3. Deploy with Docker
```bash
cd mcp-server
docker-compose up -d
```

### 4. Import n8n Workflows
1. Open your n8n instance
2. Import workflows from `n8n-workflows/` directory:
   - `main-devops-pipeline.json`
   - `monitoring-rollback-workflow.json`
   - `conversational-agent-workflow.json`
   - `extensibility-demo-workflow.json`

### 5. Configure Environment Variables
Set these in your n8n instance:
```bash
MCP_SERVER_TOKEN=your-secure-token
MCP_SERVER_URL=http://your-mcp-server:3000
OPENAI_API_KEY=your-openai-key
GITHUB_TOKEN=your-github-token
AZURE_SUBSCRIPTION_ID=your-subscription-id
SLACK_WEBHOOK_URL=your-slack-webhook
PAGERDUTY_ROUTING_KEY=your-pagerduty-key
```

## 📋 API Documentation

### Agent Endpoints

#### Code Review Agent
```http
POST /agent/code-review
Content-Type: application/json
Authorization: Bearer <token>

{
  "repository": "owner/repo",
  "pr_number": 123,
  "diff_url": "https://github.com/owner/repo/pull/123.diff",
  "llm_model": "gpt-4"
}
```

#### Deploy Agent
```http
POST /agent/deploy
Content-Type: application/json
Authorization: Bearer <token>

{
  "repository": "owner/repo",
  "image_tag": "registry.com/image:tag",
  "environment": "staging",
  "kubernetes_config": {...}
}
```

#### Monitor Agent
```http
POST /agent/monitor/health-check
Content-Type: application/json
Authorization: Bearer <token>

{
  "deployment_id": "namespace/deployment-name",
  "service_url": "https://service.example.com"
}
```

### LLM Integration Endpoints

#### Intent Analysis
```http
POST /llm/intent-analysis
Content-Type: application/json
Authorization: Bearer <token>

{
  "user_message": "Deploy the latest changes to staging",
  "user_id": "user-123",
  "context": "devops_platform"
}
```

#### Response Generation
```http
POST /llm/response-generation
Content-Type: application/json
Authorization: Bearer <token>

{
  "agent_response": {...},
  "original_intent": "deploy",
  "user_message": "Deploy to staging",
  "response_style": "conversational"
}
```

## 🔧 Configuration

### MCP Server Environment Variables
```bash
# Core Configuration
MCP_SERVER_TOKEN=your-secure-token
MCP_SERVER_PORT=3000
NODE_ENV=production

# LLM Integration
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
LLM_MODEL=gpt-4

# Cloud & Infrastructure
AZURE_SUBSCRIPTION_ID=your-subscription-id
AZURE_CLIENT_ID=your-client-id
AZURE_CLIENT_SECRET=your-client-secret
KUBECONFIG_PATH=/path/to/kubeconfig

# Notifications
SLACK_WEBHOOK_URL=your-slack-webhook
PAGERDUTY_ROUTING_KEY=your-pagerduty-key
```

### Kubernetes Configuration
The platform requires access to a Kubernetes cluster. Configure via:
- `KUBECONFIG_PATH` environment variable
- Default kubeconfig location (`~/.kube/config`)
- In-cluster configuration (when running in Kubernetes)

## 🔒 Security

### Authentication
- Bearer token authentication for all API endpoints
- JWT support for user-based authentication
- Role-based access control (RBAC)

### Data Protection
- Secure token management
- Audit logging for all operations
- Encrypted communication between components
- No sensitive data in logs

### Best Practices
- Regular security scans via Security Agent
- Automated vulnerability remediation
- Compliance checking (SOC2, GDPR, HIPAA)
- Infrastructure security assessments

## 📊 Monitoring & Observability

### Metrics Collection
- Application performance metrics
- Infrastructure resource usage
- Agent execution statistics
- User interaction analytics

### Alerting
- Real-time anomaly detection
- Configurable alert thresholds
- Multi-channel notifications
- Escalation policies

### Logging
- Structured logging with Winston
- Conversation history tracking
- Audit trail for all operations
- Agent activity monitoring

## 🧪 Testing

### Frontend Tests
```bash
npm run test
```

### Backend Tests
```bash
cd mcp-server
npm run test
```

### Integration Tests
```bash
# Test MCP server endpoints
curl -H "Authorization: Bearer $MCP_SERVER_TOKEN" \
     http://localhost:3000/health

# Test agent communication
curl -X POST -H "Content-Type: application/json" \
     -H "Authorization: Bearer $MCP_SERVER_TOKEN" \
     -d '{"user_message":"Deploy to staging","user_id":"test"}' \
     http://localhost:3000/llm/intent-analysis
```

## 🚀 Deployment

### Production Deployment
1. Build and push Docker images
2. Deploy MCP server to Kubernetes
3. Configure load balancer and SSL
4. Set up monitoring and alerting
5. Configure backup and disaster recovery

### Scaling Considerations
- Horizontal scaling of MCP server instances
- Load balancing for high availability
- Database clustering for persistent storage
- CDN for frontend assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

### Development Guidelines
- Follow TypeScript best practices
- Maintain test coverage above 80%
- Use conventional commit messages
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI and Anthropic for LLM APIs
- n8n community for workflow automation
- Kubernetes community for container orchestration
- React and TypeScript communities

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Join our Discord community
- Check the documentation wiki
- Contact the maintainers

---

**Built with ❤️ for the DevOps community**