import { useApp } from "../../lib/store";

export default function Toasts() {
  const { toasts } = useApp();
  return (
    <div className="fixed bottom-4 right-4 z-[60] flex w-80 max-w-[90vw] flex-col gap-2" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={"border bg-white px-4 py-3 text-sm shadow-lg " + (t.tone === "alert" ? "border-red-600 text-red-600" : t.tone === "ok" ? "border-emerald-600" : "border-black")}>{t.text}</div>
      ))}
    </div>
  );
}
