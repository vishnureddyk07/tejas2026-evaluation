import app from "./app.js";
import config from "./config/index.js";
import { initDb } from "./db/index.js";

const startServer = async () => {
  console.log("DEBUG: Startup - ADMIN_USERS env:", process.env.ADMIN_USERS);
  console.log("DEBUG: Startup - config.adminUsers:", config.adminUsers);
  await initDb();
  app.listen(config.port, () => {
    console.log(`TEJUS 2026 server running on port ${config.port}`);
  });
};

startServer();
