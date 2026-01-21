export const formatTime = (date) => {
  if (!date) return null;

  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');

  return `${h}:${m}:${s}`;
};

export const safeTime = (time) => {
  if (typeof time !== 'string') return null;

  const m = time.match(/^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/);
  if (!m) return null;

  const h = m[1];
  const min = m[2];
  const s = m[3] ?? '00';

  return `${h}:${min}:${s}`;
};
