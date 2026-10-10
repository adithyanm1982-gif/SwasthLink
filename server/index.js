import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import multer from "multer";
import { readFileSync } from "fs";
import { v2 as cloudinary } from "cloudinary";
import OpenAI from "openai";

const data = JSON.parse(readFileSync(new URL("./data/dataset.json", import.meta.url)));
const SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const app = express();
app.use(helmet());                                   // security headers incl. HSTS when served over HTTPS
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));
app.use(rateLimit({ windowMs: 60_000, max: 120 }));

// In-memory user store. Replace with PostgreSQL (pg / Prisma) or MongoDB (mongoose).
const users = new Map();
const sign = (u) => jwt.sign({ sub: u.id, role: u.role, facilityId: u.facilityId || null }, SECRET, { expiresIn: "8h" });
const pub = (u) => ({ id: u.id, name: u.name, email: u.email, role: u.role, facilityId: u.facilityId || null });

// JWT + role-based access control middleware.
const auth = (roles = []) => (req, res, next) => {
  try {
    req.user = jwt.verify((req.headers.authorization || "").replace("Bearer ", ""), SECRET);
    if (roles.length && !roles.includes(req.user.role)) return res.status(403).json({ error: "Forbidden for your role" });
    next();
  } catch { res.status(401).json({ error: "Please sign in again" }); }
};

app.get("/api/health", (_q, r) => r.json({ ok: true }));
app.get("/api/doctors", (_q, r) => r.json(data.doctors.map(({ pw, ...d }) => d)));
app.get("/api/facilities", (_q, r) => r.json([...data.hospitals_and_facilities, ...data.labs_clinics_bloodbanks].map(({ pw, ...f }) => f)));
app.get("/api/transports", (_q, r) => r.json(data.medical_transports));

app.post("/api/auth/signup", async (req, res) => {
  const { name, email, password, role } = req.body || {};
  if (!name || !/^\S+@\S+\.\S+$/.test(email || "") || (password || "").length < 8) return res.status(400).json({ error: "Name, valid email and 8+ character password are required" });
  if (!["patient", "authority"].includes(role)) return res.status(400).json({ error: "Role must be patient or authority" });
  if (users.has(email)) return res.status(409).json({ error: "Email already registered" });
  const u = { id: "U" + Date.now(), name, email, role, hash: await bcrypt.hash(password, 10) };
  users.set(email, u);
  res.status(201).json({ token: sign(u), user: pub(u) });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password, role, facilityId } = req.body || {};
  if (role === "guest") { const u = { id: "G" + Date.now(), name: "Guest", email: "", role: "guest" }; return res.json({ token: sign(u), user: pub(u) }); }
  const u = users.get(email);
  if (!u || !(await bcrypt.compare(password || "", u.hash)) || u.role !== role) return res.status(401).json({ error: "Invalid email, password or role" });
  const withFac = { ...u, facilityId: facilityId || u.facilityId };
  res.json({ token: sign(withFac), user: pub(withFac) });
});

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
app.post("/api/uploads", auth(), upload.single("file"), (req, res) => {
  if (!process.env.CLOUDINARY_URL) return res.status(501).json({ error: "Storage not configured" });
  cloudinary.uploader.upload_stream({ folder: "swasthlink", resource_type: "auto" }, (err, r) => err ? res.status(502).json({ error: "Upload failed" }) : res.json({ url: r.secure_url, name: req.file.originalname, size: req.file.size }))
    .end(req.file.buffer);
});

const ai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
const SYSTEM = "You are Swasthlink's health guidance assistant for Chennai. Give brief, safe, general guidance, never a diagnosis. For red-flag symptoms tell the user to call 108. Suggest one relevant medical specialty when useful.";
app.post("/api/ai/chat", auth(), async (req, res) => {
  if (!ai) return res.status(501).json({ error: "AI not configured" });
  try {
    const r = await ai.chat.completions.create({ model: process.env.OPENAI_MODEL || "gpt-4o-mini", messages: [{ role: "system", content: SYSTEM }, ...(req.body.messages || []).slice(-12)] });
    const text = r.choices[0].message.content;
    res.json({ text, urgent: /\b108\b/.test(text) });
  } catch { res.status(502).json({ error: "AI service unavailable" }); }
});
app.post("/api/ai/analyze", auth(), (_q, res) => res.status(501).json({ error: "Connect OCR and an LLM here" }));

app.listen(process.env.PORT || 5000, () => console.log("Swasthlink API on :" + (process.env.PORT || 5000)));
