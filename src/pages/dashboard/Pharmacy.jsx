import { useMemo, useState } from "react";
import { Search, ShoppingCart, Plus, Minus } from "lucide-react";
import { useApp } from "../../lib/store";
import { PageHeader, Button, Card, Input, Select, Modal, Field, Badge, Tabs, Empty } from "../../components/ui";
import UploadZone from "../../components/features/UploadZone";
import { inr } from "../../lib/utils";

const CAT = ["All", "Pain & Fever", "Diabetes", "Heart", "Allergy", "Vitamins"];
const MEDS = [["m1", "Paracetamol 500 mg (15 tabs)", "Pain & Fever", 28, false], ["m2", "Ibuprofen 400 mg (10 tabs)", "Pain & Fever", 34, false], ["m3", "Metformin 500 mg (30 tabs)", "Diabetes", 62, true], ["m4", "Glimepiride 1 mg (30 tabs)", "Diabetes", 95, true], ["m5", "Atorvastatin 10 mg (15 tabs)", "Heart", 110, true], ["m6", "Amlodipine 5 mg (30 tabs)", "Heart", 54, true], ["m7", "Cetirizine 10 mg (10 tabs)", "Allergy", 22, false], ["m8", "Loratadine 10 mg (10 tabs)", "Allergy", 40, false], ["m9", "Vitamin D3 60,000 IU (4 caps)", "Vitamins", 120, false], ["m10", "Multivitamin (30 tabs)", "Vitamins", 180, false], ["m11", "ORS Sachets (10)", "Pain & Fever", 85, false], ["m12", "Vitamin B12 1500 mcg (10 tabs)", "Vitamins", 96, false]];
const SHOPS = ["MedPlus, Anna Nagar", "Apollo Pharmacy, Velachery", "Wellness Forever, T. Nagar", "Frank Ross, Adyar"];

export default function Pharmacy() {
  const { orders, addOrder, toast } = useApp();
  const [q, setQ] = useState(""); const [cat, setCat] = useState("All"); const [cart, setCart] = useState({}); const [open, setOpen] = useState(false);
  const [shop, setShop] = useState(SHOPS[0]); const [mode, setMode] = useState("Pickup"); const [rx, setRx] = useState(null);
  const list = useMemo(() => MEDS.filter((m) => (cat === "All" || m[2] === cat) && m[1].toLowerCase().includes(q.toLowerCase())), [q, cat]);
  const items = MEDS.filter((m) => cart[m[0]]); const total = items.reduce((s, m) => s + m[3] * cart[m[0]], 0); const needRx = items.some((m) => m[4]);
  const bump = (id, d) => setCart((c) => { const n = Math.max(0, (c[id] || 0) + d); const x = { ...c, [id]: n }; if (!n) delete x[id]; return x; });
  const place = () => {
    if (needRx && !rx) return toast("Upload a prescription for prescription-only medicines", "alert");
    addOrder({ type: "Pharmacy", summary: items.map((m) => `${m[1]} x${cart[m[0]]}`).join(", "), total, where: shop, mode }); setCart({}); setOpen(false); setRx(null); toast("Order placed", "ok");
  };
  return (
    <>
      <PageHeader title="Pharmacy" sub="Reserve medicines at verified pharmacies for pickup or delivery."><Button onClick={() => setOpen(true)} disabled={!items.length}><ShoppingCart size={14} /> Cart ({items.length}) · {inr(total)}</Button></PageHeader>
      <Tabs value={cat} onChange={setCat} tabs={CAT.map((c) => [c, c])} />
      <div className="relative mt-3"><Search size={14} className="absolute left-3 top-3" /><Input className="pl-9" aria-label="Search medicine" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search medicine" /></div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{list.map(([id, n, c, p, r]) => (
        <Card key={id} className="flex flex-col gap-2 p-4"><div className="flex justify-between gap-2"><b className="text-sm leading-tight">{n}</b>{r && <Badge tone="alert">Rx</Badge>}</div><div className="mono">{c}</div>
          <div className="mt-auto flex items-center justify-between pt-2"><span className="font-semibold">{inr(p)}</span>
            {cart[id] ? (<div className="flex items-center border border-black"><button className="p-1.5" aria-label="Less" onClick={() => bump(id, -1)}><Minus size={14} /></button><span className="w-7 text-center text-sm">{cart[id]}</span><button className="p-1.5" aria-label="More" onClick={() => bump(id, 1)}><Plus size={14} /></button></div>) : <Button v="outline" onClick={() => bump(id, 1)}>Add</Button>}</div></Card>))}</div>
      {!list.length && <Empty title="No medicines found" hint="Try another name or category." />}
      <h2 className="mb-3 mt-10 text-lg font-semibold">Your pharmacy orders</h2>
      <div className="space-y-2">{orders.filter((o) => o.type === "Pharmacy").map((o) => (<Card key={o.id} className="p-3 text-sm"><div className="flex justify-between"><b>{o.id}</b><Badge tone="ok">{o.status}</Badge></div><div className="text-zinc-600">{o.summary}</div><div className="mono mt-1">{o.mode} · {o.where} · {inr(o.total)}</div></Card>))}
        {!orders.some((o) => o.type === "Pharmacy") && <p className="text-sm text-zinc-600">No orders yet.</p>}</div>
      <Modal open={open} onClose={() => setOpen(false)} title="Checkout"><div className="space-y-3">
        {items.map((m) => <div key={m[0]} className="flex justify-between text-sm"><span>{m[1]} × {cart[m[0]]}</span><span>{inr(m[3] * cart[m[0]])}</span></div>)}<div className="flex justify-between border-t border-black pt-2 font-semibold"><span>Total</span><span>{inr(total)}</span></div>
        <Field label="Pharmacy"><Select value={shop} onChange={(e) => setShop(e.target.value)}>{SHOPS.map((s) => <option key={s}>{s}</option>)}</Select></Field>
        <Field label="Fulfilment"><Select value={mode} onChange={(e) => setMode(e.target.value)}><option>Pickup</option><option>Home delivery</option></Select></Field>
        {needRx && <div><div className="label">Prescription required</div><UploadZone onUploaded={setRx} label="Upload prescription" /></div>}
        <Button className="w-full" onClick={place}>Place order</Button></div></Modal>
    </>
  );
}
