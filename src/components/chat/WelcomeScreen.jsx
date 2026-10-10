import { Sparkles, Thermometer, HeartPulse, Stethoscope, Pill } from "lucide-react";

const CARDS = [
  [Thermometer, "Check symptoms", "I have a fever for 2 days"],
  [HeartPulse, "Urgent symptom check", "Chest pain while walking"],
  [Stethoscope, "Find the right specialist", "Which doctor should I see for a skin rash and itching?"],
  [Pill, "Medicine guidance", "What can I take for a mild headache?"],
];

export default function WelcomeScreen({ name, onPick }) {
  return (
    <div className="mx-auto flex h-full w-full max-w-3xl flex-col items-center justify-center px-4 py-10 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-full bg-black text-white"><Sparkles size={26} /></div>
      <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">Hello, {name}</h1>
      <p className="mt-2 text-lg text-zinc-600">How can I help with your health today?</p>
      <div className="mt-8 grid w-full gap-3 sm:grid-cols-2">
        {CARDS.map(([I, t, q]) => (
          <button key={t} onClick={() => onPick(q)} className="press rounded-2xl border border-zinc-300 p-4 text-left hover:border-black hover:bg-zinc-50">
            <I size={18} /><div className="mt-3 text-sm font-semibold">{t}</div><div className="mt-0.5 text-sm text-zinc-600">{q}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
