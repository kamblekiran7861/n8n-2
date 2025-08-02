import React from 'react';
import { GitBranch, TestTube2, Package, Rocket, Monitor, Shield } from 'lucide-react';

interface WorkflowNode {
  id: string;
  name: string;
  type: 'trigger' | 'agent' | 'action';
  status: 'completed' | 'active' | 'pending' | 'error';
  icon: React.ReactNode;
  position: { x: number; y: number };
}

const nodes: WorkflowNode[] = [
  { id: '1', name: 'Code Push', type: 'trigger', status: 'completed', icon: <GitBranch className="w-4 h-4" />, position: { x: 50, y: 200 } },
  { id: '2', name: 'Code Review Agent', type: 'agent', status: 'completed', icon: <Shield className="w-4 h-4" />, position: { x: 200, y: 120 } },
  { id: '3', name: 'Test Writer Agent', type: 'agent', status: 'active', icon: <TestTube2 className="w-4 h-4" />, position: { x: 200, y: 280 } },
  { id: '4', name: 'Build Agent', type: 'agent', status: 'pending', icon: <Package className="w-4 h-4" />, position: { x: 350, y: 200 } },
  { id: '5', name: 'Deploy Agent', type: 'agent', status: 'pending', icon: <Rocket className="w-4 h-4" />, position: { x: 500, y: 200 } },
  { id: '6', name: 'Monitor Agent', type: 'agent', status: 'pending', icon: <Monitor className="w-4 h-4" />, position: { x: 650, y: 200 } }
];

const connections = [
  { from: '1', to: '2' },
  { from: '1', to: '3' },
  { from: '2', to: '4' },
  { from: '3', to: '4' },
  { from: '4', to: '5' },
  { from: '5', to: '6' }
];

const statusColors = {
  completed: 'bg-green-500 border-green-400',
  active: 'bg-blue-500 border-blue-400 animate-pulse',
  pending: 'bg-gray-600 border-gray-500',
  error: 'bg-red-500 border-red-400'
};

export default function WorkflowCanvas() {
  return (
    <div className="bg-gray-900 rounded-lg p-6 h-96 relative overflow-hidden">
      <h3 className="text-lg font-semibold text-white mb-4">Agent Workflow Pipeline</h3>
      
      <div className="relative w-full h-full">
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
          {connections.map((connection, index) => {
            const fromNode = nodes.find(n => n.id === connection.from);
            const toNode = nodes.find(n => n.id === connection.to);
            if (!fromNode || !toNode) return null;
            
            return (
              <line
                key={index}
                x1={fromNode.position.x + 40}
                y1={fromNode.position.y + 20}
                x2={toNode.position.x}
                y2={toNode.position.y + 20}
                stroke="#4B5563"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
              />
            );
          })}
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#4B5563" />
            </marker>
          </defs>
        </svg>
        
        {nodes.map((node) => (
          <div
            key={node.id}
            className={`absolute w-20 h-10 rounded-lg border-2 flex items-center justify-center ${statusColors[node.status]} transition-all duration-200`}
            style={{ 
              left: node.position.x, 
              top: node.position.y,
              zIndex: 2
            }}
          >
            {node.icon}
          </div>
        ))}
        
        {nodes.map((node) => (
          <div
            key={`label-${node.id}`}
            className="absolute text-xs text-gray-300 text-center"
            style={{ 
              left: node.position.x - 10, 
              top: node.position.y + 45,
              width: 100,
              zIndex: 2
            }}
          >
            {node.name}
          </div>
        ))}
      </div>
    </div>
  );
}