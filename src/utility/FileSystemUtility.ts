import * as fs from 'fs';
import * as path from 'path';

export default class FileSystemUtility {
  public static copyFile(sourcePath: string, destinationPath: string) {
    this.makeFolderForFilePath(destinationPath);
    try {
      fs.copyFileSync(sourcePath, destinationPath);
    } catch (e) {
      console.error('Error creating folder', destinationPath, e);
    }
  }

  public static saveFile(destinationPath: string, content: string) {
    this.makeFolderForFilePath(destinationPath);
    try {
      fs.writeFileSync(destinationPath, content);
    } catch (e) {
      console.error('Error creating folder', destinationPath, e);
    }
  }

  private static makeFolderForFilePath(destinationPath: string) {
    try {
      fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
    } catch (e) {
      console.error('Error creating folder', destinationPath, e);
    }
  }
}
