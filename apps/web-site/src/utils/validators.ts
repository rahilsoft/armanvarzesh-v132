export function validateEmail(email: string): boolean {
  const re = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return re.test(email);
}

export function validatePassword(password: string): boolean {
  return password.length >= 8;
}