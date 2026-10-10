import axios from "axios";
import { localReply } from "./assistant";
import { analyzeText } from "./analyzer";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "/api", timeout: 3000 });
api.interceptors.request.use((c) => {
  try { const t = localStorage.getItem("swl-token"); if (t) c.headers.Authorization = "Bearer " + t; } catch {}
  return c;
});

// If the backend is unreachable we remember that for 30 seconds and answer from demo data instantly,
// so login, signup and every other action respond with no waiting.
let downUntil = 0;
const markDown = () => { downUntil = Date.now() + 30000; };
fetch((import.meta.env.VITE_API_URL || "/api") + "/health", { signal: AbortSignal.timeout(1200) }).then((r) => { if (!r.ok) markDown(); }).catch(markDown);

// 4xx errors (bad credentials, forbidden) are re-thrown so the real backend stays authoritative.
export async function call(fn, fallback) {
  const fb = (e) => (typeof fallback === "function" ? fallback(e) : fallback);
  if (Date.now() < downUntil) return fb();
  try { return (await fn(api)).data; } catch (e) {
    const s = e.response?.status;
    if (!e.response || s === 404 || s >= 500) { if (!e.response || (s >= 500 && s !== 501)) markDown(); return fb(e); }
    throw e;
  }
}
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export const askAI = (messages) => call((a) => a.post("/ai/chat", { messages }), async () => { await wait(600); return localReply(messages.filter((m) => m.role === "user").pop()?.content || ""); });
export const analyzeReport = (payload) => call((a) => a.post("/ai/analyze", payload), async () => { await wait(900); return analyzeText(payload.text || ""); });
export const uploadFile = (file) => {
  const fd = new FormData(); fd.append("file", file);
  return call((a) => a.post("/uploads", fd), () => ({ url: URL.createObjectURL(file), name: file.name, size: file.size, type: file.type, local: true }));
};
export default api;
