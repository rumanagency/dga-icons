import { fileURLToPath } from 'url';
import { dirname } from 'path';

export function getCurrentDirPath(importMetaUrl: string): string {
  const __filename = fileURLToPath(importMetaUrl);
  return dirname(__filename);
}
