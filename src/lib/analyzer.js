const R = [
  ["Hemoglobin", ["hemoglobin", "haemoglobin", "hb "], "g/dL", 12, 17.5], ["WBC Count", ["wbc", "white blood"], "/µL", 4000, 11000],
  ["Platelets", ["platelet"], "/µL", 150000, 450000], ["Fasting Glucose", ["fasting glucose", "glucose", "fbs", "sugar"], "mg/dL", 70, 100],
  ["HbA1c", ["hba1c"], "%", 4, 5.6], ["Total Cholesterol", ["total cholesterol", "cholesterol"], "mg/dL", 0, 200],
  ["LDL", ["ldl"], "mg/dL", 0, 100], ["HDL", ["hdl"], "mg/dL", 40, 100], ["Triglycerides", ["triglyceride"], "mg/dL", 0, 150],
  ["Creatinine", ["creatinine"], "mg/dL", 0.6, 1.3], ["TSH", ["tsh"], "mIU/L", 0.4, 4.0], ["Vitamin D", ["vitamin d"], "ng/mL", 30, 100],
];
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function analyzeText(text) {
  const s = String(text).toLowerCase();
  const rows = [];
  for (const [name, aliases, unit, lo, hi] of R) {
    for (const a of aliases) {
      const m = s.match(new RegExp(esc(a) + "[^0-9\\n]{0,20}(\\d+(?:\\.\\d+)?)"));
      if (m) { const value = parseFloat(m[1]); rows.push({ name, value, unit, lo, hi, status: value < lo ? "Low" : value > hi ? "High" : "Normal" }); break; }
    }
  }
  const flagged = rows.filter((r) => r.status !== "Normal");
  const has = (...n) => flagged.some((r) => n.includes(r.name));
  const specialty = has("HbA1c", "Fasting Glucose") ? "Diabetology" : has("LDL", "Total Cholesterol", "Triglycerides") ? "Cardiology" : has("TSH") ? "Endocrinology" : flagged.length ? "Internal Medicine" : null;
  const summary = !rows.length
    ? "No standard markers were recognised. Paste values with units, for example: Hemoglobin 11.2 g/dL."
    : flagged.length
      ? `${flagged.length} of ${rows.length} markers are outside the usual range: ${flagged.map((r) => `${r.name} (${r.status.toLowerCase()})`).join(", ")}. Please review with a doctor.`
      : `All ${rows.length} recognised markers are within the usual range.`;
  return { rows, summary, specialty };
}
