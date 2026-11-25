# SwasthLink 🩺
**AI-Powered Unified Triage Engine & Local Healthcare Ecosystem**

> *Intelligent, accessible, and continuous healthcare for every patient—anytime, anywhere.*

---

## 📌 Overview
**SwasthLink** is an offline-first, multimodal AI healthcare platform built to close the accessibility, diagnostic, and post-consultation gaps in rural and underserved regions. Unlike conventional telemedicine apps that end after a video call, SwasthLink creates a **closed-loop care continuum**—guiding patients from initial symptom screening (via image, voice, or text) to safety-validated care routing, doctor tele-consultations, and local pharmacy or diagnostic lab fulfillment.

Developed for **SKC Technova'26** (*Track 3: Technology for Social Impact & Sustainability*)

---

## 🎯 The Problem It Solves
* **Unscreened ER Congestion & Delayed Care:** Patients often lack clarity on symptom severity or the right medical department, leading to delayed treatment or overcrowded emergency rooms.
* **Fragmented Healthcare Workflows:** Existing platforms separate symptom checking, doctor consultations, pharmacies, and diagnostic labs into disconnected systems.
* **Rural Digital Exclusion:** Cloud-heavy healthcare applications fail in low-connectivity or zero-network regions and exclude non-tech-savvy users with text-heavy interfaces.
* **Medical Jargon & Health Literacy Gaps:** Dense diagnostic and clinical reports prevent patients from understanding their conditions and next steps.

---

## ✨ Key Features
* **Multimodal Patient Entry:** Describe symptoms naturally via **medical images** (e.g., skin, eye, wounds), **vernacular voice input**, or **text**.
* **Smart AI Triage & Safety Gateway:** Powered by a lightweight **MobileNetV3-Small CNN** and rule-based symptom mapping with strict input validation, PII protection, and ML validation to route cases safely into:
  1. **First Aid Guidance**
  2. **Doctor Tele-Consultation**
  3. **Emergency Support & Dispatch**
* **Offline-First Edge Architecture:** Runs ultra-fast on-device inference with local data caching, Google ML Kit OCR, cached ABHA records, and SMS fallback alerts for uninterrupted functionality in low-bandwidth areas.
* **Closed-Loop Local Fulfillment:** Connects patients directly to nearby pharmacies for medicine delivery and local diagnostic labs for scan/test bookings.
* **Plain-Language Report Analyzer:** Translates complex lab and medical reports into clear, accessible summaries.

---

## 🏗️ System Architecture & Workflow

```text
[Multimodal Input: Image | Voice | Text]
                  │
                  ▼
   [Offline / On-Device Preprocessing]
   (Speech-to-Text • Image Prep • Symptom Extraction)
                  │
                  ▼
     [ML & Rule-Based Triage Engine]
      (MobileNetV3-Small CNN + Mapping)
                  │
                  ▼
          [Safety Gateway]
   (PII Protection • File & ML Validation)
                  │
        ┌─────────┼─────────┐
        ▼         ▼         ▼
  [First Aid] [Doctor   [Emergency
   Guidance]  Consult]   Dispatch]
                  │
                  ▼
       [Local Care Fulfillment]
     (Nearby Pharmacies & Labs)
```[cite: 6, 7]

---

## 🛠️ Tech Stack
* **Machine Learning / Computer Vision:** MobileNetV3-Small CNN (Transfer Learning & Fine-Tuning), Rule-Based Symptom Mapping, Google ML Kit OCR[cite: 6, 10]
* **Edge & Offline Capabilities:** On-Device Inference, Local Data Caching, SMS Alert Fallback[cite: 8, 10]
* **Frontend & Backend:** Web/Mobile Patient, Doctor & Vendor Portals (React / Vite, FastAPI / Python) *(update with your exact repo stack)*[cite: 2, 7]
* **Healthcare Standards:** ABHA / ABDM-ready architecture, MoHFW Telemedicine Practice Guidelines aligned[cite: 9, 10, 11]

---

## 📊 Expected Impact & Benchmarks
* **30–40% Reduction in ER Overload:** Automated safety-gateway screening diverts non-emergency cases to first aid or tele-consultation[cite: 8].
* **Sub-Second Triage Turnaround:** Lightweight edge execution delivers instant symptom classification on low-cost smartphones[cite: 8].
* **Hours Instead of Days:** Geo-routed local pharmacy and diagnostic lab integration accelerates care fulfillment[cite: 8].

---

## 🚀 Future Scope
* **Multi-Specialty Vision Expansion:** Extending MobileNetV3-Small pipelines across Dermatology, ENT, Ophthalmology, Dentistry, and Wound Care[cite: 9].
* **ABHA & ABDM Vault Sync:** Standardized retrieval of longitudinal patient records, allergies, and chronic care histories[cite: 9].
* **Pan-India Vendor Marketplace & IoT Sync:** Real-time pharmacy inventory tracking and wearable telemetry alerts for acute health events[cite: 9].

---
```
## 👥 Team
Saveetha Engineering College, Chennai
* Adithya N M
* M Aadhavan
* Madhumithra P
* Sandya S
