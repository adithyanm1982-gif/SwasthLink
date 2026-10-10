import { useState } from "react";
import { Ambulance } from "lucide-react";
import { useApp } from "../../lib/store";
import { TRANSPORTS } from "../../lib/directory";
import { PageHeader, Card, Badge, Button, Empty, Tabs } from "../../components/ui";

export default function Alerts() {
  const { alerts, updateAlert } = useApp(); const [tab, setTab] = useState("alerts");
  const [fleet, setFleet] = useState(TRANSPORTS.map((t) => ({ ...t })));
  return (
    <>
      <PageHeader title="Alerts & fleet" sub="Incoming triage dispatches and ambulance availability." />
      <Tabs value={tab} onChange={setTab} tabs={[["alerts", `Alerts (${alerts.filter((a) => !a.ack).length})`], ["fleet", "Ambulance fleet"]]} />
      <div className="mt-4 space-y-3">
        {tab === "alerts" && (<>{alerts.map((a) => (
          <Card key={a.id} className={"flex flex-wrap items-center justify-between gap-3 p-4 " + (a.lvl === 1 && !a.ack ? "border-red-600" : "")}>
            <div><div className="flex items-center gap-2"><Badge tone={a.lvl === 1 ? "alert" : "neutral"}>Level {a.lvl}</Badge><b>{a.patient}</b><span className="mono">{a.id} · {a.t}</span></div>
              <div className="mt-1 text-sm text-zinc-600">{a.area} · {a.facility} · {a.vehicle || "No vehicle"} · {a.phone}</div><div className="mono mt-1">Status: {a.status}</div></div>
            <Button v="outline" disabled={a.ack} onClick={() => updateAlert(a.id, { ack: true })}>{a.ack ? "Acknowledged" : "Acknowledge"}</Button></Card>))}
          {!alerts.length && <Empty title="No alerts" hint="Dispatches from the triage page appear here instantly." />}</>)}
        {tab === "fleet" && fleet.map((t) => (<Card key={t.id} className="flex items-center justify-between p-3"><div className="flex items-center gap-3"><Ambulance size={18} /><div><b className="text-sm">{t.provider}</b><div className="mono">{t.type} · {t.vehicleNo} · {t.area}</div></div></div>
          <button onClick={() => setFleet(fleet.map((x) => (x.id === t.id ? { ...x, status: x.status === "Available" ? "On-Dispatch" : "Available" } : x)))}><Badge tone={t.status === "Available" ? "ok" : "alert"}>{t.status}</Badge></button></Card>))}
      </div>
    </>
  );
}
