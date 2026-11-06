import { DatabaseSync } from 'node:sqlite';
import { readFileSync, realpathSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  inventoryBusinessIdentities,
  applyBusinessIdentityDecision,
} from '../lib/account/business-migration.mjs';

const [operation, filename, manifest, ...extra] = process.argv.slice(2);
if (
  !['inventory', 'apply-reviewed'].includes(operation) ||
  !filename ||
  extra.length ||
  (operation === 'inventory' ? manifest : !manifest)
)
  throw Error(
    'Usage: node scripts/business-identities.mjs inventory <SQLite copy> | apply-reviewed <SQLite copy> <reviewed-decision.json>',
  );
// Existing offline database only. This command has no remote D1 or provider credentials.
const path = realpathSync(resolve(filename));
if (path.includes('/.wrangler/') || path.includes('/.dev.vars'))
  throw Error('Use an explicit offline database copy');
const db = new DatabaseSync(path, { readOnly: operation === 'inventory' });
try {
  db.exec('PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000');
  const result =
    operation === 'inventory'
      ? inventoryBusinessIdentities(db)
      : applyBusinessIdentityDecision(
          db,
          JSON.parse(readFileSync(manifest, 'utf8')),
        );
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
} finally {
  db.close();
}
