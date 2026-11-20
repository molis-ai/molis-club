import { waitUntil } from 'cloudflare:workers';
import { getDb } from '../../../db';
import { saveApplication } from '../../../lib/community-api.mjs';
import { recordContact } from '../../../lib/club-metrics.mjs';

export function POST(request: Request) {
  const startedAt = Date.now();
  const db = getDb();
  return saveApplication(request, db, (outcome: string) => {
    waitUntil(recordContact(db, request, startedAt, outcome));
  });
}
