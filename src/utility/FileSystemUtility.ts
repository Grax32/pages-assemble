import * as fs from 'fs';
import * as path from 'path';

export default class FileSystemUtility {
  public static copyFile(sourcePath: string, destinationPath: string) {
    this.makeFolderForFilePath(destinationPath);
    fs.copyFileSync(sourcePath, destinationPath);
  }

  public static saveFile(destinationPath: string, content: string) {
    this.makeFolderForFilePath(destinationPath);
    fs.writeFileSync(destinationPath, content);
  }

  private static makeFolderForFilePath(destinationPath: string) {
    fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
  }
}
