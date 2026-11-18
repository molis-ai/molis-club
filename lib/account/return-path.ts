function hasControl(value: string, includeSpace = false): boolean {
  return Array.from(value).some(character => {
    const code = character.charCodeAt(0);
    return code < (includeSpace ? 33 : 32) || code === 127;
  });
}

export function internalReturnPath(value: string | null): string | null {
  if (!value || value.length > 4096 || !value.startsWith('/') ||
      value.startsWith('//') || (value.includes('\\') || hasControl(value, true))) return null;
  try {
    const url = new URL(value, 'https://club.invalid');
    const decoded = decodeURIComponent(url.pathname);
    if (url.origin !== 'https://club.invalid' || decoded.startsWith('//') ||
        decoded.includes('\\') || decoded.includes('%') || hasControl(decoded) ||
        /^\/(api(?:\/|$)|login\/?$|account\/callback\/?$)/u.test(decoded)) return null;
    return url.pathname + url.search + url.hash;
  } catch {
    return null;
  }
}
