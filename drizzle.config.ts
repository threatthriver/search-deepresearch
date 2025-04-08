// This is a placeholder file for the removed database functionality
// We're now using browser localStorage for storing chat history

// Mock defineConfig function
const defineConfig = (config: any) => config;

export default defineConfig({
  // These settings are not used since we've removed the database
  dialect: 'none',
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: 'none',
  },
});
