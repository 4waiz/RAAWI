// Checks every heritage source URL in the knowledge base. Run before the pitch: `pnpm check:links`.
import { SOURCES } from '../packages/core/src/knowledge/sources.ts';

let failed = 0;
for (const s of Object.values(SOURCES)) {
  try {
    const r = await fetch(s.url, { method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(15000), headers: { 'user-agent': 'NAZAR-link-check' } });
    console.log(`${r.ok ? '✓' : '✗'} ${r.status} ${s.url}`);
    if (!r.ok) failed++;
  } catch (e) {
    console.log(`✗ ERR ${s.url} (${e.message})`);
    failed++;
  }
}
process.exit(failed ? 1 : 0);
