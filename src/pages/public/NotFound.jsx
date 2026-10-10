import { Link } from "react-router-dom";
import { Button } from "../../components/ui";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <div className="font-mono text-6xl">404</div><h1 className="mt-4 text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-sm text-zinc-600">The page you are looking for does not exist or has moved.</p>
      <div className="mt-6 flex justify-center gap-2"><Link to="/"><Button>Go home</Button></Link><Link to="/doctors"><Button v="outline">Find a doctor</Button></Link></div>
    </div>
  );
}
