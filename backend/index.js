import dotenv from "dotenv";
dotenv.config();

import dns from "node:dns";
import connectDB from "./Src/config/db.js";
import app from "./app.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Vendora backend running on port ${PORT}`);
});