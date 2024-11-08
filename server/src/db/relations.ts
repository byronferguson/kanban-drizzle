import { relations } from 'drizzle-orm/relations';
import { tickets, users } from './schema.js';

export const ticketsRelations = relations(tickets, ({ one }) => ({
  user: one(users, {
    fields: [tickets.assignedUserId],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  tickets: many(tickets),
}));
