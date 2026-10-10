import { hash, healthId } from "../../lib/utils";

export default function HealthIdCard({ user }) {
  const seed = user.id || user.name; const n = 15;
  const cells = Array.from({ length: n * n }, (_, i) => (hash(seed + i) % 3) !== 0);
  return (
    <div className="flex items-center justify-between gap-4 border border-black bg-white p-4">
      <div><div className="mono">Swasthlink Health ID</div><div className="mt-1 font-mono text-xl tracking-wider">{healthId(seed)}</div><div className="mt-2 text-sm font-medium">{user.name}</div><div className="mono">Demo ID · not a government ABHA number</div></div>
      <svg width="84" height="84" viewBox={`0 0 ${n} ${n}`} aria-label="Health ID code" shapeRendering="crispEdges" fill="currentColor">{cells.map((on, i) => on && <rect key={i} x={i % n} y={Math.floor(i / n)} width="1" height="1" />)}</svg>
    </div>
  );
}
