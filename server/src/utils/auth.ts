import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

type JwtPayload = {
  username: string;
};

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY ?? '';

export async function hashPassword(password: string) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(
  providedPassword: string,
  hashedPassword: string,
) {
  return bcrypt.compare(providedPassword, hashedPassword);
}

export function signToken(username: string) {
  return jwt.sign({ username }, JWT_SECRET_KEY, { expiresIn: '1h' });
}

export function verifyToken(token: string): Promise<JwtPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET_KEY, (err, payload) => {
      if (err) {
        return reject(new Error('Forbidden'));
      }

      resolve(payload as JwtPayload);
    });
  });
}
