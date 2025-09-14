# LocalSentinel.ai — On-device Code Compliance Scanner

> Scan a repo locally, find hidden backdoors/data-leaks/bad practices, then propose safe fixes — fully offline on Snapdragon X.

---

## 🚨 Problem we’re solving
AI-accelerated coding ships features faster than security and compliance can review. Vibecoder (and even busy devs) miss subtle backdoors, secrets, or leaky patterns. Traditional cloud scanners are noisy and can’t run in sensitive environments.

## 💡 Solution
**LocalSentinel.ai** runs entirely on-device to analyze your repo. It fuses deterministic scanners with a small local LLM to explain risk and draft minimal, safe diffs. The output is a **deal-ready report** with risk score, R/Y/G flags, evidence, and optional SBOM/license metadata.

## ⚡️ Edge/NPU Acceleration
- Runs the LLM and embeddings locally on **Copilot+ PCs (Snapdragon® X Series)**
- Uses **ONNX Runtime with the QNN Execution Provider (NPU acceleration)**
- Static scans, triage, and reporting are all local
- Internet is **optional** (only needed for rule/DB refresh)

---

## 🛠️ What We Built (Hackathon MVP)
- ✅ **Windows app (.EXE/.MSIX) + CLI** to scan repos fully offline
- ✅ **Rule runners** (Semgrep, Bandit, secrets, CVE snapshot) → unified JSON
- ✅ **On-device SLM** ranks issues, explains impact, drafts patch diffs
- ✅ **HTML/PDF Attestation Pack** with risk score, evidence links, timing, and NPU log

---

## 🔑 Why It’s Novel
- **Private, edge-first**: no code ever leaves the device  
- **Fix-oriented output**: minimal safe patches, not just alerts  
- **Standardized attestation**: tailored for M&A/vendor due diligence

---

## 👤 Team
- **Harris Hamid**: hhamid@stevens.edu  
- **Ivan Farfand Diaz**: ifarfand@stevens.edu  
- **Akbar Pathan**: apathan5@stevens.edu
- **Azhar Pathan**: apathan4@stevens.edu  
- **Emran Nasseri**: enasseri@stevens.edu

## Required Technologies
- Python 3.12
- Rust, Cargo
- JavaScript, Node.js

## Installation Guide
- Download LM Studio (https://lmstudio.ai/)
  - Download a model (we used deepseak-coder-v2-lite-instruct)
  - Go to the Developer section
  - Load in the Model
  - Go to settings and enable headless version
- Install Code2prompt (https://github.com/mufeedvh/code2prompt)
  
---
