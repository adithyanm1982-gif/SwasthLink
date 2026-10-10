const RULES = [
  [/chest|heart|palpitation/i, "Cardiology"], [/skin|rash|itch|acne/i, "Dermatology"], [/headache|migraine|seizure|numb/i, "Neurology"],
  [/bone|joint|knee|back pain|fracture/i, "Orthopedics"], [/cough|breath|asthma|wheez/i, "Pulmonology"], [/stomach|vomit|acid|abdomen|diarr/i, "Gastroenterology"],
  [/sugar|diabet|thyroid/i, "Endocrinology"], [/\bear\b|throat|sinus|nose/i, "ENT"], [/anxiety|depress|stress|sleep/i, "Psychiatry"],
  [/pregnan|period|menstr/i, "Gynecology"], [/child|baby|infant/i, "Pediatrics"], [/eye|vision/i, "Ophthalmology"], [/urine|kidney/i, "Nephrology"], [/fever|cold|flu/i, "Internal Medicine"],
];
const RED = /not breathing|unconscious|severe bleeding|chest pain|stroke|slurred|seizure|poison|suicid|self.?harm/i;

export function localReply(q) {
  const urgent = RED.test(q);
  const specialty = RULES.find(([r]) => r.test(q))?.[1] || null;
  const text = urgent
    ? "These symptoms may be an emergency. Call 108 now or open Emergency Triage to dispatch an ambulance. If you are thinking of harming yourself, call Tele-MANAS 14416 or 108 immediately."
    : specialty
      ? `This sounds related to ${specialty}. Rest, stay hydrated and note when it started and what makes it worse. A ${specialty} doctor can examine you, and I can book a video consult.`
      : "Tell me your symptoms, how long you have had them, and your age. I will suggest next steps and the right specialist.";
  return { text, specialty, urgent };
}
