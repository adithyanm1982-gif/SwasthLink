import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Video } from "lucide-react";
import { useApp } from "../../lib/store";
import { PageHeader, Tabs, Card, Badge, Button, Empty } from "../../components/ui";
import { dayLabel } from "../../lib/utils";

export default function Queue() {
  const { appts, updateAppt, toast } = useApp(); const nav = useNavigate(); const [tab, setTab] = useState("Booked");
  const list = appts.filter((a) => a.status === tab).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  return (
    <>
      <PageHeader title="Patient queue" sub="Start consultations and mark visits complete." />
      <Tabs value={tab} onChange={setTab} tabs={[["Booked", "Waiting"], ["Completed", "Done"], ["Cancelled", "Cancelled"]]} />
      <div className="mt-4 space-y-3">{list.map((a, i) => (
        <Card key={a.id} className="flex flex-wrap items-center justify-between gap-3 p-4"><div><div className="font-semibold">#{i + 1} · {a.patientName}</div><div className="text-sm text-zinc-600">{a.reason}</div><div className="mono mt-1">{dayLabel(a.date)} · {a.time} · {a.mode}</div></div>
          <div className="flex gap-2">{a.status === "Booked" ? (<>{a.mode === "Video" && <Button onClick={() => nav(`/app/consult/${a.id}`)}><Video size={14} /> Start consult</Button>}<Button v="outline" onClick={() => { updateAppt(a.id, { status: "Completed" }); toast("Marked complete", "ok"); }}>Mark done</Button></>) : <Badge>{a.status}</Badge>}</div></Card>))}
        {!list.length && <Empty title="Queue is empty" hint="Booked patients appear here in time order." />}</div>
    </>
  );
}
