import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

try {
  const envFile = await readFile(resolve(process.cwd(), '.env'), 'utf8');
  for (const line of envFile.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*["']?(.*?)["']?\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
  }
} catch { /* GitHub Actions supplies production configuration through Secrets. */ }

const { VITE_SUPABASE_URL: url, VITE_SUPABASE_ANON_KEY: key } = process.env;
let validUrl = false;
try { validUrl = new URL(url).protocol === 'https:'; } catch { /* Report a single actionable error below. */ }

if (!validUrl || !key) {
  console.error('Missing Supabase configuration: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in GitHub Actions Secrets.');
  process.exit(1);
}
