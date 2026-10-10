import { useRef, useState } from "react";
import { Upload, FileText } from "lucide-react";
import { uploadFile } from "../../lib/api";
import { useApp } from "../../lib/store";
import { cn } from "../../lib/utils";

// Uploads through the backend (Cloudinary / S3). Falls back to a local object URL in demo mode.
export default function UploadZone({ onUploaded, accept = ".pdf,image/*", label = "Drag a file here or click to browse" }) {
  const { toast } = useApp();
  const ref = useRef(); const [over, setOver] = useState(false); const [prog, setProg] = useState(0); const [busy, setBusy] = useState(false); const [name, setName] = useState("");
  const handle = async (f) => {
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) return toast("File too large. Maximum is 10 MB.", "alert");
    setBusy(true); setProg(10); setName(f.name);
    const timer = setInterval(() => setProg((p) => Math.min(p + 15, 90)), 200);
    try { const r = await uploadFile(f); setProg(100); onUploaded(r); toast("File uploaded", "ok"); }
    catch { toast("Upload failed. Please try again.", "alert"); }
    finally { clearInterval(timer); setBusy(false); }
  };
  return (
    <div role="button" tabIndex={0} onClick={() => ref.current.click()} onKeyDown={(e) => e.key === "Enter" && ref.current.click()}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)} onDrop={(e) => { e.preventDefault(); setOver(false); handle(e.dataTransfer.files[0]); }}
      className={cn("cursor-pointer border border-dashed border-black p-8 text-center", over && "bg-zinc-100")}>
      {name ? <FileText className="mx-auto" size={28} /> : <Upload className="mx-auto" size={28} />}
      <p className="mt-2 text-sm">{name || label}</p>
      <p className="mono mt-1">PDF or image · max 10 MB</p>
      {busy && <div className="mx-auto mt-3 h-1.5 w-48 bg-zinc-200"><div className="h-full bg-black transition-all" style={{ width: prog + "%" }} /></div>}
      <input ref={ref} type="file" accept={accept} hidden onChange={(e) => handle(e.target.files[0])} />
    </div>
  );
}
