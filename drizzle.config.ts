import { db_file } from '@/db';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: "./drizzle",
    schema: "./src/db/schema.ts",
    dialect: "sqlite",
    dbCredentials: {
        url: "./" + db_file
    }
});