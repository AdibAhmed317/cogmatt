import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Use DATABASE_URL from environment with a friendly error if missing
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    'DATABASE_URL is not set. Create a .env file and set DATABASE_URL to your Postgres connection string.'
  );
}

// Force SSL for remote databases; disable for localhost
const needsSSL = !/localhost|127\.0\.0\.1/i.test(connectionString);

// Create a postgres client
export const client = postgres(connectionString, {
  ssl: needsSSL ? 'require' : false,
});

// Create the Drizzle ORM instance
export const db = drizzle(client);
