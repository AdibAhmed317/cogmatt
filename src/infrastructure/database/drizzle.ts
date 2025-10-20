import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Use DATABASE_URL from environment
const connectionString = process.env.DATABASE_URL!;

// Create a postgres client
export const client = postgres(connectionString, { ssl: 'require' });

// Create the Drizzle ORM instance
export const db = drizzle(client);
