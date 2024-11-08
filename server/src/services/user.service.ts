import { and, eq, SQL, sql } from 'drizzle-orm';
import { db } from '../db/index.js';
import { NewUser, User, users, UserWithPassword } from '../db/schema.js';
import { hashPassword } from '../utils/auth.js';

export class UserService {
  static find(criteria: Partial<User> = {}, includePassword = false) {
    const filters: SQL[] = [];

    if (criteria.id) {
      filters.push(eq(users.id, criteria.id));
    }

    if (criteria.username) {
      filters.push(eq(users.username, criteria.username));
    }

    return db
      .select({
        id: users.id,
        username: users.username,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        ...(includePassword && { password: users.password }),
      })
      .from(users)
      .where(and(...filters));
  }

  static async findById(id: number) {
    const [user] = await this.find({ id });

    return user;
  }

  static async create(newUser: NewUser) {
    const [user] = await db
      .insert(users)
      .values({
        username: newUser.username,
        password: await hashPassword(newUser.password),
      })
      .returning({
        id: users.id,
        username: users.username,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    return user;
  }

  static async update(id: number, updateWith: Partial<UserWithPassword>) {
    const [user] = await db
      .update(users)
      .set({
        ...updateWith,
        ...(updateWith.password && {
          password: await hashPassword(updateWith.password),
        }),
        updatedAt: sql`NOW()`,
      })
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        username: users.username,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    return user;
  }

  static async destroy(id: number) {
    const [user] = await db.delete(users).where(eq(users.id, id)).returning({
      id: users.id,
      username: users.username,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    });

    return user;
  }
}
