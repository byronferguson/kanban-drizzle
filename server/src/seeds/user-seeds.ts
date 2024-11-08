import { sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { users } from '../db/schema.js';
import { hashPassword } from '../utils/auth.js';

const seeds = [
  { username: 'JollyGuru', password: 'password' },
  { username: 'SunnyScribe', password: 'password' },
  { username: 'RadiantComet', password: 'password' },
  { username: 'byron', password: 'password' },
];

export async function seedUsers(db: NodePgDatabase) {
  const hashedData = await Promise.all(
    seeds.map(async (user) => ({
      ...user,
      password: await hashPassword(user.password),
    })),
  );

  await db.execute(sql`TRUNCATE TABLE users RESTART IDENTITY CASCADE`);
  await db.insert(users).values(hashedData);
}
