import { spawnSync } from 'node:child_process';

process.env.GITHUB_PAGES = 'true';
process.env.NEXT_PUBLIC_SITE_URL = 'https://kararico.github.io/portflio2026';

const result = spawnSync('npx', ['next', 'build'], {
  stdio: 'inherit',
  shell: true,
  env: process.env,
});

process.exit(result.status ?? 1);
