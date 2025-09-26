import axios from 'axios';
import FormData from 'form-data';

const VERCEL_API = 'https://api.vercel.com';

export interface IVercelProject {
  id: string;
  name: string;
}

export class VercelService {
  static async getProject(token: string, name: string, teamId?: string): Promise<IVercelProject | null> {
    const url = teamId
      ? `${VERCEL_API}/v9/projects?teamId=${teamId}&name=${name}`
      : `${VERCEL_API}/v9/projects?name=${name}`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.projects[0] || null;
  }

  static async createProject(token: string, name: string, teamId?: string, framework = 'nextjs'): Promise<IVercelProject> {
    const body: any = {
      name,
      framework,
      devCommand: framework === 'nextjs' ? 'npm run dev' : null,
      buildCommand: framework === 'nextjs' ? 'npm run build' : null,
      outputDirectory: framework === 'nextjs' ? '.next' : null,
      rootDirectory: null,
    };

    const url = teamId ? `${VERCEL_API}/v9/projects?teamId=${teamId}` : `${VERCEL_API}/v9/projects`;
    const response = await axios.post(url, body, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  static async deployProject(token: string, projectId: string, files: any[], teamId?: string): Promise<any> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('file', Buffer.from(file.data, 'base64'), file.file);
    });

    const url = teamId
      ? `${VERCEL_API}/v13/deployments?teamId=${teamId}&projectId=${projectId}`
      : `${VERCEL_API}/v13/deployments?projectId=${projectId}`;

    const response = await axios.post(url, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        ...formData.getHeaders(),
      },
    });
    return response.data;
  }
}