import { useMemo, useState } from "react";
import { Siren, AlertTriangle, Navigation, Phone, Ambulance, Check } from "lucide-react";
import { Button, Card, Field, Input, Select, Badge } from "../ui";
import { useApp } from "../../lib/store";
import { AREAS, HOSPITALS, TRANSPORTS } from "../../lib/directory";
import { uid } from "../../lib/utils";
import { cn } from "../../lib/utils";

const LEVELS = [
  { id: 1, name: "Level 1 · Resuscitation", desc: "Not breathing, no pulse, unresponsive, severe bleeding.", eta: "Immediate" },
  { id: 2, name: "Level 2 · Emergent", desc: "Chest pain, stroke signs, serious injury, breathing difficulty.", eta: "< 15 min" },
  { id: 3, name: "Level 3 · Urgent", desc: "High fever, deep cuts, persistent vomiting, moderate pain.", eta: "< 60 min" },
];
const FLAGS = [["Not breathing or unresponsive", 1], ["Severe bleeding", 1], ["Chest pain or pressure", 2], ["Stroke signs (face droop, slurred speech)", 2], ["Difficulty breathing", 2], ["Seizure", 2], ["High fever for over 3 days", 3], ["Persistent vomiting", 3], ["Deep cut or suspected fracture", 3]];
const STEPS = ["Dispatched", "En route", "Arrived"];

export default function TriagePanel() {
  const { user, alerts, addAlert, updateAlert, toast } = useApp();
  const [checked, setChecked] = useState([]); const [lvl, setLvl] = useState(null);
  const [area, setArea] = useState("Anna Nagar"); const [name, setName] = useState(user?.name && user.role !== "guest" ? user.name : "");
  const [phone, setPhone] = useState(""); const [coords, setCoords] = useState(""); const [trackId, setTrackId] = useState(null);

  const suggested = checked.length ? Math.min(...checked.map((i) => FLAGS[i][1])) : null;
  const level = lvl ?? suggested;
  const hospital = useMemo(() => {
    const pool = HOSPITALS.filter((h) => h.icu > 0);
    return pool.filter((h) => h.area === area).sort((a, b) => b.icu - a.icu)[0] || pool.sort((a, b) => b.icu - a.icu)[0];
  }, [area]);
  const vehicle = useMemo(() => {
    const av = TRANSPORTS.filter((t) => t.status === "Available");
    const want = level === 1 ? ["Advanced Life Support Ambulance", "Mobile ICU"] : null;
    return (av.find((t) => t.area === area && (!want || want.includes(t.type))) || av.find((t) => t.area === area) || av[0]);
  }, [area, level]);
  const tracked = alerts.find((a) => a.id === trackId);
  const toggle = (i) => setChecked((c) => (c.includes(i) ? c.filter((x) => x !== i) : [...c, i]));
  const locate = () => navigator.geolocation ? navigator.geolocation.getCurrentPosition((p) => { setCoords(`${p.coords.latitude.toFixed(4)}, ${p.coords.longitude.toFixed(4)}`); toast("Location captured", "ok"); }, () => toast("Location permission denied", "alert")) : toast("Location is not supported", "alert");

  const dispatch = () => {
    if (!level) return toast("Select an urgency level first", "alert");
    if (phone.replace(/\D/g, "").length < 10) return toast("Enter a valid contact number", "alert");
    const a = { id: uid("SWL"), lvl: level, area, patient: name || "Unknown patient", phone, coords, facility: hospital?.name, vehicle: vehicle?.vehicleNo, provider: vehicle?.provider, t: new Date().toLocaleTimeString("en-IN"), ack: false, status: STEPS[0] };
    addAlert(a); setTrackId(a.id); toast("Triage alert dispatched", "ok");
    setTimeout(() => updateAlert(a.id, { status: STEPS[1] }), 6000);
    setTimeout(() => updateAlert(a.id, { status: STEPS[2] }), 18000);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <Card className="p-4">
          <div className="mono mb-2">1 · What is happening?</div>
          <div className="grid gap-1.5">{FLAGS.map(([l], i) => (
            <label key={l} className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" checked={checked.includes(i)} onChange={() => toggle(i)} className="h-4 w-4 accent-black" />{l}</label>))}</div>
        </Card>
        <div>
          <div className="mono mb-2">2 · Urgency level {suggested && lvl === null && <Badge tone="dark">Suggested L{suggested}</Badge>}</div>
          {LEVELS.map((l) => (
            <button key={l.id} onClick={() => setLvl(l.id)} className={cn("mb-2 block w-full border p-3 text-left", level === l.id ? (l.id === 1 ? "border-red-600 bg-red-600 text-white" : "border-black bg-black text-white") : "border-black hover:bg-zinc-100")}>
              <b>{l.name}</b><div className="text-sm opacity-80">{l.desc}</div><div className="mono mt-1 !text-inherit">Target {l.eta}</div></button>))}
        </div>
      </div>
      <div className="space-y-4">
        <Card className="space-y-3 p-4">
          <div className="mono">3 · Where and who?</div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Patient name"><Input value={name} onChange={(e) => setName(e.target.value)} /></Field>
            <Field label="Contact number"><Input inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit mobile" /></Field>
          </div>
          <Field label="Area in Chennai"><Select value={area} onChange={(e) => setArea(e.target.value)}>{AREAS.map((a) => <option key={a}>{a}</option>)}</Select></Field>
          <div className="flex items-center gap-2"><Button v="outline" onClick={locate}><Navigation size={14} /> Use my location</Button>{coords && <span className="mono">{coords}</span>}</div>
          <div className="border border-zinc-300 p-3 text-sm"><div className="mono mb-1">Auto-assigned</div>
            <div>Hospital: <b>{hospital?.name}</b> ({hospital?.icu} ICU beds)</div>
            <div className="flex items-center gap-1"><Ambulance size={14} /> {vehicle ? `${vehicle.provider} · ${vehicle.type} · ${vehicle.vehicleNo}` : "No vehicle free, call 108"}</div></div>
          <Button v="danger" className="w-full py-3" disabled={!level} onClick={dispatch}><Siren size={18} /> Dispatch triage alert</Button>
          <a href="tel:108" className="flex items-center justify-center gap-2 border border-red-600 py-2 text-sm text-red-600"><Phone size={14} /> Call 108 directly</a>
        </Card>
        {tracked && (
          <Card className="border-red-600 p-4">
            <b className="flex items-center gap-2 text-red-600"><AlertTriangle size={18} /> Alert {tracked.id} · Level {tracked.lvl}</b>
            <p className="mt-1 text-sm">{tracked.facility} has been notified. {tracked.vehicle ? `Vehicle ${tracked.vehicle} assigned.` : ""}</p>
            <ol className="mt-3 flex">{STEPS.map((s, i) => { const done = STEPS.indexOf(tracked.status) >= i; return (
              <li key={s} className="flex-1 text-center"><div className={cn("mx-auto grid h-7 w-7 place-items-center rounded-full border", done ? "border-red-600 bg-red-600 text-white" : "border-zinc-300")}>{done ? <Check size={14} /> : i + 1}</div><div className="mono mt-1">{s}</div></li>); })}</ol>
          </Card>
        )}
      </div>
    </div>
  );
}
