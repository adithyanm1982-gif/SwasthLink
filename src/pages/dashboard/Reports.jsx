import { useState } from "react";
import { Link } from "react-router-dom";
import { ScanText } from "lucide-react";
import { analyzeReport } from "../../lib/api";
import { useApp } from "../../lib/store";
import { PageHeader, Button, Card, Textarea, Badge, Spinner } from "../../components/ui";
import UploadZone from "../../components/features/UploadZone";
import { cn } from "../../lib/utils";

const SAMPLE = "Hemoglobin 11.2 g/dL\nFasting glucose 118 mg/dL\nHbA1c 6.1 %\nLDL 132 mg/dL\nTSH 2.1 mIU/L";
export default function Reports() {
  const { user, addRecord, toast } = useApp();
  const [file, setFile] = useState(null); const [text, setText] = useState(""); const [busy, setBusy] = useState(false); const [res, setRes] = useState(null);
  const run = async () => {
    setBusy(true); setRes(null);
    try { setRes(await analyzeReport({ text, fileUrl: file?.url })); } catch { toast("Analysis failed. Please try again.", "alert"); } finally { setBusy(false); }
  };
  const save = () => { addRecord({ type: "Report", title: file?.name || "Pasted lab values", text: res.summary, url: file?.url }); toast("Saved to health records", "ok"); };
  return (
    <>
      <PageHeader title="Medical report analyzer" sub="Upload a report or paste values to compare them with standard ranges." />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4"><UploadZone onUploaded={setFile} />
          {file && <p className="text-sm">Attached: <b>{file.name}</b>{file.local && <span className="text-zinc-600"> (stored locally, text extraction needs the backend)</span>}</p>}
          <div><div className="flex items-center justify-between"><span className="label">Or paste notes and lab values</span><button className="mono underline" onClick={() => setText(SAMPLE)}>Use sample</button></div>
            <Textarea rows={8} value={text} onChange={(e) => setText(e.target.value)} placeholder="Hemoglobin 11.2 g/dL" /></div>
          <Button className="w-full py-3" disabled={busy || (!file && !text.trim())} onClick={run}><ScanText size={16} /> {busy ? "Analyzing…" : "Analyze Medical Document"}</Button></div>
        <Card className="min-h-[300px] p-5"><div className="mono mb-3">Analysis</div>
          {busy && <Spinner label="Analyzing" />}
          {!busy && !res && <p className="text-sm text-zinc-600">Results appear here after analysis.</p>}
          {res && (<div className="space-y-4"><p className="text-sm">{res.summary}</p>
            <div className="divide-y divide-zinc-200">{res.rows.map((r) => (<div key={r.name} className="flex items-center justify-between gap-3 py-2 text-sm"><div><b>{r.name}</b><div className="mono">Range {r.lo}–{r.hi} {r.unit}</div></div>
              <div className="flex items-center gap-2"><span className="font-mono">{r.value} {r.unit}</span><Badge tone={r.status === "Normal" ? "ok" : "alert"}>{r.status}</Badge></div></div>))}</div>
            <div className="flex flex-wrap gap-2">{user.role !== "guest" && <Button v="outline" onClick={save}>Save to records</Button>}{res.specialty && <Link to={`/doctors?field=${res.specialty}`}><Button>Consult {res.specialty}</Button></Link>}</div>
            <p className="text-xs text-zinc-500">Informational only. A licensed doctor must confirm any interpretation.</p></div>)}
        </Card>
      </div>
    </>
  );
}
