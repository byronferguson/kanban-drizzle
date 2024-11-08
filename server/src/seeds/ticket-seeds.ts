import { sql } from 'drizzle-orm';

import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { tickets, users } from '../db/schema.js';

const seeds = [
  {
    name: 'Design landing page',
    status: 'In Progress',
    description: 'Create wireframes and mockups for the landing page.',
  },
  {
    name: 'Set up project repository',
    status: 'Done',
    description:
      'Create a new repository on GitHub and initialize it with a README file.',
  },
  {
    name: 'Implement authentication',
    status: 'Todo',
    description: 'Set up user authentication using JWT tokens.',
  },
  {
    name: 'Test the API',
    status: 'Todo',
    description: 'Test the API using Insomnia.',
  },
  {
    name: 'Deploy to production',
    status: 'Todo',
    description: 'Deploy the application to Render.',
  },
];

export async function seedTickets(db: NodePgDatabase) {
  const [{ ids }] = await db
    .select({
      ids: sql<number[]>`ARRAY_AGG(users.id)`,
    })
    .from(users);

  await db.execute(sql`TRUNCATE TABLE tickets RESTART IDENTITY CASCADE`);
  await db.insert(tickets).values(
    seeds.map((seed) => ({
      ...seed,
      assignedUserId: randomElement(ids),
    })),
  );
}

function randomElement<T = unknown>(items: Array<T>) {
  return items[Math.floor(Math.random() * items.length)];
}
