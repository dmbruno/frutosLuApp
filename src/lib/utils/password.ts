const PASSWORD_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';

export function generatePassword(length = 8): string {
  return Array.from({ length }, () => PASSWORD_CHARS[Math.floor(Math.random() * PASSWORD_CHARS.length)]).join('');
}
