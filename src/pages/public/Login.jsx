import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { User, Building2, Stethoscope, UserX } from "lucide-react";
import Logo from "../../components/common/Logo";
import ThemeToggle from "../../components/common/ThemeToggle";
import { Button, Field, Input, Select } from "../../components/ui";
import { useApp } from "../../lib/store";
import { HOSPITALS } from "../../lib/directory";
import { cn } from "../../lib/utils";

export const ROLES = [["patient", User, "User / Patient", "Individual public access"], ["authority", Building2, "Authority", "Hospital, lab, pharmacy or clinic"], ["worker", Stethoscope, "Worker / Incharge", "Doctor, technician or staff"], ["guest", UserX, "Guest", "Skip sign-in"]];

export default function Login() {
  const { login, toast } = useApp(); const nav = useNavigate(); const loc = useLocation();
  const [role, setRole] = useState("patient"); const [email, setEmail] = useState(""); const [password, setPw] = useState(""); const [facilityId, setFid] = useState(HOSPITALS[0].id);
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  const needsFac = role === "authority" || role === "worker";
  const submit = async (e) => {
    e.preventDefault(); setErr("");
    if (role !== "guest" && (!/^\S+@\S+\.\S+$/.test(email) || password.length < 6)) return setErr("Enter a valid email and a password of at least 6 characters.");
    setBusy(true);
    try { await login({ role, email, password, facilityId: needsFac ? facilityId : null }); nav(loc.state?.from || "/app", { replace: true }); toast("Signed in", "ok"); }
    catch (x) { setErr(x.response?.data?.error || "Sign in failed. Check your details and try again."); }
    finally { setBusy(false); }
  };
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="keep-light hidden flex-col justify-between bg-black p-10 text-white lg:flex"><Logo light />
        <div><h2 className="max-w-md text-4xl font-semibold leading-tight">One grid for every patient, doctor and facility in Chennai.</h2><p className="mt-4 max-w-md text-zinc-400">Role-based access keeps patient data private and every action auditable.</p></div>
        <div className="mono !text-zinc-500">HTTPS · JWT · RBAC</div></div>
      <div className="relative flex items-center justify-center p-6"><div className="absolute right-4 top-4"><ThemeToggle /></div><form onSubmit={submit} className="w-full max-w-md space-y-4">
        <div className="lg:hidden"><Logo /></div>
        <h1 className="text-2xl font-semibold">Access Portal</h1>
        <div className="grid grid-cols-2 gap-2">{ROLES.map(([id, I, t, s]) => (
          <button type="button" key={id} onClick={() => setRole(id)} className={cn("border p-3 text-left", role === id ? "border-black bg-zinc-100 outline outline-1 outline-black" : "border-zinc-300 hover:border-black")}><I size={18} /><div className="mt-1 text-sm font-semibold">{t}</div><div className="text-xs text-zinc-600">{s}</div></button>))}</div>
        {needsFac && <Field label={role === "worker" ? "Parent authority" : "Organisation"}><Select value={facilityId} onChange={(e) => setFid(e.target.value)}>{HOSPITALS.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}</Select></Field>}
        {role !== "guest" && (<><Field label="Email"><Input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
          <Field label="Password"><Input type="password" autoComplete="current-password" value={password} onChange={(e) => setPw(e.target.value)} /></Field></>)}
        {err && <p role="alert" className="text-sm text-red-600">{err}</p>}
        <Button type="submit" className="w-full py-2.5" disabled={busy}>{busy ? "Signing in…" : role === "guest" ? "Continue as guest" : "Log in"}</Button>
        <p className="text-center text-sm text-zinc-600">New here? <Link className="font-medium text-black underline" to="/signup">Create an account</Link></p>
        <p className="text-center text-xs text-zinc-500">Demo mode accepts any valid email and password.</p>
      </form></div>
    </div>
  );
}
