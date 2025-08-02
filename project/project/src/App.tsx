import React, { useState } from 'react';
import { Bot, GitBranch, TestTube2, Package, Rocket, Monitor, Shield, Code, BarChart3, MessageSquare, Settings } from 'lucide-react';
import AgentCard from './components/AgentCard';
import WorkflowCanvas from './components/WorkflowCanvas';
import MCPServerLogs from './components/MCPServerLogs';
import ConversationalUI from './components/ConversationalUI';
import MonitoringDashboard from './components/MonitoringDashboard';

const agents = [
  {
    name: 'Code Review Agent',
    description: 'Analyzes code quality, security, and best practices',
    status: 'active' as const,
    lastAction: 'Reviewed PR #247 - Found 3 optimization opportunities',
    tasksCompleted: 127,
    icon: <Shield className="w-5 h-5 text-blue-400" />
  },
  {
    name: 'Test Writer Agent',
    description: 'Generates comprehensive test suites automatically',
    status: 'processing' as const,
    lastAction: 'Generating unit tests for UserService component',
    tasksCompleted: 89,
    icon: <TestTube2 className="w-5 h-5 text-green-400" />
  },
  {
    name: 'Build Predictor',
    description: 'Predicts build outcomes and optimizes CI/CD',
    status: 'idle' as const,
    lastAction: 'Predicted 94% success rate for current build',
    tasksCompleted: 203,
    icon: <Package className="w-5 h-5 text-orange-400" />
  },
  {
    name: 'Deploy Agent',
    description: 'Handles containerization and deployment',
    status: 'active' as const,
    lastAction: 'Deployed v2.1.4 to staging environment',
    tasksCompleted: 156,
    icon: <Rocket className="w-5 h-5 text-purple-400" />
  },
  {
    name: 'Monitor Agent',
    description: 'Real-time monitoring and anomaly detection',
    status: 'active' as const,
    lastAction: 'Detected CPU spike - Auto-scaled instances',
    tasksCompleted: 342,
    icon: <Monitor className="w-5 h-5 text-red-400" />
  },
  {
    name: 'Docker/K8s Handler',
    description: 'Manages containerization and orchestration',
    status: 'processing' as const,
    lastAction: 'Updating Kubernetes manifests for new deployment',
    tasksCompleted: 78,
    icon: <Code className="w-5 h-5 text-cyan-400" />
  }
];

const navigationItems = [
  { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
  { id: 'workflow', name: 'Workflow', icon: GitBranch },
  { id: 'console', name: 'Console', icon: MessageSquare },
  { id: 'monitoring', name: 'Monitoring', icon: Monitor },
  { id: 'settings', name: 'Settings', icon: Settings }
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'workflow':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Agent Workflow Orchestration</h2>
              <p className="text-gray-400">Visual representation of your multi-agent DevOps pipeline powered by n8n</p>
            </div>
            <WorkflowCanvas />
            <MCPServerLogs />
          </div>
        );
      case 'console':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Conversational Interface</h2>
              <p className="text-gray-400">Interact with your DevOps agents through natural language</p>
            </div>
            <ConversationalUI />
            <MCPServerLogs />
          </div>
        );
      case 'monitoring':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Live Monitoring & Analytics</h2>
              <p className="text-gray-400">Real-time system metrics and deployment status</p>
            </div>
            <MonitoringDashboard />
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Platform Configuration</h2>
              <p className="text-gray-400">Configure agents, integrations, and system settings</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Integration Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-300">GitHub Repository</label>
                  <input 
                    type="text" 
                    placeholder="https://github.com/your-org/repo"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-300">Azure Subscription</label>
                  <input 
                    type="text" 
                    placeholder="subscription-id"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-300">Kubernetes Cluster</label>
                  <input 
                    type="text" 
                    placeholder="cluster-name"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-300">MCP Server URL</label>
                  <input 
                    type="text" 
                    placeholder="https://mcp-server.your-domain.com"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Agent Dashboard</h2>
              <p className="text-gray-400">Overview of your multi-agent DevOps platform powered by LLM and MCP server</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {agents.map((agent, index) => (
                <AgentCard key={index} {...agent} />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WorkflowCanvas />
              <div className="space-y-6">
                <ConversationalUI />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Agentic AI DevOps</h1>
                <p className="text-sm text-gray-400">Multi-Agent Platform</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-400">6 Agents Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-400">MCP Server Online</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <nav className="w-64 bg-gray-800 border-r border-gray-700 p-4">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            })}
          </div>

          {/* Agent Status */}
          <div className="mt-8 pt-8 border-t border-gray-700">
            <h3 className="text-sm font-medium text-gray-400 mb-4">Agent Status</h3>
            <div className="space-y-2">
              {agents.slice(0, 3).map((agent, index) => (
                <div key={index} className="flex items-center gap-3 text-sm">
                  <div className={`w-2 h-2 rounded-full ${
                    agent.status === 'active' ? 'bg-green-400' :
                    agent.status === 'processing' ? 'bg-blue-400 animate-pulse' :
                    'bg-gray-500'
                  }`}></div>
                  <span className="text-gray-300 truncate">{agent.name}</span>
                </div>
              ))}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;