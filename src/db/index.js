import config from "../config/index.js";
import { createMongoAdapter } from "./mongo.js";
import { createSqlAdapter } from "./sql.js";

let adapter;

const withTimeout = (promise, timeoutMs = 30000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Database connection timeout after ${timeoutMs}ms`)), timeoutMs)
    )
  ]);
};

export const initDb = async () => {
  if (adapter) return adapter;

  console.log(`[DB] Initializing ${config.dbProvider} database...`);
  console.log(`[DB] Using ${config.dbInMemory ? "in-memory" : "remote"} database`);

  try {
    if (config.dbProvider === "mongo") {
      adapter = await withTimeout(
        createMongoAdapter(config.dbUrl, { inMemory: config.dbInMemory }),
        30000
      );
    } else {
      adapter = await withTimeout(
        createSqlAdapter(config.dbUrl, config.dbProvider),
        30000
      );
    }
    console.log("[DB] ✓ Database initialized successfully");
  } catch (error) {
    console.error("[DB] ✗ Database initialization failed:", error.message);
    throw error;
  }

  return adapter;
};

export const getDb = () => {
  if (!adapter) {
    throw new Error("Database not initialized. Call initDb() first.");
  }
  return adapter;
};
