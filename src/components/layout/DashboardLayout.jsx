import { useState } from "react";
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import { Menu, X, Bell, LogOut, Phone } from "lucide-react";
import Logo from "../common/Logo";
import ThemeToggle from "../common/ThemeToggle";
import { useApp } from "../../lib/store";
import { NAV, ROLE_LABEL } from "../../lib/nav";
import { LANGS } from "../../lib/i18n";
import { cn } from "../../lib/utils";

export default function DashboardLayout() {
  const { user, logout, notifs, markRead, lang, setLang } = useApp();
  const [drawer, setDrawer] = useState(false);
  const [bell, setBell] = useState(false);
  const nav = useNavigate();
  const items = NAV.filter((n) => n.roles.includes(user.role));
  const unread = notifs.filter((n) => !n.read).length;
  const side = (
    <nav aria-label="Main" className="py-3">
      {items.map(({ to, label, icon: I, end }) => (
        <NavLink key={to} to={to} end={end} onClick={() => setDrawer(false)}
          className={({ isActive }) => cn("flex items-center gap-3 px-5 py-2.5 text-sm", isActive ? "bg-black text-white" : "hover:bg-zinc-100")}><I size={16} />{label}</NavLink>
      ))}
    </nav>
  );
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-black bg-white px-4">
        <div className="flex items-center gap-3"><button className="md:hidden" aria-label="Menu" onClick={() => setDrawer(true)}><Menu /></button><Logo to="/app" /></div>
        <div className="flex items-center gap-2 sm:gap-4">
          <a href="tel:108" className="hidden items-center gap-1 border border-red-600 px-2 py-1 font-mono text-[11px] text-red-600 sm:flex"><Phone size={12} /> 108</a>
          <select aria-label="Language" value={lang} onChange={(e) => setLang(e.target.value)} className="hidden border border-zinc-300 bg-white px-2 py-1 text-sm sm:block">{Object.entries(LANGS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
          <ThemeToggle />
          <div className="relative">
            <button aria-label="Notifications" className="relative p-1" onClick={() => { setBell(!bell); markRead(); }}><Bell size={18} />{unread > 0 && <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-red-600 text-[10px] text-white">{unread}</span>}</button>
            {bell && (<div className="absolute right-0 mt-2 max-h-80 w-80 max-w-[85vw] overflow-auto border border-black bg-white shadow-lg">
              {notifs.length ? notifs.map((n) => <div key={n.id} className="border-b border-zinc-200 px-3 py-2 text-sm">{n.text}<div className="mono mt-1">{new Date(n.t).toLocaleString("en-IN")}</div></div>) : <p className="p-3 text-sm text-zinc-600">No notifications.</p>}
            </div>)}
          </div>
          <div className="hidden text-right sm:block"><div className="text-sm font-medium leading-tight">{user.name}</div><div className="mono leading-tight">{ROLE_LABEL[user.role]}{user.facility ? " · " + user.facility : ""}</div></div>
          <button className="flex items-center gap-1 border border-black px-2 py-1 text-sm hover:bg-zinc-100" onClick={() => { logout(); nav("/"); }}><LogOut size={14} /> <span className="hidden sm:inline">Log out</span></button>
        </div>
      </header>
      <div className="md:grid md:grid-cols-[240px_1fr]">
        <aside className="sticky top-14 hidden h-[calc(100vh-56px)] overflow-auto border-r border-black md:block">{side}</aside>
        {drawer && (<div className="fixed inset-0 z-50 md:hidden"><div className="absolute inset-0 bg-[rgb(0_0_0/0.6)]" onClick={() => setDrawer(false)} />
          <div className="relative h-full w-64 overflow-auto bg-white"><div className="flex items-center justify-between border-b border-black p-3"><Logo to="/app" /><button onClick={() => setDrawer(false)} aria-label="Close"><X /></button></div>{side}</div></div>)}
        <main className="page-in min-w-0 p-4 sm:p-6"><Outlet /></main>
      </div>
    </div>
  );
}
