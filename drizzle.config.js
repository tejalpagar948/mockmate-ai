import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

export default defineConfig({
  dialect: 'postgresql',
  schema: './utils/schema.js',
  dbCredentials: {
    url: process.env.DRIZZLE_DB_URL,
  },
});
