export function listNotes(
  request: Request,
  db: D1Database,
  slugs: string[],
): Promise<Response>;
export function saveNote(
  request: Request,
  db: D1Database,
  slugs: string[],
  user?: { id: string; name: string } | null,
): Promise<Response>;
export function listDesignVotes(
  request: Request,
  db: D1Database,
  choices: readonly string[],
): Promise<Response>;
export function saveDesignVote(
  request: Request,
  db: D1Database,
  choices: readonly string[],
): Promise<Response>;
export function saveApplication(
  request: Request,
  db: D1Database,
): Promise<Response>;
