import { readdir } from 'fs/promises';
import { join } from 'path';

export async function getSvgFiles(dirPath: string): Promise<string[]> {
  const files = await readdir(dirPath);
  return files
    .filter((file) => file.endsWith('.svg'))
    .map((file) => join(dirPath, file));
}
