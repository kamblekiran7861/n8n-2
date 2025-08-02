import * as k8s from '@kubernetes/client-node';
import { logger } from '../utils/logger.js';

class KubernetesService {
  private k8sApi: k8s.AppsV1Api;
  private coreApi: k8s.CoreV1Api;
  private kc: k8s.KubeConfig;

  constructor() {
    this.kc = new k8s.KubeConfig();
    
    if (process.env.KUBECONFIG_PATH) {
      this.kc.loadFromFile(process.env.KUBECONFIG_PATH);
    } else {
      this.kc.loadFromDefault();
    }

    this.k8sApi = this.kc.makeApiClient(k8s.AppsV1Api);
    this.coreApi = this.kc.makeApiClient(k8s.CoreV1Api);
  }

  async deployApplication(
    name: string,
    image: string,
    namespace: string = 'default',
    replicas: number = 1
  ): Promise<any> {
    try {
      const deployment = {
        apiVersion: 'apps/v1',
        kind: 'Deployment',
        metadata: {
          name,
          namespace,
          labels: {
            app: name,
            'managed-by': 'agentic-devops'
          }
        },
        spec: {
          replicas,
          selector: {
            matchLabels: {
              app: name
            }
          },
          template: {
            metadata: {
              labels: {
                app: name
              }
            },
            spec: {
              containers: [{
                name,
                image,
                ports: [{
                  containerPort: 8080
                }],
                resources: {
                  requests: {
                    memory: '128Mi',
                    cpu: '100m'
                  },
                  limits: {
                    memory: '512Mi',
                    cpu: '500m'
                  }
                }
              }]
            }
          }
        }
      };

      const response = await this.k8sApi.createNamespacedDeployment(namespace, deployment);
      logger.info('Deployment created successfully', { name, namespace, image });
      
      return {
        deployment_id: `${namespace}/${name}`,
        status: 'deployed',
        replicas,
        image,
        namespace
      };
    } catch (error) {
      logger.error('Failed to deploy application', { name, image, namespace, error });
      throw error;
    }
  }

  async getDeploymentStatus(name: string, namespace: string = 'default'): Promise<any> {
    try {
      const response = await this.k8sApi.readNamespacedDeployment(name, namespace);
      const deployment = response.body;

      return {
        name: deployment.metadata?.name,
        namespace: deployment.metadata?.namespace,
        replicas: deployment.spec?.replicas,
        ready_replicas: deployment.status?.readyReplicas || 0,
        available_replicas: deployment.status?.availableReplicas || 0,
        conditions: deployment.status?.conditions || []
      };
    } catch (error) {
      logger.error('Failed to get deployment status', { name, namespace, error });
      throw error;
    }
  }

  async scaleDeployment(name: string, replicas: number, namespace: string = 'default'): Promise<any> {
    try {
      const patch = {
        spec: {
          replicas
        }
      };

      await this.k8sApi.patchNamespacedDeployment(
        name,
        namespace,
        patch,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        {
          headers: {
            'Content-Type': 'application/merge-patch+json'
          }
        }
      );

      logger.info('Deployment scaled successfully', { name, namespace, replicas });
      return { name, namespace, replicas, status: 'scaling' };
    } catch (error) {
      logger.error('Failed to scale deployment', { name, namespace, replicas, error });
      throw error;
    }
  }

  async rollbackDeployment(name: string, namespace: string = 'default'): Promise<any> {
    try {
      // Get deployment history
      const response = await this.k8sApi.listNamespacedReplicaSet(
        namespace,
        undefined,
        undefined,
        undefined,
        undefined,
        `app=${name}`
      );

      const replicaSets = response.body.items
        .filter(rs => rs.metadata?.ownerReferences?.some(ref => ref.name === name))
        .sort((a, b) => {
          const aRevision = parseInt(a.metadata?.annotations?.['deployment.kubernetes.io/revision'] || '0');
          const bRevision = parseInt(b.metadata?.annotations?.['deployment.kubernetes.io/revision'] || '0');
          return bRevision - aRevision;
        });

      if (replicaSets.length < 2) {
        throw new Error('No previous version available for rollback');
      }

      const previousRS = replicaSets[1];
      const previousImage = previousRS.spec?.template?.spec?.containers?.[0]?.image;

      if (!previousImage) {
        throw new Error('Could not determine previous image version');
      }

      // Update deployment with previous image
      const patch = {
        spec: {
          template: {
            spec: {
              containers: [{
                name,
                image: previousImage
              }]
            }
          }
        }
      };

      await this.k8sApi.patchNamespacedDeployment(
        name,
        namespace,
        patch,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        {
          headers: {
            'Content-Type': 'application/merge-patch+json'
          }
        }
      );

      logger.info('Deployment rolled back successfully', { name, namespace, previousImage });
      return {
        name,
        namespace,
        previous_image: previousImage,
        status: 'rolling_back'
      };
    } catch (error) {
      logger.error('Failed to rollback deployment', { name, namespace, error });
      throw error;
    }
  }

  async getActiveDeployments(namespace?: string): Promise<any[]> {
    try {
      const response = namespace 
        ? await this.k8sApi.listNamespacedDeployment(namespace)
        : await this.k8sApi.listDeploymentForAllNamespaces();

      return response.body.items
        .filter(deployment => deployment.metadata?.labels?.['managed-by'] === 'agentic-devops')
        .map(deployment => ({
          deployment_id: `${deployment.metadata?.namespace}/${deployment.metadata?.name}`,
          name: deployment.metadata?.name,
          namespace: deployment.metadata?.namespace,
          replicas: deployment.spec?.replicas,
          ready_replicas: deployment.status?.readyReplicas || 0,
          image: deployment.spec?.template?.spec?.containers?.[0]?.image,
          created_at: deployment.metadata?.creationTimestamp
        }));
    } catch (error) {
      logger.error('Failed to get active deployments', { namespace, error });
      throw error;
    }
  }
}

export const kubernetesService = new KubernetesService();