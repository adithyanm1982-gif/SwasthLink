import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../components/common/Logo";
import ThemeToggle from "../../components/common/ThemeToggle";
import { Button, Field, Input, Select } from "../../components/ui";
import { useApp } from "../../lib/store";
import { Tabs } from "../../components/ui";

const score = (p) => [/.{8,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter((r) => r.test(p)).length;

export default function Signup() {
  const { signup, toast } = useApp(); const nav = useNavigate();
  const [role, setRole] = useState("patient"); const [f, setF] = useState({ name: "", email: "", phone: "", password: "", type: "Hospital" });
  const [agree, setAgree] = useState(false); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value }); const s = score(f.password);
  const submit = async (e) => {
    e.preventDefault(); setErr("");
    if (!f.name.trim()) return setErr("Enter your name.");
    if (!/^\S+@\S+\.\S+$/.test(f.email)) return setErr("Enter a valid email.");
    if (f.phone.replace(/\D/g, "").length < 10) return setErr("Enter a 10-digit phone number.");
    if (s < 3) return setErr("Use a stronger password: 8+ characters with capitals, numbers or symbols.");
    if (!agree) return setErr("Accept the terms to continue.");
    setBusy(true);
    try { await signup({ ...f, role }); toast("Account created", "ok"); nav("/app", { replace: true }); }
    catch (x) { setErr(x.response?.data?.error || "Sign up failed. Try again."); } finally { setBusy(false); }
  };
  return (
    <div className="relative flex min-h-screen items-center justify-center p-6"><div className="absolute right-4 top-4"><ThemeToggle /></div><form onSubmit={submit} className="w-full max-w-md space-y-4">
      <Logo /><h1 className="text-2xl font-semibold">Create your account</h1>
      <Tabs value={role} onChange={setRole} tabs={[["patient", "Patient"], ["authority", "Medical authority"]]} />
      <Field label={role === "authority" ? "Organisation name" : "Full name"}><Input value={f.name} onChange={set("name")} /></Field>
      {role === "authority" && <Field label="Facility type"><Select value={f.type} onChange={set("type")}>{["Hospital", "Pharmacy", "Diagnostic Lab", "Surgical Center", "Clinic"].map((t) => <option key={t}>{t}</option>)}</Select></Field>}
      <div className="grid gap-3 sm:grid-cols-2"><Field label="Email"><Input type="email" value={f.email} onChange={set("email")} /></Field><Field label="Phone"><Input inputMode="tel" value={f.phone} onChange={set("phone")} /></Field></div>
      <Field label="Password"><Input type="password" autoComplete="new-password" value={f.password} onChange={set("password")} /></Field>
      <div className="flex gap-1" aria-label="Password strength">{[0, 1, 2, 3].map((i) => <div key={i} className={"h-1 flex-1 " + (i < s ? "bg-black" : "bg-zinc-200")} />)}</div>
      <label className="flex items-start gap-2 text-sm"><input type="checkbox" className="mt-1 h-4 w-4 accent-black" checked={agree} onChange={(e) => setAgree(e.target.checked)} /> I agree to the terms and the privacy policy.</label>
      {err && <p role="alert" className="text-sm text-red-600">{err}</p>}
      <Button type="submit" className="w-full py-2.5" disabled={busy}>{busy ? "Creating…" : "Create account"}</Button>
      <p className="text-center text-sm text-zinc-600">Already registered? <Link className="font-medium text-black underline" to="/login">Log in</Link></p>
    </form></div>
  );
}
