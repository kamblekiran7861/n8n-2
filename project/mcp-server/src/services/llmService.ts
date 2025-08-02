import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { logger } from '../utils/logger.js';

export interface LLMResponse {
  content: string;
  model: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface IntentAnalysisResult {
  intent: string;
  entities: Record<string, any>;
  confidence: number;
  suggested_actions: string[];
}

class LLMService {
  private openai: OpenAI;
  private anthropic: Anthropic;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
  }

  async generateResponse(prompt: string, model: string = 'gpt-4'): Promise<LLMResponse> {
    try {
      if (model.startsWith('claude')) {
        return await this.generateAnthropicResponse(prompt, model);
      } else {
        return await this.generateOpenAIResponse(prompt, model);
      }
    } catch (error) {
      logger.error('LLM generation failed', { error, model, prompt: prompt.substring(0, 100) });
      throw error;
    }
  }

  private async generateOpenAIResponse(prompt: string, model: string): Promise<LLMResponse> {
    const response = await this.openai.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2000
    });

    return {
      content: response.choices[0]?.message?.content || '',
      model,
      usage: response.usage ? {
        prompt_tokens: response.usage.prompt_tokens,
        completion_tokens: response.usage.completion_tokens,
        total_tokens: response.usage.total_tokens
      } : undefined
    };
  }

  private async generateAnthropicResponse(prompt: string, model: string): Promise<LLMResponse> {
    const response = await this.anthropic.messages.create({
      model: model as any,
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }]
    });

    const content = response.content[0];
    return {
      content: content.type === 'text' ? content.text : '',
      model,
      usage: response.usage ? {
        prompt_tokens: response.usage.input_tokens,
        completion_tokens: response.usage.output_tokens,
        total_tokens: response.usage.input_tokens + response.usage.output_tokens
      } : undefined
    };
  }

  async analyzeIntent(userMessage: string, context: string = 'devops'): Promise<IntentAnalysisResult> {
    const prompt = `
Analyze the following user message in the context of a DevOps platform and extract:
1. Primary intent (deploy, monitor, rollback, test, review, build, etc.)
2. Relevant entities (repository, environment, service, version, etc.)
3. Confidence level (0-1)
4. Suggested follow-up actions

User message: "${userMessage}"
Context: ${context}

Respond in JSON format:
{
  "intent": "primary_intent",
  "entities": {
    "key": "value"
  },
  "confidence": 0.95,
  "suggested_actions": ["action1", "action2"]
}
`;

    const response = await this.generateResponse(prompt, process.env.LLM_MODEL || 'gpt-4');
    
    try {
      return JSON.parse(response.content);
    } catch (error) {
      logger.error('Failed to parse intent analysis response', { response: response.content });
      return {
        intent: 'unknown',
        entities: {},
        confidence: 0.1,
        suggested_actions: ['Please rephrase your request']
      };
    }
  }

  async generateConversationalResponse(
    agentResponse: any,
    originalIntent: string,
    userMessage: string
  ): Promise<string> {
    const prompt = `
Generate a conversational response for a DevOps AI assistant based on:

Original user message: "${userMessage}"
Detected intent: "${originalIntent}"
Agent response: ${JSON.stringify(agentResponse, null, 2)}

Create a natural, helpful response that:
1. Acknowledges what was done
2. Provides key information from the agent response
3. Suggests next steps if appropriate
4. Maintains a professional but friendly tone

Keep the response concise and actionable.
`;

    const response = await this.generateResponse(prompt, process.env.LLM_MODEL || 'gpt-4');
    return response.content;
  }

  async analyzeCodeReview(diffContent: string, repository: string): Promise<any> {
    const prompt = `
Analyze this code diff for a pull request in repository "${repository}":

${diffContent}

Provide a comprehensive code review focusing on:
1. Code quality and best practices
2. Security vulnerabilities
3. Performance implications
4. Maintainability concerns
5. Test coverage suggestions

Respond in JSON format with:
{
  "status": "approved|needs_changes|rejected",
  "score": 85,
  "issues": [
    {
      "type": "security|performance|style|logic",
      "severity": "high|medium|low",
      "line": 42,
      "message": "Description of the issue",
      "suggestion": "How to fix it"
    }
  ],
  "summary": "Overall assessment",
  "recommendations": ["List of recommendations"]
}
`;

    const response = await this.generateResponse(prompt, process.env.LLM_MODEL || 'gpt-4');
    
    try {
      return JSON.parse(response.content);
    } catch (error) {
      logger.error('Failed to parse code review response', { response: response.content });
      return {
        status: 'error',
        score: 0,
        issues: [],
        summary: 'Failed to analyze code',
        recommendations: []
      };
    }
  }

  async generateTests(codeContent: string, language: string): Promise<any> {
    const prompt = `
Generate comprehensive unit tests for the following ${language} code:

${codeContent}

Create tests that cover:
1. Happy path scenarios
2. Edge cases
3. Error conditions
4. Boundary conditions

Respond in JSON format:
{
  "tests_generated": 5,
  "test_files": [
    {
      "filename": "test_file.test.js",
      "content": "// Test file content here"
    }
  ],
  "coverage_estimate": 85,
  "test_framework": "jest|mocha|pytest|etc"
}
`;

    const response = await this.generateResponse(prompt, process.env.LLM_MODEL || 'gpt-4');
    
    try {
      return JSON.parse(response.content);
    } catch (error) {
      logger.error('Failed to parse test generation response', { response: response.content });
      return {
        tests_generated: 0,
        test_files: [],
        coverage_estimate: 0,
        test_framework: 'unknown'
      };
    }
  }
}

export const llmService = new LLMService();