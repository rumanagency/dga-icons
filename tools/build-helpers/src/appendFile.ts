import { appendFile as fsAppendFile } from 'fs/promises';

export async function appendFile(filePath: string, content: string): Promise<void> {
  await fsAppendFile(filePath, content, 'utf-8');
}
