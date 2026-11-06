// Fails if anything that looks like a credential ends up in a directory (e.g. the built site).
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.argv[2] ?? '.';
const PATTERNS = [
  [/AIza[0-9A-Za-z_\-]{35}/, 'Google API key'],
  [/sk-(proj-)?[A-Za-z0-9_\-]{20,}/, 'OpenAI key'],
  [/ghp_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{40,}/, 'GitHub token'],
  [/-----BEGIN (RSA |EC )?PRIVATE KEY-----/, 'Private key'],
  [/CLOUDFLARE_API_TOKEN\s*[=:]\s*['"]?[A-Za-z0-9_\-]{30,}/, 'Cloudflare token'],
];
const SKIP = new Set(['node_modules', '.git', '.wrangler', 'playwright-report', 'test-results']);
let hits = 0;
function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p);
    else if (st.size < 5_000_000 && !/\.(png|jpe?g|webp|woff2?|ttf|ico)$/i.test(name)) {
      const text = readFileSync(p, 'utf8');
      for (const [re, label] of PATTERNS) if (re.test(text)) { console.error(`✗ ${label} pattern in ${p}`); hits++; }
    }
  }
}
walk(root);
if (hits) process.exit(1);
console.log(`✓ no secret patterns found in ${root}`);
