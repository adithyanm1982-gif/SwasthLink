import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search, ShieldCheck } from "lucide-react";
import { Button } from "../../components/ui";
import { useApp } from "../../lib/store";
import { QuickActions, Stats, Specialties, TopDoctors, HowItWorks, Network, Testimonials, Faq } from "../../components/home/Sections";

export default function Home() {
  const { t } = useApp(); const nav = useNavigate(); const [q, setQ] = useState("");
  const go = (e) => { e.preventDefault(); nav(`/doctors?q=${encodeURIComponent(q)}`); };
  return (
    <>
      <section className="grid-bg border-b border-black">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-20 pt-16 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <span className="mono flex items-center gap-2"><ShieldCheck size={14} /> Unified AI Triage & Tele-care Grid</span>
            <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">{t("hero_title")}</h1>
            <p className="mt-5 max-w-xl text-lg text-zinc-600">{t("hero_sub")}</p>
            <form onSubmit={go} className="mt-8 flex max-w-xl border border-black bg-white shadow-[4px_4px_0_0_rgb(var(--c-black))]" role="search">
              <Search className="m-3 shrink-0" size={18} />
              <input aria-label="Search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("search_ph")} className="min-w-0 flex-1 py-3 text-sm outline-none" />
              <button type="submit" className="press bg-black px-5 text-sm text-white hover:bg-zinc-800">{t("find")}</button>
            </form>
            <div className="mt-4 flex flex-wrap gap-2 text-sm">{["Cardiology", "Dermatology", "Pediatrics", "Orthopedics"].map((s) => <Link key={s} to={`/doctors?field=${s}`} className="border border-zinc-300 px-2 py-1 hover:bg-zinc-100">{s}</Link>)}</div>
          </div>
          <div className="border border-black bg-white p-6 shadow-[6px_6px_0_0_rgb(var(--c-black))]">
            <div className="mono">Live network status</div>
            {[["Ambulances available", "14 / 20"], ["ICU beds open", "312"], ["Doctors on duty", "34"], ["Avg. triage time", "42 sec"]].map(([l, v]) => (
              <div key={l} className="flex items-center justify-between border-b border-zinc-200 py-3 last:border-0"><span className="text-sm">{l}</span><span className="font-mono text-lg">{v}</span></div>))}
            <Link to="/emergency"><Button v="danger" className="mt-4 w-full">Start emergency triage</Button></Link>
          </div>
        </div>
      </section>
      <QuickActions /><Stats /><Specialties /><TopDoctors /><HowItWorks /><Network /><Testimonials /><Faq />
    </>
  );
}
