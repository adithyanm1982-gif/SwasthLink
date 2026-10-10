import { useMemo, useState } from "react";
import { useApp } from "../../lib/store";
import { PageHeader, Button, Card, Select, Field, Input, Badge, Modal } from "../../components/ui";
import { FACILITIES } from "../../lib/directory";
import { iso, inr, cn } from "../../lib/utils";

const TESTS = [["t1", "Complete Blood Count", 350], ["t2", "HbA1c", 500], ["t3", "Lipid Profile", 650], ["t4", "Thyroid Panel (T3, T4, TSH)", 700], ["t5", "Liver Function Test", 800], ["t6", "Kidney Function Test", 750], ["t7", "Vitamin D (25-OH)", 1100], ["t8", "Urine Routine", 150], ["t9", "Dengue NS1 Antigen", 900], ["t10", "ECG", 300]];
const PACKS = [["Full Body Checkup", ["t1", "t2", "t3", "t5", "t6", "t8"], 2800], ["Diabetes Care", ["t2", "t6", "t8"], 1200], ["Heart Health", ["t3", "t10", "t1"], 1100]];

export default function Labs() {
  const { orders, addOrder, toast } = useApp();
  const [sel, setSel] = useState([]); const [open, setOpen] = useState(false);
  const labs = useMemo(() => FACILITIES.filter((f) => f.kind === "Diagnostic Lab"), []);
  const [lab, setLab] = useState(labs[0].name); const [where, setWhere] = useState("Home collection"); const [date, setDate] = useState(iso(1));
  const total = TESTS.filter((t) => sel.includes(t[0])).reduce((s, t) => s + t[2], 0);
  const toggle = (id) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const book = () => { addOrder({ type: "Lab", summary: TESTS.filter((t) => sel.includes(t[0])).map((t) => t[1]).join(", "), total, where: `${lab} · ${where} · ${date}` }); setSel([]); setOpen(false); toast("Lab test booked", "ok"); };
  return (
    <>
      <PageHeader title="Lab tests" sub="Book diagnostics with home sample collection."><Button disabled={!sel.length} onClick={() => setOpen(true)}>Book {sel.length || ""} test{sel.length === 1 ? "" : "s"} · {inr(total)}</Button></PageHeader>
      <div className="grid gap-3 md:grid-cols-3">{PACKS.map(([n, ids, p]) => (<Card key={n} className="p-4"><b>{n}</b><div className="mono mt-1">{ids.length} tests</div><div className="mt-3 flex items-center justify-between"><span className="font-semibold">{inr(p)}</span><Button v="outline" onClick={() => setSel([...new Set([...sel, ...ids])])}>Add package</Button></div></Card>))}</div>
      <h2 className="mb-3 mt-8 text-lg font-semibold">Individual tests</h2>
      <div className="grid gap-2 sm:grid-cols-2">{TESTS.map(([id, n, p]) => (<button key={id} onClick={() => toggle(id)} className={cn("flex items-center justify-between border p-3 text-left text-sm", sel.includes(id) ? "border-black bg-black text-white" : "border-zinc-300 hover:border-black")}><span>{n}</span><span className="font-mono">{inr(p)}</span></button>))}</div>
      <h2 className="mb-3 mt-8 text-lg font-semibold">Your lab bookings</h2>
      <div className="space-y-2">{orders.filter((o) => o.type === "Lab").map((o) => (<Card key={o.id} className="p-3 text-sm"><div className="flex justify-between"><b>{o.id}</b><Badge tone="ok">{o.status}</Badge></div><div className="text-zinc-600">{o.summary}</div><div className="mono mt-1">{o.where} · {inr(o.total)}</div></Card>))}
        {!orders.some((o) => o.type === "Lab") && <p className="text-sm text-zinc-600">No bookings yet.</p>}</div>
      <Modal open={open} onClose={() => setOpen(false)} title="Confirm booking"><div className="space-y-3">
        <Field label="Diagnostic lab"><Select value={lab} onChange={(e) => setLab(e.target.value)}>{labs.map((l) => <option key={l.id}>{l.name}</option>)}</Select></Field>
        <Field label="Collection"><Select value={where} onChange={(e) => setWhere(e.target.value)}><option>Home collection</option><option>Visit the lab</option></Select></Field>
        <Field label="Date"><Input type="date" min={iso()} value={date} onChange={(e) => setDate(e.target.value)} /></Field>
        <div className="flex justify-between border-t border-black pt-2 font-semibold"><span>Total</span><span>{inr(total)}</span></div><Button className="w-full" onClick={book}>Confirm</Button></div></Modal>
    </>
  );
}
