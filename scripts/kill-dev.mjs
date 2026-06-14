/**
 * Windows: dev 서버 관련 프로세스 정리 (포트 + 프로젝트 node)
 * node scripts/kill-dev.mjs [port]
 */
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const port = process.argv[2] ?? '3030';
const projectDir = path.basename(path.dirname(path.dirname(fileURLToPath(import.meta.url))));
const WIN = process.env.SystemRoot ?? 'C:\\Windows';
const PS = `${WIN}\\System32\\WindowsPowerShell\\v1.0\\powershell.exe`;
const TASKKILL = `${WIN}\\System32\\taskkill.exe`;

function ps(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch (err) {
    if (err.stdout) return String(err.stdout).trim();
    return '';
  }
}

const killed = new Set();

function killPid(pid) {
  const id = String(pid).trim();
  if (!/^\d+$/.test(id) || id === '0' || killed.has(id)) return;

  try {
    execSync(`"${TASKKILL}" /PID ${id} /F /T`, { stdio: 'ignore' });
    killed.add(id);
    console.log(`Killed PID ${id}`);
  } catch {
    /* already gone */
  }
}

const portPids = ps(
  `"${PS}" -NoProfile -Command "(Get-NetTCPConnection -LocalPort ${port} -ErrorAction SilentlyContinue).OwningProcess | Select-Object -Unique"`,
)
  .split(/\r?\n/)
  .flatMap((line) => line.trim().split(/\s+/))
  .filter((id) => /^\d+$/.test(id));

portPids.forEach(killPid);

const projectPids = ps(
  `"${PS}" -NoProfile -Command "Get-CimInstance Win32_Process -Filter \\"Name = 'node.exe'\\" | Where-Object { $_.CommandLine -like '*${projectDir}*' } | Select-Object -ExpandProperty ProcessId"`,
)
  .split(/\r?\n/)
  .flatMap((line) => line.trim().split(/\s+/))
  .filter((id) => /^\d+$/.test(id));

projectPids.forEach(killPid);

if (killed.size === 0) {
  console.log(`Port ${port} is free.`);
} else {
  console.log(`Cleared ${killed.size} process(es) for port ${port}.`);
}
