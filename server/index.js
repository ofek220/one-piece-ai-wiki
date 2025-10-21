import express from "express";
import cors from "cors";
import generateRoute from "./routes/generate.js";
import { initDB } from "./config/initDB.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/generate", generateRoute);

(async () => {
  try {
    await initDB();
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ Could not initialize DB:", err);
    process.exit(1);
  }
})();
