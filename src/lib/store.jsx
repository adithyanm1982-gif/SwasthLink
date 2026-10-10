import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { call } from "./api";
import { uid, iso } from "./utils";
import { dict } from "./i18n";
import { FAC } from "./directory";

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

export function usePersisted(key, init) {
  const [v, setV] = useState(() => { try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init; } catch { return init; } });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} }, [key, v]);
  return [v, setV];
}

const SEED = [
  { id: "APT-1001", doctorId: "D002", doctorName: "Dr. Karthikeyan Subramanian", field: "Cardiology", facility: "Fortis Malar Hospital", date: iso(1), time: "10:30", mode: "Video", patientName: "Arjun Venkatesh", status: "Booked", fee: 700, reason: "Palpitations for 3 days" },
  { id: "APT-1002", doctorId: "D001", doctorName: "Dr. Lakshmi Narayanan", field: "Dermatology", facility: "Apollo Hospitals", date: iso(-6), time: "16:00", mode: "In-person", patientName: "Arjun Venkatesh", status: "Completed", fee: 500, reason: "Skin rash follow-up" },
];

// Demo auth used only when the backend is unreachable.
const demoAuth = (p) => ({
  token: "demo." + uid("T"),
  user: { id: uid("U"), name: p.role === "guest" ? "Guest" : p.name || (p.email || "user").split("@")[0].replace(/[._]/g, " "), email: p.email || "", role: p.role, facilityId: p.facilityId || null },
});

export function AppProvider({ children }) {
  const [user, setUser] = usePersisted("swl-user", null);
  const [lang, setLang] = usePersisted("swl-lang", "en");
  const [theme, setTheme] = usePersisted("swl-theme", typeof matchMedia !== "undefined" && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  useEffect(() => { document.documentElement.classList.toggle("dark", theme === "dark"); }, [theme]);
  const toggleTheme = () => {
    const el = document.documentElement; el.classList.add("theme-anim"); setTimeout(() => el.classList.remove("theme-anim"), 300);
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  };
  const [appts, setAppts] = usePersisted("swl-appts", SEED);
  const [alerts, setAlerts] = usePersisted("swl-alerts", []);
  const [records, setRecords] = usePersisted("swl-records", []);
  const [orders, setOrders] = usePersisted("swl-orders", []);
  const [notifs, setNotifs] = usePersisted("swl-notifs", [{ id: "n1", text: "Welcome to Swasthlink. Your Health ID is ready.", t: Date.now(), read: false }]);
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((text, tone = "neutral") => {
    const id = uid("t"); setToasts((x) => [...x, { id, text, tone }]);
    setTimeout(() => setToasts((x) => x.filter((t) => t.id !== id)), 3500);
  }, []);
  const notify = (text) => setNotifs((x) => [{ id: uid("n"), text, t: Date.now(), read: false }, ...x].slice(0, 30));
  const t = (k) => dict[lang]?.[k] ?? dict.en[k] ?? k;

  const finish = (r) => { try { localStorage.setItem("swl-token", r.token); } catch {} const u = { ...r.user, facility: FAC[r.user.facilityId]?.name || null }; setUser(u); return u; };
  const login = async (p) => finish(await call((a) => a.post("/auth/login", p), () => demoAuth(p)));
  const signup = async (p) => finish(await call((a) => a.post("/auth/signup", p), () => demoAuth(p)));
  const logout = () => { try { localStorage.removeItem("swl-token"); } catch {} setUser(null); };

  const value = {
    user, setUser, lang, setLang, theme, toggleTheme, t, toast, toasts, notify, notifs, markRead: () => setNotifs((x) => x.map((n) => ({ ...n, read: true }))),
    login, signup, logout,
    appts, addAppt: (a) => { const x = { id: uid("APT"), status: "Booked", ...a }; setAppts((l) => [x, ...l]); notify(`Appointment booked with ${a.doctorName} on ${a.date} at ${a.time}.`); return x; },
    updateAppt: (id, p) => setAppts((l) => l.map((a) => (a.id === id ? { ...a, ...p } : a))),
    alerts, addAlert: (a) => setAlerts((l) => [a, ...l]), updateAlert: (id, p) => setAlerts((l) => l.map((a) => (a.id === id ? { ...a, ...p } : a))),
    records, addRecord: (r) => { setRecords((l) => [{ id: uid("REC"), date: iso(), ...r }, ...l]); }, delRecord: (id) => setRecords((l) => l.filter((r) => r.id !== id)),
    orders, addOrder: (o) => { const x = { id: uid("ORD"), date: iso(), status: "Confirmed", ...o }; setOrders((l) => [x, ...l]); notify(`${o.type} order ${x.id} confirmed.`); return x; },
    reset: () => { setAppts(SEED); setAlerts([]); setRecords([]); setOrders([]); },
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
