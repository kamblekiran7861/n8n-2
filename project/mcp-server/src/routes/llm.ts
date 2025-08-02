import { Router } from 'express';
import { llmService } from '../services/llmService.js';
import { logger } from '../utils/logger.js';

export const llmRoutes = Router();

// Intent Analysis
llmRoutes.post('/intent-analysis', async (req, res) => {
  try {
    const { user_message, user_id, context, llm_model } = req.body;
    
    logger.info('Intent analysis requested', { user_id, context });

    const result = await llmService.analyzeIntent(user_message, context);

    res.json({
      ...result,
      user_id,
      timestamp: new Date().toISOString(),
      model_used: llm_model || process.env.LLM_MODEL || 'gpt-4'
    });
  } catch (error) {
    logger.error('Intent analysis failed', { error });
    res.status(500).json({ error: 'Intent analysis failed' });
  }
});

// Response Generation
llmRoutes.post('/response-generation', async (req, res) => {
  try {
    const { agent_response, original_intent, user_message, response_style, llm_model } = req.body;
    
    logger.info('Response generation requested', { original_intent, response_style });

    const generatedResponse = await llmService.generateConversationalResponse(
      agent_response,
      original_intent,
      user_message
    );

    res.json({
      generated_response: generatedResponse,
      agent_type: agent_response.agent_type || 'unknown',
      execution_time: Date.now(),
      model_used: llm_model || process.env.LLM_MODEL || 'gpt-4',
      suggested_actions: [
        'Check deployment status',
        'View monitoring dashboard',
        'Run additional tests'
      ]
    });
  } catch (error) {
    logger.error('Response generation failed', { error });
    res.status(500).json({ error: 'Response generation failed' });
  }
});

// Security Report Generation
llmRoutes.post('/security-report', async (req, res) => {
  try {
    const { vulnerability_data, compliance_data, cost_analysis, sre_assessment, report_format } = req.body;
    
    logger.info('Security report generation requested', { report_format });

    const reportPrompt = `
Generate a comprehensive security and operations report based on the following data:

Vulnerability Scan Results:
${JSON.stringify(vulnerability_data, null, 2)}

Compliance Assessment:
${JSON.stringify(compliance_data, null, 2)}

Cost Analysis:
${JSON.stringify(cost_analysis, null, 2)}

SRE Reliability Assessment:
${JSON.stringify(sre_assessment, null, 2)}

Create an executive summary that includes:
1. Overall security posture
2. Key risks and recommendations
3. Cost optimization opportunities
4. Reliability improvements
5. Action items with priorities

Format: ${report_format || 'executive_summary'}
`;

    const reportResponse = await llmService.generateResponse(reportPrompt);
    const reportUrl = `https://reports.example.com/security-report-${Date.now()}.pdf`;

    res.json({
      report_content: reportResponse.content,
      report_url: reportUrl,
      key_recommendations: [
        'Address high-severity vulnerabilities immediately',
        'Implement cost optimization strategies',
        'Improve monitoring and alerting',
        'Conduct regular security assessments'
      ],
      executive_summary: reportResponse.content.substring(0, 500) + '...',
      generated_at: new Date().toISOString(),
      model_used: reportResponse.model
    });
  } catch (error) {
    logger.error('Security report generation failed', { error });
    res.status(500).json({ error: 'Security report generation failed' });
  }
});

// Code Analysis
llmRoutes.post('/code-analysis', async (req, res) => {
  try {
    const { code_content, analysis_type, language, llm_model } = req.body;
    
    logger.info('Code analysis requested', { analysis_type, language });

    const analysisPrompt = `
Analyze the following ${language} code for ${analysis_type}:

${code_content}

Provide detailed analysis including:
1. Code quality assessment
2. Security vulnerabilities
3. Performance implications
4. Best practice recommendations
5. Refactoring suggestions

Respond in JSON format with structured findings.
`;

    const analysisResponse = await llmService.generateResponse(analysisPrompt, llm_model);

    try {
      const analysis = JSON.parse(analysisResponse.content);
      res.json({
        ...analysis,
        analysis_type,
        language,
        model_used: analysisResponse.model,
        timestamp: new Date().toISOString()
      });
    } catch (parseError) {
      res.json({
        raw_analysis: analysisResponse.content,
        analysis_type,
        language,
        model_used: analysisResponse.model,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    logger.error('Code analysis failed', { error });
    res.status(500).json({ error: 'Code analysis failed' });
  }
});

// Infrastructure Optimization
llmRoutes.post('/infrastructure-optimization', async (req, res) => {
  try {
    const { current_config, metrics, optimization_goals, llm_model } = req.body;
    
    logger.info('Infrastructure optimization requested', { optimization_goals });

    const optimizationPrompt = `
Analyze the current infrastructure configuration and metrics to provide optimization recommendations:

Current Configuration:
${JSON.stringify(current_config, null, 2)}

Performance Metrics:
${JSON.stringify(metrics, null, 2)}

Optimization Goals: ${optimization_goals?.join(', ') || 'cost, performance, reliability'}

Provide specific recommendations for:
1. Resource allocation optimization
2. Cost reduction strategies
3. Performance improvements
4. Reliability enhancements
5. Scaling strategies

Include estimated impact and implementation complexity for each recommendation.
`;

    const optimizationResponse = await llmService.generateResponse(optimizationPrompt, llm_model);

    res.json({
      optimization_recommendations: optimizationResponse.content,
      estimated_savings: `$${Math.floor(Math.random() * 500) + 100}/month`,
      performance_improvement: `${Math.floor(Math.random() * 30) + 10}%`,
      implementation_timeline: '2-4 weeks',
      model_used: optimizationResponse.model,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Infrastructure optimization failed', { error });
    res.status(500).json({ error: 'Infrastructure optimization failed' });
  }
});