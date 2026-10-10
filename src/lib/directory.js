import D from "../data/dataset.json";
import { feeFor, ratingFor, langsFor } from "./utils";

export const FACILITIES = [
  ...D.hospitals_and_facilities.map((h) => ({ id: h.id, name: h.name, kind: "Hospital", type: h.type, area: h.area, phone: h.emerg, hours: "24x7", beds: h.beds, icu: h.icu })),
  ...D.labs_clinics_bloodbanks.map((l) => ({ id: l.id, name: l.name, kind: l.cat, type: l.cat, area: l.area, phone: l.contact, hours: l.hours, beds: 0, icu: 0 })),
];
export const FAC = Object.fromEntries(FACILITIES.map((f) => [f.id, f]));
export const HOSPITALS = FACILITIES.filter((f) => f.kind === "Hospital");
export const DOCTORS = D.doctors.map((d) => ({ ...d, fee: feeFor(d.id), rating: ratingFor(d.id), langs: langsFor(d.id), facility: FAC[d.parentId]?.name || "Swasthlink Network", area: FAC[d.parentId]?.area || "Chennai" }));
export const SPECIALTIES = [...new Set(DOCTORS.map((d) => d.field))].sort();
export const AREAS = [...new Set(FACILITIES.map((f) => f.area))].sort();
export const TRANSPORTS = D.medical_transports;
export const PATIENTS = D.patients;
export const KINDS = ["Hospital", "Diagnostic Lab", "Blood Bank", "Scan Center", "Polyclinic", "Dialysis Center"];
