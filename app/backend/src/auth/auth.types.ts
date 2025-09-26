export type JwtPayload = { sub: string; role?: string; iat?: number; exp?: number; jti?: string };
export type Tokens = { accessToken: string; refreshToken: string; expiresIn: number };
