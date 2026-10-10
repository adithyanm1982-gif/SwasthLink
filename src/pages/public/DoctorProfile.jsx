import { useMemo, useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { Star, MapPin, ShieldCheck, Video, Building2 } from "lucide-react";
import { DOCTORS } from "../../lib/directory";
import { useApp } from "../../lib/store";
import { Button, Card, Badge, Empty, Field, Textarea, Input } from "../../components/ui";
import { iso, dayLabel, timeSlots, hash, initials, inr, cn } from "../../lib/utils";

export default function DoctorProfile() {
  const { id } = useParams(); const d = DOCTORS.find((x) => x.id === id);
  const { user, appts, addAppt, toast } = useApp(); const nav = useNavigate(); const loc = useLocation();
  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => iso(i)), []);
  const [date, setDate] = useState(days[0]); const [time, setTime] = useState(""); const [mode, setMode] = useState("Video"); const [reason, setReason] = useState("");
  const [name, setName] = useState(user && user.role !== "guest" ? user.name : "");
  if (!d) return <div className="mx-auto max-w-xl p-10"><Empty title="Doctor not found" action={<Link to="/doctors" className="mt-2 underline">Back to doctors</Link>} /></div>;
  const taken = (s) => hash(d.id + date + s) % 4 === 0 || appts.some((a) => a.doctorId === d.id && a.date === date && a.time === s && a.status === "Booked");
  const book = () => {
    if (!user) return nav("/login", { state: { from: loc.pathname } });
    if (!time) return toast("Choose a time slot", "alert");
    if (!name.trim()) return toast("Enter the patient name", "alert");
    addAppt({ doctorId: d.id, doctorName: d.name, field: d.field, facility: d.facility, date, time, mode, patientName: name, fee: d.fee, reason: reason || "General consultation" });
    toast("Appointment booked", "ok"); nav(user.role === "patient" ? "/app/appointments" : "/app");
  };
  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[1.2fr_1fr]">
      <div>
        <div className="flex gap-4"><div className="grid h-24 w-24 shrink-0 place-items-center bg-black text-3xl font-semibold text-white">{initials(d.name)}</div>
          <div><h1 className="text-3xl font-semibold tracking-tight">{d.name}</h1><p className="text-zinc-600">{d.field} · {d.exp} years experience</p>
            <div className="mt-2 flex flex-wrap items-center gap-2"><span className="flex items-center gap-1 text-sm"><Star size={14} fill="currentColor" /> {d.rating}</span><Badge tone={d.status === "On-Duty" ? "ok" : "neutral"}>{d.status}</Badge><Badge>Lic. {d.license}</Badge></div></div></div>
        <Card className="mt-6 divide-y divide-zinc-200">
          <div className="flex items-center gap-3 p-4 text-sm"><MapPin size={16} /> {d.facility}, {d.area}, Chennai</div>
          <div className="flex items-center gap-3 p-4 text-sm"><ShieldCheck size={16} /> Verified by Tamil Nadu Medical Council (demo data)</div>
          <div className="p-4 text-sm"><div className="mono mb-1">Languages</div>{d.langs.join(", ")}</div>
          <div className="p-4 text-sm"><div className="mono mb-1">About</div>{d.name} is a {d.field.toLowerCase()} specialist at {d.facility} with {d.exp} years of clinical practice, consulting in person and on video.</div>
        </Card>
      </div>
      <Card className="h-fit space-y-4 border-black p-5 lg:sticky lg:top-20">
        <div className="flex items-end justify-between"><b className="text-lg">Book appointment</b><span className="text-xl font-semibold">{inr(d.fee)}</span></div>
        <div className="grid grid-cols-2 border border-black">{[["Video", Video], ["In-person", Building2]].map(([m, I]) => (
          <button key={m} onClick={() => setMode(m)} className={cn("flex items-center justify-center gap-2 py-2 text-sm", mode === m ? "bg-black text-white" : "hover:bg-zinc-100")}><I size={14} />{m}</button>))}</div>
        <div><div className="label">Date</div><div className="flex gap-1 overflow-x-auto pb-1">{days.map((x) => (
          <button key={x} onClick={() => { setDate(x); setTime(""); }} className={cn("shrink-0 border px-3 py-2 text-xs", date === x ? "border-black bg-black text-white" : "border-zinc-300 hover:border-black")}>{dayLabel(x)}</button>))}</div></div>
        <div><div className="label">Time</div><div className="grid grid-cols-4 gap-1">{timeSlots().map((s) => (
          <button key={s} disabled={taken(s)} onClick={() => setTime(s)} className={cn("border py-1.5 text-xs", time === s ? "border-black bg-black text-white" : "border-zinc-300 hover:border-black", taken(s) && "cursor-not-allowed text-zinc-300 line-through hover:border-zinc-300")}>{s}</button>))}</div></div>
        <Field label="Patient name"><Input value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label="Reason for visit"><Textarea rows={2} value={reason} onChange={(e) => setReason(e.target.value)} /></Field>
        <Button className="w-full" onClick={book}>{user ? "Confirm booking" : "Log in to book"}</Button>
      </Card>
    </div>
  );
}
