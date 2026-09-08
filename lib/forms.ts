export function formText(data: FormData, field: string): string {
  const value = data.get(field);
  return typeof value === 'string' ? value : '';
}
