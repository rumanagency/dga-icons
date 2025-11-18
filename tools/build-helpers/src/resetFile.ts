import { writeFile } from 'fs/promises';

export async function resetFile(filePath: string, content: string = ''): Promise<void> {
  await writeFile(filePath, content, 'utf-8');
}
