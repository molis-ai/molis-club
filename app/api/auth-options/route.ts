import { authOptions } from '../../../lib/auth';
export const GET = () =>
  Response.json(authOptions(), { headers: { 'Cache-Control': 'no-store' } });
