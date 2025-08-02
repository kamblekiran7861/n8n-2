import { Router } from 'express';
import { kubernetesService } from '../services/kubernetesService.js';
import { logger } from '../utils/logger.js';

export const monitoringRoutes = Router();

// Get Active Deployments
monitoringRoutes.get('/deployments', async (req, res) => {
  try {
    const namespace = req.query.namespace as string;
    
    logger.info('Fetching active deployments', { namespace });

    const deployments = await kubernetesService.getActiveDeployments(namespace);

    // Add mock service URLs for monitoring
    const deploymentsWithUrls = deployments.map(deployment => ({
      ...deployment,
      service_url: `https://${deployment.name}-${deployment.namespace}.example.com`,
      health_check_url: `https://${deployment.name}-${deployment.namespace}.example.com/health`,
      metrics_url: `https://prometheus.example.com/graph?g0.expr=up{job="${deployment.name}"}`
    }));

    res.json({
      deployments: deploymentsWithUrls,
      total_count: deploymentsWithUrls.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to fetch deployments', { error });
    res.status(500).json({ error: 'Failed to fetch deployments' });
  }
});

// Get Deployment Status
monitoringRoutes.get('/deployments/:deploymentId/status', async (req, res) => {
  try {
    const { deploymentId } = req.params;
    const [namespace, name] = deploymentId.split('/');
    
    logger.info('Fetching deployment status', { deploymentId, namespace, name });

    const status = await kubernetesService.getDeploymentStatus(name, namespace);

    res.json({
      deployment_id: deploymentId,
      ...status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to fetch deployment status', { error, deploymentId: req.params.deploymentId });
    res.status(500).json({ error: 'Failed to fetch deployment status' });
  }
});

// Get System Metrics
monitoringRoutes.get('/metrics', async (req, res) => {
  try {
    const timeRange = req.query.time_range as string || '1h';
    const services = req.query.services as string;
    
    logger.info('Fetching system metrics', { timeRange, services });

    // Mock metrics data
    const metrics = {
      timestamp: new Date().toISOString(),
      time_range: timeRange,
      system_metrics: {
        cpu_usage: `${Math.floor(Math.random() * 40) + 30}%`,
        memory_usage: `${Math.floor(Math.random() * 30) + 50}%`,
        disk_usage: `${Math.floor(Math.random() * 20) + 40}%`,
        network_io: `${Math.floor(Math.random() * 100) + 50} MB/s`
      },
      application_metrics: {
        response_time: `${Math.floor(Math.random() * 200) + 100}ms`,
        throughput: `${Math.floor(Math.random() * 1000) + 500} req/min`,
        error_rate: `${(Math.random() * 2).toFixed(2)}%`,
        active_connections: Math.floor(Math.random() * 500) + 100
      },
      alerts: [
        {
          id: 'alert-1',
          severity: 'warning',
          message: 'High CPU usage detected on production cluster',
          timestamp: new Date(Date.now() - 300000).toISOString() // 5 minutes ago
        }
      ]
    };

    res.json(metrics);
  } catch (error) {
    logger.error('Failed to fetch metrics', { error });
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

// Get Service Health
monitoringRoutes.get('/health/:serviceName', async (req, res) => {
  try {
    const { serviceName } = req.params;
    const namespace = req.query.namespace as string || 'default';
    
    logger.info('Checking service health', { serviceName, namespace });

    // Mock health check
    const isHealthy = Math.random() > 0.1; // 90% chance of being healthy
    const responseTime = Math.floor(Math.random() * 500) + 100;

    const healthData = {
      service_name: serviceName,
      namespace,
      status: isHealthy ? 'healthy' : 'unhealthy',
      response_time: `${responseTime}ms`,
      uptime: `${Math.floor(Math.random() * 30) + 1} days`,
      last_deployment: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
      health_checks: {
        database: isHealthy ? 'connected' : 'disconnected',
        external_apis: isHealthy ? 'reachable' : 'unreachable',
        cache: isHealthy ? 'available' : 'unavailable'
      },
      metrics: {
        cpu: `${Math.floor(Math.random() * 40) + 30}%`,
        memory: `${Math.floor(Math.random() * 30) + 50}%`,
        requests_per_minute: Math.floor(Math.random() * 1000) + 200,
        error_rate: `${(Math.random() * 3).toFixed(2)}%`
      },
      timestamp: new Date().toISOString()
    };

    res.json(healthData);
  } catch (error) {
    logger.error('Failed to check service health', { error, serviceName: req.params.serviceName });
    res.status(500).json({ error: 'Failed to check service health' });
  }
});

// Get Alerts
monitoringRoutes.get('/alerts', async (req, res) => {
  try {
    const severity = req.query.severity as string;
    const limit = parseInt(req.query.limit as string) || 50;
    
    logger.info('Fetching alerts', { severity, limit });

    // Mock alerts data
    const alerts = [
      {
        id: 'alert-1',
        severity: 'critical',
        title: 'Service Down',
        message: 'Payment service is not responding',
        service: 'payment-service',
        timestamp: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
        status: 'firing',
        labels: {
          environment: 'production',
          team: 'backend'
        }
      },
      {
        id: 'alert-2',
        severity: 'warning',
        title: 'High CPU Usage',
        message: 'CPU usage above 80% for 5 minutes',
        service: 'api-gateway',
        timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
        status: 'firing',
        labels: {
          environment: 'production',
          team: 'platform'
        }
      },
      {
        id: 'alert-3',
        severity: 'info',
        title: 'Deployment Completed',
        message: 'Successfully deployed version 2.1.4',
        service: 'frontend',
        timestamp: new Date(Date.now() - 120000).toISOString(), // 2 minutes ago
        status: 'resolved',
        labels: {
          environment: 'staging',
          team: 'frontend'
        }
      }
    ];

    const filteredAlerts = severity 
      ? alerts.filter(alert => alert.severity === severity)
      : alerts;

    res.json({
      alerts: filteredAlerts.slice(0, limit),
      total_count: filteredAlerts.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to fetch alerts', { error });
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// Create Alert
monitoringRoutes.post('/alerts', async (req, res) => {
  try {
    const { title, message, severity, service, labels } = req.body;
    
    logger.info('Creating alert', { title, severity, service });

    const alert = {
      id: `alert-${Date.now()}`,
      title,
      message,
      severity: severity || 'info',
      service,
      labels: labels || {},
      timestamp: new Date().toISOString(),
      status: 'firing'
    };

    // In a real implementation, this would be stored in a database
    // and potentially trigger notifications

    res.status(201).json({
      alert,
      message: 'Alert created successfully'
    });
  } catch (error) {
    logger.error('Failed to create alert', { error });
    res.status(500).json({ error: 'Failed to create alert' });
  }
});

// Update Alert Status
monitoringRoutes.patch('/alerts/:alertId', async (req, res) => {
  try {
    const { alertId } = req.params;
    const { status, notes } = req.body;
    
    logger.info('Updating alert status', { alertId, status });

    // Mock alert update
    const updatedAlert = {
      id: alertId,
      status: status || 'acknowledged',
      notes: notes || '',
      updated_at: new Date().toISOString(),
      updated_by: req.user?.id || 'system'
    };

    res.json({
      alert: updatedAlert,
      message: 'Alert updated successfully'
    });
  } catch (error) {
    logger.error('Failed to update alert', { error, alertId: req.params.alertId });
    res.status(500).json({ error: 'Failed to update alert' });
  }
});