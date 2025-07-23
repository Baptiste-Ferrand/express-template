import jwt, { SignOptions } from 'jsonwebtoken';

export function signJwt(payload: Record<string, unknown>): string {
  const secret: string = process.env.JWT_SECRET || 'change_me';
  const expiresIn: SignOptions['expiresIn'] =
    (process.env.JWT_EXPIRES_IN as SignOptions['expiresIn']) || '1h';

  return jwt.sign(payload, secret, { expiresIn });
}

export function verifyJwt<T = object>(token: string): T {
  const secret: string = process.env.JWT_SECRET || 'change_me';
  return jwt.verify(token, secret) as T;
}
