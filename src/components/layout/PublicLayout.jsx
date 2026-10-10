import { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import Logo from "../common/Logo";
import ThemeToggle from "../common/ThemeToggle";
import Footer from "./Footer";
import { useApp } from "../../lib/store";
import { LANGS } from "../../lib/i18n";
import { Button } from "../ui";
import { cn } from "../../lib/utils";

export default function PublicLayout() {
  const { user, lang, setLang, t } = useApp();
  const [open, setOpen] = useState(false);
  useLocation();
  const links = [["/doctors", t("nav_doctors")], ["/facilities", t("nav_facilities")], ["/emergency", t("nav_emergency")]];
  const cls = ({ isActive }) => cn("px-3 py-2 text-sm hover:bg-zinc-100", isActive && "font-semibold underline underline-offset-8");
  return (
    <div className="flex min-h-screen flex-col">
      <div className="keep-light bg-black text-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 font-mono text-[11px] tracking-wider">
        <a href="tel:108" className="flex items-center gap-2"><Phone size={12} /> EMERGENCY? CALL 108 · 24x7 AMBULANCE</a>
        <span className="hidden items-center gap-2 sm:flex"><span className="live-dot inline-block h-2 w-2 rounded-full bg-emerald-500" /> CHENNAI GRID LIVE</span>
      </div></div>
      <header className="sticky top-0 z-40 border-b border-black bg-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <Logo />
          <nav className="hidden items-center md:flex">{links.map(([to, l]) => <NavLink key={to} to={to} className={cls}>{l}</NavLink>)}</nav>
          <div className="flex items-center gap-2">
            <select aria-label="Language" value={lang} onChange={(e) => setLang(e.target.value)} className="hidden border border-zinc-300 bg-white px-2 py-1.5 text-sm sm:block">
              {Object.entries(LANGS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <ThemeToggle />
            <Link to={user ? "/app" : "/login"}><Button>{user ? t("dashboard") : t("login")}</Button></Link>
            <button className="md:hidden" aria-label="Menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
          </div>
        </div>
        {open && <div className="border-t border-zinc-200 md:hidden">{links.map(([to, l]) => <NavLink key={to} to={to} onClick={() => setOpen(false)} className={(s) => cls(s) + " block"}>{l}</NavLink>)}</div>}
      </header>
      <main className="page-in flex-1"><Outlet /></main>
      <Footer />
    </div>
  );
}
