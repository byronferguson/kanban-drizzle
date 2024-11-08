import { db } from '../db/index.js';
import { seedTickets } from './ticket-seeds.js';
import { seedUsers } from './user-seeds.js';

async function seedAll() {
  try {
    console.log('\n----- DATABASE SYNCED -----\n');

    await seedUsers(db);
    console.log('\n----- USERS SEEDED -----\n');

    await seedTickets(db);
    console.log('\n----- TICKETS SEEDED -----\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

await seedAll();
