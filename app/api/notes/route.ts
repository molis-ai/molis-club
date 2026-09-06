import { getDb } from '../../../db';
import { works } from '../../../content/works';
import { listNotes, saveNote } from '../../../lib/community-api.mjs';
const slugs = works.map((w) => w.slug);
export const GET = (request: Request) => listNotes(request, getDb(), slugs);
export const POST = (request: Request) => saveNote(request, getDb(), slugs);
