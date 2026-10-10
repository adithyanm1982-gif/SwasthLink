import { useState } from "react";
import { Link } from "react-router-dom";
import { Video, Siren, FlaskConical, Pill, FileText, Bot, Stethoscope, ChevronDown, Quote, UserPlus, Search, CalendarCheck, HeartPulse } from "lucide-react";
import { Card } from "../ui";
import { SPECIALTIES, HOSPITALS, DOCTORS, FACILITIES } from "../../lib/directory";
import DoctorCard from "../features/DoctorCard";

export const QuickActions = () => {
  const items = [[Video, "Video consult", "Talk to a doctor now", "/doctors"], [Siren, "Emergency", "Triage and ambulance", "/emergency"], [Bot, "AI assistant", "Symptom guidance", "/app/assistant"], [FlaskConical, "Lab tests", "Home sample pickup", "/app/labs"], [Pill, "Pharmacy", "Order medicines", "/app/pharmacy"], [FileText, "Reports", "Analyze lab values", "/app/reports"]];
  return (
    <section className="mx-auto -mt-8 max-w-7xl px-4"><div className="grid gap-px border border-black bg-black sm:grid-cols-3 lg:grid-cols-6">
      {items.map(([I, t, s, to]) => (<Link key={t} to={to} className="bg-white p-4 hover:bg-zinc-100"><I size={22} /><div className="mt-3 font-semibold">{t}</div><div className="text-xs text-zinc-600">{s}</div></Link>))}
    </div></section>
  );
};

const Count = ({ to }) => <span>{to}+</span>;
export const Stats = () => {
  const n = (k) => FACILITIES.filter((f) => f.kind === k).length;
  const rows = [[HOSPITALS.length, "Hospitals"], [DOCTORS.length, "Specialist doctors"], [n("Diagnostic Lab") + n("Blood Bank"), "Labs & blood banks"], [n("Polyclinic") + n("Dialysis Center") + n("Scan Center"), "Clinics & centres"]];
  return (
    <section className="mx-auto max-w-7xl px-4 py-16"><div className="grid gap-px border border-black bg-black sm:grid-cols-2 lg:grid-cols-4">
      {rows.map(([v, l]) => (<div key={l} className="bg-white p-6"><div className="text-5xl font-semibold tracking-tight"><Count to={v} /></div><div className="mono mt-2">{l}</div></div>))}
    </div></section>
  );
};

export const Specialties = () => (
  <section className="mx-auto max-w-7xl px-4 py-8">
    <h2 className="text-2xl font-semibold tracking-tight">Consult by specialty</h2><p className="mt-1 text-sm text-zinc-600">{SPECIALTIES.length} specialties across the network.</p>
    <div className="mt-6 grid grid-cols-2 gap-px border border-black bg-black sm:grid-cols-3 lg:grid-cols-6">
      {SPECIALTIES.slice(0, 18).map((s) => (<Link key={s} to={`/doctors?field=${encodeURIComponent(s)}`} className="press flex items-center gap-2 bg-white p-4 text-sm hover:bg-zinc-100"><Stethoscope size={16} />{s}</Link>))}
    </div>
    <Link to="/doctors" className="mt-4 inline-block text-sm underline">View all specialties</Link>
  </section>
);

export const TopDoctors = () => (
  <section className="mx-auto max-w-7xl px-4 py-12">
    <div className="flex items-end justify-between"><h2 className="text-2xl font-semibold tracking-tight">Top rated doctors</h2><Link to="/doctors" className="text-sm underline">See all</Link></div>
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[...DOCTORS].sort((a, b) => b.rating - a.rating).slice(0, 6).map((d) => <DoctorCard key={d.id} d={d} />)}</div>
  </section>
);

export const HowItWorks = () => (
  <section className="border-y border-black bg-zinc-50 py-16"><div className="mx-auto max-w-7xl px-4">
    <h2 className="text-2xl font-semibold tracking-tight">How Swasthlink works</h2>
    <div className="mt-8 grid gap-6 md:grid-cols-4">
      {[[UserPlus, "Sign up", "Create a free account or continue as guest."], [Search, "Find care", "Search doctors, labs and hospitals near you."], [CalendarCheck, "Consult", "Book a slot and join a secure video room."], [HeartPulse, "Follow up", "Keep reports, prescriptions and orders together."]].map(([I, t, d], i) => (
        <div key={t}><div className="mono">0{i + 1}</div><I className="my-3" size={24} /><b>{t}</b><p className="mt-1 text-sm text-zinc-600">{d}</p></div>))}
    </div></div></section>
);

export const Network = () => (
  <section className="mx-auto max-w-7xl px-4 py-16">
    <h2 className="text-2xl font-semibold tracking-tight">Our Chennai network</h2>
    <div className="mt-6 grid gap-px border border-black bg-black sm:grid-cols-2 lg:grid-cols-4">{HOSPITALS.slice(0, 8).map((h) => (
      <Link key={h.id} to="/facilities" className="bg-white p-4 hover:bg-zinc-100"><b className="text-sm leading-tight">{h.name}</b><div className="mono mt-2">{h.area} · {h.beds} beds</div></Link>))}</div>
  </section>
);

export const Testimonials = () => (
  <section className="mx-auto max-w-7xl px-4 pb-16">
    <h2 className="text-2xl font-semibold tracking-tight">Patient stories <span className="mono">sample content</span></h2>
    <div className="mt-6 grid gap-4 md:grid-cols-3">
      {[["Booked a cardiologist from home and was on video within the hour.", "R. Meena, Adyar"], ["The triage page found an ICU bed and an ambulance in seconds.", "S. Karthik, Velachery"], ["Uploading my blood report and seeing flagged values saved a trip.", "L. Janani, Anna Nagar"]].map(([q, n]) => (
        <Card key={n} className="p-5"><Quote size={18} /><p className="mt-3 text-sm">{q}</p><div className="mono mt-4">{n}</div></Card>))}
    </div>
  </section>
);

export function Faq() {
  const [open, setOpen] = useState(0);
  const items = [["Is Swasthlink free?", "Browsing, the AI assistant and triage are free. Consultation fees are set by each doctor."], ["Is my data secure?", "Traffic runs over HTTPS, sessions use short-lived JWTs and every page is protected by role-based access."], ["Can I use it without an account?", "Yes. Guest access lets you try the assistant, triage, pharmacy and lab booking."], ["What if I have an emergency?", "Call 108 immediately or open Emergency Triage to dispatch an ambulance."]];
  return (
    <section className="mx-auto max-w-3xl px-4 pb-16"><h2 className="mb-4 text-2xl font-semibold tracking-tight">Frequently asked</h2>
      {items.map(([q, a], i) => (<div key={q} className="border-b border-zinc-300"><button className="flex w-full items-center justify-between py-4 text-left font-medium" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>{q}<ChevronDown size={18} className={open === i ? "rotate-180" : ""} /></button>{open === i && <p className="pb-4 text-sm text-zinc-600">{a}</p>}</div>))}
    </section>
  );
}
