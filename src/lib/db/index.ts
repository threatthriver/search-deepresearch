// This is a placeholder file for the removed database functionality
// We're now using browser localStorage for storing chat history

// Mock db object with no-op methods
const db = {
  query: {
    chats: {
      findFirst: async () => null,
    },
    messages: {
      findFirst: async () => null,
    },
  },
  insert: () => ({
    values: () => ({
      execute: async () => {},
    }),
  }),
  delete: () => ({
    where: () => ({
      execute: async () => {},
    }),
  }),
};

export default db;
