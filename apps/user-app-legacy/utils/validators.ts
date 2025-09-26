
export function isEmail(email: string) {
  return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
}
export function isPasswordStrong(password: string) {
  return password.length >= 8 && /\d/.test(password) && /[A-Za-z]/.test(password);
}
