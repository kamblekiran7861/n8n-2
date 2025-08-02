import React, { useState } from 'react';
import { Send, Bot, User, Zap } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'agent';
  content: string;
  timestamp: string;
  agent?: string;
}

const mockMessages: Message[] = [
  {
    id: '1',
    type: 'agent',
    content: 'Hello! I\'m your DevOps AI assistant. I can help you deploy code, review pull requests, generate tests, and monitor your infrastructure. What would you like me to help with?',
    timestamp: '14:20:00',
    agent: 'Platform Assistant'
  },
  {
    id: '2',
    type: 'user',
    content: 'Deploy the latest changes to staging environment',
    timestamp: '14:20:30'
  },
  {
    id: '3',
    type: 'agent',
    content: 'I\'ll coordinate with the Deploy Agent to push your latest changes to staging. First, let me check the current status with the Monitor Agent...',
    timestamp: '14:20:35',
    agent: 'Platform Assistant'
  },
  {
    id: '4',
    type: 'agent',
    content: 'Staging environment is healthy. Initiating deployment pipeline. The Build Agent is preparing the Docker container, and the Deploy Agent will handle the Kubernetes deployment.',
    timestamp: '14:21:15',
    agent: 'Deploy Agent'
  }
];

export default function ConversationalUI() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate agent response
    setTimeout(() => {
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: 'I understand your request. Let me coordinate with the appropriate agents to handle this task. This may take a few moments...',
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        agent: 'Platform Assistant'
      };
      setMessages(prev => [...prev, agentMessage]);
    }, 1000);
  };

  const quickActions = [
    'Deploy to production',
    'Run regression tests',
    'Check system health',
    'Rollback last deployment'
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-6 h-96 flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Bot className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Agent Console</h3>
        <div className="ml-auto flex items-center gap-2">
          <Zap className="w-4 h-4 text-green-400" />
          <span className="text-sm text-green-400">Online</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.type === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-100'
            }`}>
              {message.type === 'agent' && message.agent && (
                <div className="text-xs text-gray-400 mb-1">{message.agent}</div>
              )}
              <p className="text-sm">{message.content}</p>
              <div className="text-xs text-gray-400 mt-1">{message.timestamp}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => setInputValue(action)}
              className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded-full transition-colors"
            >
              {action}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a command or ask for help..."
            className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}