import React from 'react';
import { TrendingUp, Server, Globe, Database, AlertTriangle, CheckCircle } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  status: 'healthy' | 'warning' | 'critical';
}

function MetricCard({ title, value, change, trend, icon, status }: MetricCardProps) {
  const statusColors = {
    healthy: 'border-green-500/20 bg-green-500/5',
    warning: 'border-yellow-500/20 bg-yellow-500/5',
    critical: 'border-red-500/20 bg-red-500/5'
  };

  const trendColors = {
    up: 'text-green-400',
    down: 'text-red-400',
    stable: 'text-gray-400'
  };

  return (
    <div className={`bg-gray-800 rounded-lg p-4 border ${statusColors[status]}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm text-gray-400">{title}</span>
        </div>
        {status === 'healthy' ? (
          <CheckCircle className="w-4 h-4 text-green-400" />
        ) : (
          <AlertTriangle className={`w-4 h-4 ${status === 'warning' ? 'text-yellow-400' : 'text-red-400'}`} />
        )}
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-white">{value}</span>
        <span className={`text-sm ${trendColors[trend]}`}>{change}</span>
      </div>
    </div>
  );
}

export default function MonitoringDashboard() {
  const metrics = [
    {
      title: 'Response Time',
      value: '145ms',
      change: '-12%',
      trend: 'up' as const,
      icon: <TrendingUp className="w-4 h-4 text-blue-400" />,
      status: 'healthy' as const
    },
    {
      title: 'CPU Usage',
      value: '67%',
      change: '+5%',
      trend: 'down' as const,
      icon: <Server className="w-4 h-4 text-green-400" />,
      status: 'warning' as const
    },
    {
      title: 'Active Users',
      value: '1,247',
      change: '+23%',
      trend: 'up' as const,
      icon: <Globe className="w-4 h-4 text-purple-400" />,
      status: 'healthy' as const
    },
    {
      title: 'DB Queries',
      value: '2.1k/s',
      change: '+8%',
      trend: 'up' as const,
      icon: <Database className="w-4 h-4 text-orange-400" />,
      status: 'healthy' as const
    }
  ];

  const deployments = [
    { app: 'Frontend', version: 'v2.1.4', status: 'deployed', time: '2m ago' },
    { app: 'API Gateway', version: 'v1.8.2', status: 'deploying', time: '5m ago' },
    { app: 'Auth Service', version: 'v3.2.1', status: 'deployed', time: '1h ago' },
    { app: 'Database', version: 'v5.4.0', status: 'deployed', time: '3h ago' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Deployments</h3>
        <div className="space-y-3">
          {deployments.map((deployment, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  deployment.status === 'deployed' ? 'bg-green-400' : 
                  deployment.status === 'deploying' ? 'bg-blue-400 animate-pulse' : 'bg-red-400'
                }`}></div>
                <div>
                  <span className="text-white font-medium">{deployment.app}</span>
                  <span className="text-gray-400 text-sm ml-2">{deployment.version}</span>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${
                  deployment.status === 'deployed' ? 'text-green-400' : 
                  deployment.status === 'deploying' ? 'text-blue-400' : 'text-red-400'
                } capitalize`}>
                  {deployment.status}
                </div>
                <div className="text-xs text-gray-400">{deployment.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}