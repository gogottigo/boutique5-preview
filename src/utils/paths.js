const baseUrl = import.meta.env.BASE_URL || '/';
const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
const basePath = normalizedBase === '/' ? '' : normalizedBase.slice(0, -1);

/** Prefixes a local route or public asset once, leaving external and hash URLs untouched. */
export function withBase(path = '/') {
  const value = String(path || '/');
  if (/^(?:[a-z]+:)?\/\//i.test(value) || value.startsWith('#') || value.startsWith('data:')) return value;
  if (basePath && (value === basePath || value.startsWith(`${basePath}/`))) return value;
  const relative = value.replace(/^\/+/, '');
  return relative ? `${normalizedBase}${relative}` : normalizedBase;
}

/** Converts a browser pathname back into the route keys used by the React app. */
export function withoutBase(path = '/') {
  if (!basePath) return path || '/';
  if (path === basePath || path === `${basePath}/`) return '/';
  return path.startsWith(`${basePath}/`) ? path.slice(basePath.length) : path || '/';
}
