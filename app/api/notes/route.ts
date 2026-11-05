import { getDb } from '../../../db';
import { works } from '../../../content/works';
import { listNotes } from '../../../lib/community-api.mjs';
import { handleAccountRequest } from '../../../lib/account/runtime';
const slugs = works.map((w) => w.slug);
export const GET = (request: Request) => listNotes(request, getDb(), slugs);
export const POST = (request: Request) => handleAccountRequest(request, slugs);
