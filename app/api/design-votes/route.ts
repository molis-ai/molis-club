import { getDb } from '../../../db';
import { directionSlugs } from '../../demos/brand/_review/directions';
import {
  listDesignVotes,
  saveDesignVote,
} from '../../../lib/community-api.mjs';
export const GET = (request: Request) =>
  listDesignVotes(request, getDb(), directionSlugs);
export const POST = (request: Request) =>
  saveDesignVote(request, getDb(), directionSlugs);
