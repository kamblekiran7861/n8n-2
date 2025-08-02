import { Octokit } from '@octokit/rest';
import { logger } from '../utils/logger.js';

class GitHubService {
  private octokit: Octokit;

  constructor() {
    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });
  }

  async getPullRequestDiff(owner: string, repo: string, pullNumber: number): Promise<string> {
    try {
      const { data } = await this.octokit.pulls.get({
        owner,
        repo,
        pull_number: pullNumber,
        mediaType: {
          format: 'diff'
        }
      });

      return data as unknown as string;
    } catch (error) {
      logger.error('Failed to fetch PR diff', { owner, repo, pullNumber, error });
      throw error;
    }
  }

  async getRepositoryContent(owner: string, repo: string, path: string, ref?: string): Promise<string> {
    try {
      const { data } = await this.octokit.repos.getContent({
        owner,
        repo,
        path,
        ref
      });

      if ('content' in data && data.content) {
        return Buffer.from(data.content, 'base64').toString('utf-8');
      }

      throw new Error('File content not found');
    } catch (error) {
      logger.error('Failed to fetch repository content', { owner, repo, path, ref, error });
      throw error;
    }
  }

  async createPullRequestComment(
    owner: string, 
    repo: string, 
    pullNumber: number, 
    body: string
  ): Promise<void> {
    try {
      await this.octokit.issues.createComment({
        owner,
        repo,
        issue_number: pullNumber,
        body
      });
    } catch (error) {
      logger.error('Failed to create PR comment', { owner, repo, pullNumber, error });
      throw error;
    }
  }

  async createCommitStatus(
    owner: string,
    repo: string,
    sha: string,
    state: 'pending' | 'success' | 'error' | 'failure',
    description: string,
    context: string
  ): Promise<void> {
    try {
      await this.octokit.repos.createCommitStatus({
        owner,
        repo,
        sha,
        state,
        description,
        context
      });
    } catch (error) {
      logger.error('Failed to create commit status', { owner, repo, sha, state, context, error });
      throw error;
    }
  }
}

export const githubService = new GitHubService();