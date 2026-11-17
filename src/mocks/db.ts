import { customers } from "./data/customers";
import { users } from "./data/users";

interface AccessSession {
  userId: string;
  expiresAt: number;
}

function createDb() {
  return {
    users: structuredClone(users),
    customers: structuredClone(customers),
    accessTokens: new Map<string, AccessSession>(),
    refreshTokens: new Map<string, string>(),
  };
}

type Db = ReturnType<typeof createDb>;

// Kept on globalThis so edits that reload this module in dev don't sign
// everyone out. It still resets when the server restarts.
const store = globalThis as typeof globalThis & { __mockDb?: Db };
store.__mockDb ??= createDb();
export const db: Db = store.__mockDb;

export function resetDb() {
  Object.assign(db, createDb());
}
