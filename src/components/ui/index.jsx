import { useEffect } from "react";
import { X, Loader2, Inbox } from "lucide-react";
import { cn } from "../../lib/utils";

const V = {
  primary: "bg-black text-white border-black hover:bg-zinc-800",
  outline: "bg-white text-black border-black hover:bg-zinc-100",
  ghost: "border-transparent hover:bg-zinc-100",
  danger: "bg-red-600 text-white border-red-600 hover:bg-red-700",
};
export const Button = ({ v = "primary", type = "button", className, ...p }) => (
  <button type={type} {...p} className={cn("press inline-flex items-center justify-center gap-2 border px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40", V[v], className)} />
);
export const Card = ({ className, ...p }) => <div {...p} className={cn("card", className)} />;
const T = { neutral: "border-zinc-400 text-zinc-700", ok: "border-emerald-600 text-emerald-700", alert: "border-red-600 text-red-600", dark: "border-black bg-black text-white" };
export const Badge = ({ tone = "neutral", className, ...p }) => (
  <span {...p} className={cn("inline-block border px-1.5 py-0.5 font-mono text-[11px] uppercase tracking-wide", T[tone], className)} />
);
export const Field = ({ label, children, className }) => (<label className={cn("block", className)}><span className="label">{label}</span>{children}</label>);
export const Input = ({ className, ...p }) => <input {...p} className={cn("input", className)} />;
export const Select = ({ className, children, ...p }) => <select {...p} className={cn("input", className)}>{children}</select>;
export const Textarea = ({ className, ...p }) => <textarea {...p} className={cn("input", className)} />;
export const Skeleton = ({ className }) => <div className={cn("skel h-4 w-full", className)} />;
export const Spinner = ({ label = "Loading" }) => (
  <div className="flex items-center gap-2 text-sm text-zinc-600" role="status"><Loader2 className="animate-spin" size={16} />{label}…</div>
);
export const Empty = ({ title, hint, action }) => (
  <div className="card flex flex-col items-center gap-2 px-6 py-12 text-center">
    <Inbox size={28} className="text-zinc-400" />
    <b>{title}</b>
    {hint && <p className="max-w-sm text-sm text-zinc-600">{hint}</p>}
    {action}
  </div>
);
export const Stat = ({ icon: I, label, value, note }) => (
  <Card className="p-4">
    <div className="flex items-center justify-between"><span className="mono">{label}</span>{I && <I size={16} />}</div>
    <div className="mt-2 text-3xl font-semibold tracking-tight">{value}</div>
    {note && <div className="mt-1 text-xs text-zinc-600">{note}</div>}
  </Card>
);
export const PageHeader = ({ title, sub, children }) => (
  <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
    <div><h1 className="text-2xl font-semibold tracking-tight">{title}</h1>{sub && <p className="mt-1 text-sm text-zinc-600">{sub}</p>}</div>
    <div className="flex gap-2">{children}</div>
  </div>
);
export function Tabs({ tabs, value, onChange }) {
  return (
    <div className="flex overflow-x-auto border border-black" role="tablist">
      {tabs.map(([id, label]) => (
        <button key={id} role="tab" aria-selected={value === id} onClick={() => onChange(id)}
          className={cn("whitespace-nowrap border-r border-black px-4 py-2 text-sm last:border-r-0", value === id ? "bg-black text-white" : "hover:bg-zinc-100")}>{label}</button>
      ))}
    </div>
  );
}
export function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return;
    const h = (e) => e.key === "Escape" && onClose();
    addEventListener("keydown", h); return () => removeEventListener("keydown", h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[rgb(0_0_0/0.6)] p-4" role="dialog" aria-modal="true" aria-label={title} onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-lg overflow-auto border border-black bg-white" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-black px-4 py-3"><b>{title}</b><button onClick={onClose} aria-label="Close"><X size={18} /></button></div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
export const PageSkeleton = () => (
  <div className="mx-auto max-w-7xl space-y-4 p-6" aria-busy="true">
    <Skeleton className="h-8 w-1/3" /><Skeleton className="h-4 w-2/3" />
    <div className="grid gap-4 sm:grid-cols-3"><Skeleton className="h-28" /><Skeleton className="h-28" /><Skeleton className="h-28" /></div>
    <Skeleton className="h-64" />
  </div>
);
