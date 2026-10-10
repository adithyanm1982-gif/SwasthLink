import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Video, Building2 } from "lucide-react";
import { useApp } from "../../lib/store";
import { PageHeader, Tabs, Card, Badge, Button, Empty } from "../../components/ui";
import { dayLabel, inr } from "../../lib/utils";

export default function Appointments() {
  const { appts, updateAppt, toast } = useApp(); const nav = useNavigate(); const [tab, setTab] = useState("Booked");
  const list = appts.filter((a) => a.status === tab);
  return (
    <>
      <PageHeader title="Appointments" sub="Join video visits, review past consultations or cancel."><Link to="/doctors"><Button>Book new</Button></Link><Button v="outline" onClick={() => nav("/app/consult/instant")}>Instant consult room</Button></PageHeader>
      <Tabs value={tab} onChange={setTab} tabs={[["Booked", "Upcoming"], ["Completed", "Past"], ["Cancelled", "Cancelled"]]} />
      <div className="mt-4 space-y-3">{list.map((a) => (
        <Card key={a.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div><div className="flex items-center gap-2 font-semibold">{a.mode === "Video" ? <Video size={16} /> : <Building2 size={16} />}{a.doctorName}</div>
            <div className="text-sm text-zinc-600">{a.field} · {a.facility}</div><div className="text-sm">{dayLabel(a.date)} at {a.time} · {inr(a.fee)}</div><div className="mono mt-1">{a.id} · {a.reason}</div></div>
          <div className="flex gap-2">{a.status === "Booked" && (<>
            {a.mode === "Video" && <Button onClick={() => nav(`/app/consult/${a.id}`)}><Video size={14} /> Join video</Button>}
            <Button v="outline" onClick={() => { updateAppt(a.id, { status: "Cancelled" }); toast("Appointment cancelled"); }}>Cancel</Button></>)}
            {a.status !== "Booked" && <Badge>{a.status}</Badge>}</div>
        </Card>))}
        {!list.length && <Empty title="No appointments here" hint="Booked consultations will appear in this list." action={<Link to="/doctors"><Button className="mt-2">Find a doctor</Button></Link>} />}</div>
    </>
  );
}
