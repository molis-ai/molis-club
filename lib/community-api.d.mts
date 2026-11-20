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
  beforeSave?: () => Promise<void>,
): Promise<Response>;
export function saveApplication(
  request: Request,
  db: D1Database,
  observe?: (outcome: 'created' | 'duplicate' | 'invalid' | 'write_failed') => void,
): Promise<Response>;
