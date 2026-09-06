export function listNotes(
  request: Request,
  db: D1Database,
  slugs: string[],
): Promise<Response>;
export function saveNote(
  request: Request,
  db: D1Database,
  slugs: string[],
): Promise<Response>;
export function saveApplication(
  request: Request,
  db: D1Database,
): Promise<Response>;
