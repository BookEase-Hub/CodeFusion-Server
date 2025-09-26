import { Router } from 'express';
import Joi from 'joi';
import { Project } from './models/Project.js';
import { GitHubService } from './services/github.service.js';
import { VercelService } from './services/vercel.service.js';
import { TerminalService } from './services/terminal.service.js';
import { requireAuth } from './middleware/auth.js';

const router = Router();

// Health check for the new backend
router.get('/ping', (req, res) => {
  res.status(200).json({ status: 'ok', source: 'v2' });
});

// All routes in this router will be protected
router.use(requireAuth);

// GitHub Routes
router.post('/github/push', async (req, res, next) => {
  try {
    const schema = Joi.object({
      token: Joi.string().required(),
      owner: Joi.string().required(),
      repo: Joi.string().required(),
      branch: Joi.string().default('main'),
      files: Joi.array().items(
        Joi.object({
          path: Joi.string().required(),
          content: Joi.string().required(),
          mode: Joi.string().default('100644'), // blob
        })
      ).required(),
      commitMessage: Joi.string().default('Update via CodeFusion'),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { token, owner, repo, branch, files, commitMessage } = value as {
      token: string;
      owner: string;
      repo: string;
      branch: string;
      files: { path: string; content: string; mode: string }[];
      commitMessage: string;
    };

    const latestCommit = await GitHubService.getLatestCommit(token, owner, repo, branch);
    const baseTreeSha = latestCommit.commit.tree.sha;
    const newTree = await GitHubService.createTree(token, owner, repo, baseTreeSha, files);
    const newCommit = await GitHubService.createCommit(token, owner, repo, commitMessage, newTree.sha, latestCommit.sha);
    await GitHubService.updateReference(token, owner, repo, `heads/${branch}`, newCommit.sha);

    res.status(200).json({ success: true, message: 'Pushed successfully', commit: newCommit.sha });
  } catch (err) {
    next(err);
  }
});

// Vercel Deployment Routes
router.post('/vercel/deploy', async (req, res, next) => {
  try {
    const schema = Joi.object({
      vercelToken: Joi.string().required(),
      teamId: Joi.string().optional(),
      projectName: Joi.string().required(),
      files: Joi.object().pattern(/.*/, Joi.string()).required(), // path -> content
      framework: Joi.string().valid('nextjs', 'react', 'node', 'static').default('nextjs'),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { vercelToken, teamId, projectName, files, framework } = value as {
      vercelToken: string;
      teamId?: string;
      projectName: string;
      files: { [key: string]: string };
      framework: string;
    };

    let project = await VercelService.getProject(vercelToken, projectName, teamId);
    if (!project) {
      project = await VercelService.createProject(vercelToken, projectName, teamId, framework);
    }

    const deploymentFiles = Object.entries(files).map(([path, content]) => ({
      file: path,
      data: Buffer.from(content).toString('base64'),
    }));

    const deployment = await VercelService.deployProject(vercelToken, project.id, deploymentFiles, teamId);

    res.status(200).json({ success: true, deploymentUrl: `https://${deployment.url}`, deploymentId: deployment.id });
  } catch (err) {
    next(err);
  }
});

// Terminal Execution (Simulated + Secure Real Execution)
router.post('/terminal/execute', async (req, res, next) => {
  try {
    const schema = Joi.object({
      command: Joi.string().required(),
      cwd: Joi.string().default('/app'),
      env: Joi.object().optional(),
      projectId: Joi.string().required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { command, cwd, env, projectId } = value as {
      command: string;
      cwd: string;
      env?: any;
      projectId: string;
    };

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const result = await TerminalService.executeCommand(command, cwd, env, project);

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

export { router };