export function getIdFromUrl(url: string, type: 'people' | 'films'): string | null {
  const match = url.match(type === 'people' ? /\/people\/(\d+)\/?$/ : /\/films\/(\d+)\/?$/);
  return match ? match[1] : null;
} 