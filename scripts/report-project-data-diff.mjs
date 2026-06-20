import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function parseStringArray(raw) {
  if (!raw) return [];
  return raw.split(',').map((s) => s.trim().replace(/^'|'$/g, '')).filter(Boolean);
}

function extractFromProjects(source) {
  const items = [];
  const re =
    /slug:\s*'([^']+)'[\s\S]*?role:\s*'([^']*)'[\s\S]*?overview:\s*\n\s*'((?:\\'|[^'])*)'[\s\S]*?stack:\s*\[([^\]]*)\]/g;
  for (const match of source.matchAll(re)) {
    items.push({
      slug: match[1],
      role: match[2],
      overview: match[3].replace(/\\'/g, "'"),
      stack: parseStringArray(match[4]),
    });
  }
  return items;
}

function extractFromDetails(source) {
  const items = [];
  const re =
    /'([^']+)':\s*\{[\s\S]*?overview:\s*\n\s*'((?:\\'|[^'])*)'[\s\S]*?role:\s*'([^']*)'[\s\S]*?techStack:\s*\[([^\]]*)\]/g;
  for (const match of source.matchAll(re)) {
    items.push({
      slug: match[1],
      overview: match[2].replace(/\\'/g, "'"),
      role: match[3],
      stack: parseStringArray(match[4]),
    });
  }
  return items;
}

const projectsSource = fs.readFileSync(path.join(root, 'src/data/projects.ts'), 'utf8');
const detailsSource = fs.readFileSync(path.join(root, 'src/data/projectDetails.ts'), 'utf8');

const projects = extractFromProjects(projectsSource);
const details = Object.fromEntries(extractFromDetails(detailsSource).map((d) => [d.slug, d]));

const report = { overview: [], role: [], stack: [] };

for (const p of projects) {
  const d = details[p.slug];
  if (!d) {
    report.role.push({ slug: p.slug, error: 'projectDetails 누락' });
    continue;
  }

  if (p.overview !== d.overview) {
    report.overview.push({
      slug: p.slug,
      projects: p.overview,
      projectDetails: d.overview,
    });
  }

  if (p.role !== d.role) {
    report.role.push({
      slug: p.slug,
      projects: p.role,
      projectDetails: d.role,
    });
  }

  const pStack = p.stack.join(', ');
  const dStack = d.stack.join(', ');
  if (pStack !== dStack) {
    report.stack.push({
      slug: p.slug,
      projects: p.stack,
      projectDetails: d.stack,
    });
  }
}

console.log(JSON.stringify(report, null, 2));
