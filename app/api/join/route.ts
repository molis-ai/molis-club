import { getDb } from '../../../db';
import { saveApplication } from '../../../lib/community-api.mjs';
export const POST = (request: Request) => saveApplication(request, getDb());
