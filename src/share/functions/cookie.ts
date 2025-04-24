export const cookie = (
  req: any,
  name: 'accessToken' | 'refreshToken',
): string => {
  const value: string = `; ${req.headers['cookie']}`;
  const parts: string[] = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';')[0] ?? '';
  }
  return '';
};
