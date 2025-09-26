import axios from 'axios';

const GITHUB_API = 'https://api.github.com';

export class GitHubService {
  static async getLatestCommit(token: string, owner: string, repo: string, branch: string) {
    const response = await axios.get(`${GITHUB_API}/repos/${owner}/${repo}/commits/${branch}`, {
      headers: { Authorization: `token ${token}` },
    });
    return response.data;
  }

  static async createTree(token: string, owner: string, repo: string, baseTreeSha: string, files: any[]) {
    const treeItems = files.map((file) => ({
      path: file.path,
      mode: file.mode,
      type: 'blob',
      content: file.content,
    }));

    const response = await axios.post(
      `${GITHUB_API}/repos/${owner}/${repo}/git/trees`,
      { base_tree: baseTreeSha, tree: treeItems },
      { headers: { Authorization: `token ${token}` } }
    );
    return response.data;
  }

  static async createCommit(
    token: string,
    owner: string,
    repo: string,
    message: string,
    treeSha: string,
    parentSha: string
  ) {
    const response = await axios.post(
      `${GITHUB_API}/repos/${owner}/${repo}/git/commits`,
      { message, tree: treeSha, parents: [parentSha] },
      { headers: { Authorization: `token ${token}` } }
    );
    return response.data;
  }

  static async updateReference(token: string, owner: string, repo: string, ref: string, sha: string) {
    const response = await axios.patch(
      `${GITHUB_API}/repos/${owner}/${repo}/git/refs/${ref}`,
      { sha },
      { headers: { Authorization: `token ${token}` } }
    );
    return response.data;
  }
}