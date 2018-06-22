/* 获取GitHub源代码 */

import storage from './storage';

export interface GitHubApiResult {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  content?: string;
  encoding?: string;
}

class Github {
  moduleName: string;
  sourcePath: string;
  requestPath: string;
  constructor(moduleName: string) {
    this.moduleName = moduleName;
    this.sourcePath = `example/${moduleName}/canvas`;
    this.requestPath = `https://api.github.com/repos/snayan/canvas-demo/contents`;
  }
  private fetch(path: string) {
    return fetch(`${this.requestPath}/${path}`, { credentials: 'omit', method: 'get', mode: 'cors' });
  }
  public async getCanvasFiles() {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(JSON.stringify({ status: '400', statusText: 'forbidden', url: "development env don't request code" }));
    }
    let files: GitHubApiResult[];
    let contents: GitHubApiResult[] = [];
    let content: GitHubApiResult[] = storage.get(this.moduleName);
    if (content && content.length) {
      return content;
    }

    let res = await this.fetch(this.sourcePath);
    if (!res.ok) {
      throw new Error(
        JSON.stringify({
          status: res.status,
          statusText: res.statusText,
          body: await res.text(),
          url: res.url,
        }),
      );
    }
    files = await res.json();
    for (let file of files) {
      if (file.type === 'file') {
        res = await this.fetch(file.path);
        res.ok && contents.push(await res.json());
      }
    }
    storage.set(this.moduleName, contents);
    return contents;
  }
}

export default Github;
