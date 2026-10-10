import { useState } from "react";
import { Download, Trash2, Eye } from "lucide-react";
import { useApp } from "../../lib/store";
import { PageHeader, Tabs, Card, Button, Badge, Modal, Empty } from "../../components/ui";
import UploadZone from "../../components/features/UploadZone";
import { dayLabel } from "../../lib/utils";

export default function Records() {
  const { records, addRecord, delRecord, toast } = useApp(); const [tab, setTab] = useState("all"); const [view, setView] = useState(null);
  const list = records.filter((r) => tab === "all" || r.type === tab);
  return (
    <>
      <PageHeader title="Health records" sub="Reports, prescriptions and uploads in one place." />
      <div className="mb-4"><UploadZone label="Upload a report or prescription" onUploaded={(f) => addRecord({ type: "Upload", title: f.name, url: f.url, text: "Uploaded document" })} /></div>
      <Tabs value={tab} onChange={setTab} tabs={[["all", "All"], ["Report", "Reports"], ["Prescription", "Prescriptions"], ["Upload", "Uploads"]]} />
      <div className="mt-4 space-y-3">{list.map((r) => (
        <Card key={r.id} className="flex flex-wrap items-center justify-between gap-3 p-4"><div><div className="flex items-center gap-2 font-semibold">{r.title}<Badge>{r.type}</Badge></div><div className="mono mt-1">{dayLabel(r.date)}{r.by ? ` · ${r.by}` : ""}</div></div>
          <div className="flex gap-2"><Button v="outline" onClick={() => setView(r)}><Eye size={14} /> View</Button>
            {r.url && <a href={r.url} download={r.title} className="inline-flex items-center gap-2 border border-black px-4 py-2 text-sm hover:bg-zinc-100"><Download size={14} /> Download</a>}
            <Button v="ghost" aria-label="Delete" onClick={() => { delRecord(r.id); toast("Record deleted"); }}><Trash2 size={14} /></Button></div></Card>))}
        {!list.length && <Empty title="No records yet" hint="Analyzed reports and consultation prescriptions are saved here." />}</div>
      <Modal open={!!view} onClose={() => setView(null)} title={view?.title}><pre className="whitespace-pre-wrap text-sm">{view?.text || "No preview available."}</pre></Modal>
    </>
  );
}
