import { and, eq, SQL, sql } from 'drizzle-orm';
import { db } from '../db/index.js';
import { NewTicket, Ticket, tickets, users } from '../db/schema.js';

export class TicketService {
  static find(criteria: Partial<Ticket> = {}) {
    const filters: SQL[] = [];

    if (criteria.id) {
      filters.push(eq(tickets.id, criteria.id));
    }

    if (criteria.status) {
      filters.push(eq(tickets.status, criteria.status));
    }

    return db
      .select({
        id: tickets.id,
        name: tickets.name,
        status: tickets.status,
        description: tickets.description,
        assignedUserId: tickets.assignedUserId,
        createdAt: tickets.createdAt,
        updatedAt: tickets.updatedAt,
        username: users.username,
      })
      .from(tickets)
      .innerJoin(users, eq(tickets.assignedUserId, users.id))
      .where(and(...filters));
  }

  static async findById(id: number) {
    const [ticket] = await this.find({ id });

    return ticket;
  }

  static async create(newTicket: NewTicket) {
    const [ticket] = await db.insert(tickets).values(newTicket).returning();

    return ticket;
  }

  static async update(id: number, updateWith: Partial<Ticket>) {
    const [ticket] = await db
      .update(tickets)
      .set({
        ...updateWith,
        updatedAt: sql`NOW()`,
      })
      .where(eq(tickets.id, id))
      .returning();

    return ticket;
  }

  static async destroy(id: number) {
    const [ticket] = await db
      .delete(tickets)
      .where(eq(tickets.id, id))
      .returning();

    return ticket;
  }
}
