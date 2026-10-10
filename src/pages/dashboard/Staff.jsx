import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useApp, usePersisted } from "../../lib/store";
import { DOCTORS } from "../../lib/directory";
import { PageHeader, Button, Card, Field, Input, Select, Badge, Empty } from "../../components/ui";
import { uid } from "../../lib/utils";

export default function Staff() {
  const { user, toast } = useApp();
  const base = DOCTORS.filter((d) => d.parentId === user.facilityId).map((d) => ({ id: d.id, name: d.name, role: d.field, status: d.status }));
  const [list, setList] = usePersisted("swl-staff-" + user.facilityId, base);
  const [n, setN] = useState(""); const [r, setR] = useState("Doctor");
  const add = () => { if (!n.trim()) return; setList([...list, { id: uid("S"), name: n, role: r, status: "On-Duty" }]); setN(""); toast("Staff member added", "ok"); };
  return (
    <>
      <PageHeader title="Staff" sub="Workers linked to your facility sign in with Worker / Incharge and select your organisation." />
      <Card className="mb-6 grid gap-3 p-4 sm:grid-cols-[1fr_200px_auto] sm:items-end"><Field label="Name"><Input value={n} onChange={(e) => setN(e.target.value)} /></Field>
        <Field label="Role"><Select value={r} onChange={(e) => setR(e.target.value)}>{["Doctor", "Technician", "Pharmacist", "Nurse", "Front desk"].map((x) => <option key={x}>{x}</option>)}</Select></Field><Button onClick={add}>Add staff</Button></Card>
      <div className="space-y-2">{list.map((s) => (<Card key={s.id} className="flex items-center justify-between p-3"><div><b>{s.name}</b><div className="text-sm text-zinc-600">{s.role}</div></div>
        <div className="flex items-center gap-2"><button onClick={() => setList(list.map((x) => (x.id === s.id ? { ...x, status: x.status === "On-Duty" ? "Off-Duty" : "On-Duty" } : x)))}><Badge tone={s.status === "On-Duty" ? "ok" : "neutral"}>{s.status}</Badge></button>
          <Button v="ghost" aria-label={`Remove ${s.name}`} onClick={() => setList(list.filter((x) => x.id !== s.id))}><Trash2 size={14} /></Button></div></Card>))}
        {!list.length && <Empty title="No staff yet" hint="Add doctors and technicians for your facility." />}</div>
    </>
  );
}
