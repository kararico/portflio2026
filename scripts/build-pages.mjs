import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

process.env.GITHUB_PAGES = 'true';
process.env.NEXT_PUBLIC_BASE_PATH = '/portflio2026';
process.env.NEXT_PUBLIC_SITE_URL = 'https://kararico.github.io/portflio2026';

const result = spawnSync('npx', ['next', 'build'], {
  stdio: 'inherit',
  shell: true,
  env: process.env,
});

if ((result.status ?? 1) === 0) {
  writeFileSync(join(process.cwd(), 'out', '.nojekyll'), '');
}

process.exit(result.status ?? 1);
