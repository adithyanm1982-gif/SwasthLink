import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { FACILITIES, AREAS, KINDS } from "../../lib/directory";
import FacilityCard from "../../components/features/FacilityCard";
import { Empty, Input, Select, Tabs } from "../../components/ui";

export default function Facilities() {
  const [kind, setKind] = useState("all"); const [q, setQ] = useState(""); const [area, setArea] = useState("");
  const list = useMemo(() => FACILITIES.filter((f) => (kind === "all" || f.kind === kind) && (!area || f.area === area) && (f.name + f.area).toLowerCase().includes(q.toLowerCase())), [kind, q, area]);
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Hospitals, labs and blood banks</h1>
      <p className="mt-1 text-sm text-zinc-600">{FACILITIES.length} verified facilities across Chennai.</p>
      <div className="mt-6"><Tabs value={kind} onChange={setKind} tabs={[["all", "All"], ...KINDS.map((k) => [k, k + (k.endsWith("s") ? "" : "s")])]} /></div>
      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_220px]">
        <div className="relative"><Search size={14} className="absolute left-3 top-3" /><Input className="pl-9" aria-label="Search facilities" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or area" /></div>
        <Select aria-label="Area" value={area} onChange={(e) => setArea(e.target.value)}><option value="">All areas</option>{AREAS.map((a) => <option key={a}>{a}</option>)}</Select>
      </div>
      <div className="mt-6">{list.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.map((f) => <FacilityCard key={f.id} f={f} />)}</div> : <Empty title="No facilities found" hint="Try a different area or category." />}</div>
    </div>
  );
}
