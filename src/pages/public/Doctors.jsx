import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { DOCTORS, SPECIALTIES, AREAS } from "../../lib/directory";
import DoctorCard from "../../components/features/DoctorCard";
import { Button, Empty, Input, Select, Field } from "../../components/ui";

export default function Doctors() {
  const [sp, setSp] = useSearchParams();
  const q = sp.get("q") || "", field = sp.get("field") || "", area = sp.get("area") || "";
  const [sort, setSort] = useState("rating"); const [duty, setDuty] = useState(false); const [n, setN] = useState(12);
  const set = (k, v) => { const p = new URLSearchParams(sp); v ? p.set(k, v) : p.delete(k); setSp(p, { replace: true }); setN(12); };
  const list = useMemo(() => {
    const s = q.toLowerCase();
    return DOCTORS.filter((d) => (!s || (d.name + d.field + d.facility).toLowerCase().includes(s)) && (!field || d.field === field) && (!area || d.area === area) && (!duty || d.status === "On-Duty"))
      .sort((a, b) => sort === "fee" ? a.fee - b.fee : sort === "exp" ? b.exp - a.exp : b.rating - a.rating);
  }, [q, field, area, sort, duty]);
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Find a doctor</h1>
      <p className="mt-1 text-sm text-zinc-600">{list.length} doctors match your filters.</p>
      <div className="mt-6 grid gap-3 border border-black p-4 sm:grid-cols-2 lg:grid-cols-5">
        <Field label="Search" className="lg:col-span-2"><div className="relative"><Search size={14} className="absolute left-3 top-3" /><Input className="pl-9" value={q} onChange={(e) => set("q", e.target.value)} placeholder="Name, specialty, hospital" /></div></Field>
        <Field label="Specialty"><Select value={field} onChange={(e) => set("field", e.target.value)}><option value="">All</option>{SPECIALTIES.map((s) => <option key={s}>{s}</option>)}</Select></Field>
        <Field label="Area"><Select value={area} onChange={(e) => set("area", e.target.value)}><option value="">All Chennai</option>{AREAS.map((s) => <option key={s}>{s}</option>)}</Select></Field>
        <Field label="Sort by"><Select value={sort} onChange={(e) => setSort(e.target.value)}><option value="rating">Top rated</option><option value="exp">Most experienced</option><option value="fee">Lowest fee</option></Select></Field>
        <label className="flex items-center gap-2 text-sm sm:col-span-2"><input type="checkbox" className="h-4 w-4 accent-black" checked={duty} onChange={(e) => setDuty(e.target.checked)} /> Only doctors on duty now</label>
      </div>
      <div className="mt-6">
        {list.length ? (<><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.slice(0, n).map((d) => <DoctorCard key={d.id} d={d} />)}</div>
          {n < list.length && <div className="mt-6 text-center"><Button v="outline" onClick={() => setN(n + 12)}>Load more</Button></div>}</>)
          : <Empty title="No doctors found" hint="Try removing a filter or searching a different specialty." action={<Button v="outline" onClick={() => setSp({})}>Clear filters</Button>} />}
      </div>
    </div>
  );
}
