import { getDb } from '../../../db';
import { works } from '../../../content/works';
import { listNotes, saveNote } from '../../../lib/community-api.mjs';
import { getAuth } from '../../../lib/auth';
const slugs = works.map((w) => w.slug);
export const GET = (request: Request) => listNotes(request, getDb(), slugs);
export async function POST(request: Request) {
  try {
    const session = await getAuth().api.getSession({
      headers: request.headers,
    });
    return saveNote(request, getDb(), slugs, session?.user);
  } catch {
    return Response.json(
      { error: '账号服务暂时不可用，请稍后重试。' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
