import React, { useState, useEffect } from 'react';
import { Server, MessageCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  agent: string;
  action: string;
  status: 'success' | 'warning' | 'error' | 'info';
  message: string;
}

const mockLogs: LogEntry[] = [
  {
    id: '1',
    timestamp: '14:23:45',
    agent: 'Code Review Agent',
    action: 'analyze_pull_request',
    status: 'success',
    message: 'Code review completed. 3 suggestions generated.'
  },
  {
    id: '2',
    timestamp: '14:24:12',
    agent: 'Test Writer Agent',
    action: 'generate_unit_tests',
    status: 'info',
    message: 'Generating test cases for new components...'
  },
  {
    id: '3',
    timestamp: '14:24:38',
    agent: 'MCP Server',
    action: 'agent_communication',
    status: 'success',
    message: 'Context shared between Code Review and Test Writer agents'
  },
  {
    id: '4',
    timestamp: '14:25:01',
    agent: 'Build Predictor',
    action: 'predict_build_time',
    status: 'warning',
    message: 'Estimated build time: 12 minutes (longer than usual)'
  },
  {
    id: '5',
    timestamp: '14:25:22',
    agent: 'Deploy Agent',
    action: 'prepare_deployment',
    status: 'info',
    message: 'Preparing Kubernetes manifests for staging environment'
  }
];

const statusIcons = {
  success: <CheckCircle className="w-4 h-4 text-green-400" />,
  warning: <AlertTriangle className="w-4 h-4 text-yellow-400" />,
  error: <AlertTriangle className="w-4 h-4 text-red-400" />,
  info: <Info className="w-4 h-4 text-blue-400" />
};

export default function MCPServerLogs() {
  const [logs, setLogs] = useState<LogEntry[]>(mockLogs);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const newLog: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        agent: ['Monitor Agent', 'Deploy Agent', 'Test Writer Agent'][Math.floor(Math.random() * 3)],
        action: ['health_check', 'deploy_status', 'test_execution'][Math.floor(Math.random() * 3)],
        status: ['success', 'info', 'warning'][Math.floor(Math.random() * 3)] as 'success' | 'info' | 'warning',
        message: [
          'All systems operational',
          'Processing deployment pipeline',
          'Test coverage: 85%',
          'Container health check passed',
          'MCP context synchronization complete'
        ][Math.floor(Math.random() * 5)]
      };

      setLogs(prev => [newLog, ...prev.slice(0, 9)]);
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Server className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">MCP Server Communication</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></div>
          <span className="text-sm text-gray-400">{isLive ? 'Live' : 'Paused'}</span>
          <button
            onClick={() => setIsLive(!isLive)}
            className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded transition-colors"
          >
            {isLive ? 'Pause' : 'Resume'}
          </button>
        </div>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {logs.map((log) => (
          <div key={log.id} className="flex items-start gap-3 p-3 bg-gray-900 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="flex-shrink-0 mt-0.5">
              {statusIcons[log.status]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-white">{log.agent}</span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-400">{log.timestamp}</span>
                <span className="text-xs bg-gray-700 px-2 py-0.5 rounded text-gray-300">{log.action}</span>
              </div>
              <p className="text-sm text-gray-300">{log.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}