// Turns an inline CSS string into a React style object, e.g. st('display:flex; gap:8px').
export function st(css) {
  const out = {};
  css.split(';').forEach((part) => {
    const i = part.indexOf(':');
    if (i < 0) return;
    const key = part.slice(0, i).trim();
    const val = part.slice(i + 1).trim();
    if (!key) return;
    out[key.startsWith('--') ? key : key.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = val;
  });
  return out;
}
export const fullName = (c) => c.firstName + ' ' + c.lastName;
export const initials = (c) => (c.firstName[0] + c.lastName[0]).toUpperCase();
export const onActivate = (fn) => (e) => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(e); }
};
