/**
 * .next 캐시 삭제 (Windows EPERM 대비 재시도)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const nextDir = path.join(path.dirname(path.dirname(fileURLToPath(import.meta.url))), '.next');

for (let attempt = 0; attempt < 3; attempt += 1) {
  try {
    fs.rmSync(nextDir, { recursive: true, force: true });
    console.log('Removed .next cache.');
    process.exit(0);
  } catch (err) {
    if (attempt === 2) {
      console.error('Failed to remove .next:', err.message);
      process.exit(1);
    }
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 500);
  }
}
