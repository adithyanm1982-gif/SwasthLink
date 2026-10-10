import { useMemo, useState } from "react";
import { Plus, Search, Trash2, MessageSquare, X } from "lucide-react";
import { cn } from "../../lib/utils";

const group = (list) => {
  const now = Date.now(), day = 864e5, g = { Today: [], "Previous 7 days": [], Older: [] };
  list.forEach((c) => { const a = now - c.updated; (a < day ? g.Today : a < 7 * day ? g["Previous 7 days"] : g.Older).push(c); });
  return Object.entries(g).filter(([, v]) => v.length);
};

function Body({ chats, activeId, select, newChat, remove, clearAll, afterPick }) {
  const [q, setQ] = useState("");
  const groups = useMemo(() => group(chats.filter((c) => c.title.toLowerCase().includes(q.toLowerCase()))), [chats, q]);
  return (
    <div className="flex h-full flex-col">
      <div className="space-y-2 p-3">
        <button onClick={() => { newChat(); afterPick?.(); }} className="press flex w-full items-center gap-2 rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-medium hover:border-black">
          <Plus size={16} /> New chat
        </button>
        <div className="relative"><Search size={14} className="absolute left-3 top-2.5 text-zinc-500" />
          <input aria-label="Search chats" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search chats"
            className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-9 pr-3 text-sm placeholder:text-zinc-400 focus:border-black focus:outline-none" /></div>
      </div>
      <nav aria-label="Chat history" className="thin-scroll flex-1 overflow-y-auto px-2 pb-2">
        {groups.map(([label, items]) => (
          <div key={label} className="mb-3">
            <div className="mono px-3 py-1">{label}</div>
            {items.map((c) => (
              <div key={c.id} className={cn("group flex items-center rounded-xl", c.id === activeId ? "bg-zinc-200" : "hover:bg-zinc-100")}>
                <button className="flex min-w-0 flex-1 items-center gap-2 px-3 py-2 text-left text-sm" onClick={() => { select(c.id); afterPick?.(); }} aria-current={c.id === activeId}>
                  <MessageSquare size={14} className="shrink-0 text-zinc-500" /><span className="truncate">{c.title}</span>
                </button>
                <button aria-label={`Delete chat ${c.title}`} onClick={() => remove(c.id)} className="mr-1 p-1.5 text-zinc-500 hover:text-red-600 focus:opacity-100 md:opacity-0 md:group-hover:opacity-100"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        ))}
        {!chats.length && <p className="px-3 py-4 text-sm text-zinc-500">No conversations yet. Start a new chat to see it here.</p>}
        {!!chats.length && !groups.length && <p className="px-3 py-4 text-sm text-zinc-500">No chats match your search.</p>}
      </nav>
      {!!chats.length && <div className="border-t border-zinc-200 p-3"><button onClick={() => window.confirm("Delete all chat history?") && clearAll()} className="text-xs text-zinc-500 hover:text-red-600">Clear all history</button></div>}
    </div>
  );
}

export default function ChatSidebar({ open, onClose, ...p }) {
  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-zinc-200 bg-zinc-50 md:block"><Body {...p} /></aside>
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-[rgb(0_0_0/0.6)]" onClick={onClose} />
          <div className="relative h-full w-72 bg-zinc-50">
            <button className="absolute right-2 top-2 z-10 p-1.5" onClick={onClose} aria-label="Close history"><X size={18} /></button>
            <Body {...p} afterPick={onClose} />
          </div>
        </div>
      )}
    </>
  );
}
