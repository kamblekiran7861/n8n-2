import React from 'react';
import { Bot, Activity, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface AgentCardProps {
  name: string;
  description: string;
  status: 'active' | 'idle' | 'processing' | 'error';
  lastAction: string;
  tasksCompleted: number;
  icon: React.ReactNode;
}

const statusConfig = {
  active: { color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20', icon: CheckCircle },
  idle: { color: 'text-gray-400', bg: 'bg-gray-400/10', border: 'border-gray-400/20', icon: Clock },
  processing: { color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', icon: Activity },
  error: { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20', icon: AlertCircle }
};

export default function AgentCard({ name, description, status, lastAction, tasksCompleted, icon }: AgentCardProps) {
  const statusStyle = statusConfig[status];
  const StatusIcon = statusStyle.icon;

  return (
    <div className={`bg-gray-800 rounded-lg p-6 border ${statusStyle.border} hover:border-gray-600 transition-all duration-200 hover:transform hover:scale-105`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${statusStyle.bg}`}>
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-white">{name}</h3>
            <p className="text-sm text-gray-400">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusIcon className={`w-4 h-4 ${statusStyle.color}`} />
          <span className={`text-xs font-medium ${statusStyle.color} capitalize`}>{status}</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Tasks Completed</span>
          <span className="text-sm font-medium text-white">{tasksCompleted}</span>
        </div>
        
        <div>
          <span className="text-sm text-gray-400">Last Action</span>
          <p className="text-sm text-white mt-1">{lastAction}</p>
        </div>
        
        {status === 'processing' && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Processing...</span>
              <span>75%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-blue-400 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}