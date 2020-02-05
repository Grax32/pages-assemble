import https from 'https';
import { IncomingMessage } from 'http';

export default class UrlFetchUtility {
  private static promiseGetBody = (result: IncomingMessage): Promise<string> =>
    new Promise((resolve, reject) => {
      result.setEncoding('utf8');
      const output: string[] = [];
      result.on('data', (chunk: string) => output.push(chunk));
      result.on('end', () => resolve(output.join('')));
    });

  private static promiseGet = (url: string): Promise<string> =>
    new Promise((resolve, reject) => {
      try {
        https.get(url, result => UrlFetchUtility.promiseGetBody(result).then(resolve, reject));
      } catch (exception) {
        reject(exception);
      }
    });

  public static async getAll(urls: string[]) {
    const fetchResults = await Promise.all(urls.map(UrlFetchUtility.promiseGet));
    return fetchResults.join('\n');
  }

  public static get(url: string) {
    return UrlFetchUtility.promiseGet(url);
  }
}
