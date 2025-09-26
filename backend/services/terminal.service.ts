import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { IProjectDocument } from '../models/Project.js';

const execAsync = promisify(exec);

// Whitelist of safe commands (expand as needed)
const SAFE_COMMANDS = ['ls', 'pwd', 'cat', 'echo', 'mkdir', 'touch', 'rm', 'cp', 'mv'];

export class TerminalService {
  static async executeCommand(command: string, cwd: string, env: any, project: IProjectDocument) {
    const cmd = command.trim().split(' ')[0];
    if (!SAFE_COMMANDS.includes(cmd)) {
      return {
        success: false,
        output: `Command not allowed: ${cmd}`,
        executionTime: 0,
      };
    }

    // Ensure cwd is within project sandbox
    const projectPath = `/tmp/codefusion/${project._id.toString()}`;
    const safeCwd = path.resolve(projectPath, cwd);
    if (!safeCwd.startsWith(projectPath)) {
      throw new Error('Invalid working directory');
    }

    // Create project dir if not exists
    await fs.promises.mkdir(safeCwd, { recursive: true });

    // Write project files to disk (for real execution)
    await this.writeProjectFiles(project, projectPath);

    const startTime = Date.now();
    try {
      const { stdout, stderr } = await execAsync(command, {
        cwd: safeCwd,
        env: { ...process.env, ...env },
        timeout: 10000, // 10s timeout
      });
      const executionTime = Date.now() - startTime;
      return {
        success: true,
        output: stdout || stderr,
        executionTime,
      };
    } catch (error: any) {
      const executionTime = Date.now() - startTime;
      return {
        success: false,
        output: error.message || 'Command failed',
        executionTime,
      };
    }
  }

  private static async writeProjectFiles(project: IProjectDocument, projectPath: string) {
    for (const [filePath, content] of project.files.entries()) {
      const fullPath = path.resolve(projectPath, filePath);
      const dir = path.dirname(fullPath);
      await fs.promises.mkdir(dir, { recursive: true });
      await fs.promises.writeFile(fullPath, content);
    }
  }
}