import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import {
  foreignKey,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial().primaryKey().notNull(),
  username: varchar({ length: 255 }).notNull(),
  password: varchar({ length: 255 }).notNull(),
  createdAt: timestamp({ withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp({ withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
});

export type UserWithPassword = typeof users.$inferSelect;
export type User = UserWithPassword | Omit<UserWithPassword, 'password'>;
export type NewUser = typeof users.$inferInsert;
export type UserUpdate = Partial<Omit<UserWithPassword, 'id' | 'createdAt'>>;

export const tickets = pgTable(
  'tickets',
  {
    id: serial().primaryKey().notNull(),
    name: varchar({ length: 255 }).notNull(),
    status: varchar({ length: 255 }).notNull(),
    description: varchar({ length: 255 }).notNull(),
    assignedUserId: integer(),
    createdAt: timestamp({ withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp({ withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      ticketsAssignedUserIdFkey: foreignKey({
        columns: [table.assignedUserId],
        foreignColumns: [users.id],
        name: 'tickets_assigned_user_id_fkey',
      })
        .onUpdate('cascade')
        .onDelete('set null'),
    };
  },
);

export type Ticket = InferSelectModel<typeof tickets>;
export type NewTicket = InferInsertModel<typeof tickets>;
export type TicketUpdate = Partial<
  Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>
>;
