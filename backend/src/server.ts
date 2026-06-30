import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 8001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "tuneboss-admin-api" });
});

app.listen(port, () => {
  console.log(`Admin backend is running on http://localhost:${port}`);
});
