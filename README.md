# LocalSentinel.ai — On-device Code Compliance Scanner

> Scan a repo locally, find hidden backdoors/data-leaks/bad practices, then propose safe fixes — fully offline on Snapdragon X.

---

## 🚨 Problem we’re solving
AI-accelerated coding ships features faster than security and compliance can review. Vibecoder (and even busy devs) miss subtle backdoors, secrets, or leaky patterns. Traditional cloud scanners are noisy and can’t run in sensitive environments.

## 💡 Solution
**LocalSentinel.ai** runs entirely on-device to analyze your repo. It generates a report based on the vulnerabilities and possible improvements of your code in plan English - no advanced skills to understand your code needed

## ⚡️ Edge/NPU Acceleration
- Runs the LLM and embeddings locally on **Copilot+ PCs (Snapdragon® X Series)**
- Static scans, triage, and reporting are all local

---

## 🛠️ What We Built (Hackathon MVP)
- ✅ **Visual Studio Code Extension** to scan repos fully offline
- ✅ **Security Report Output** with risk score, evidence links, and suggested fixes

---

## 🔑 Why It’s Novel
- **Private, edge-first**: no code ever leaves the device  
- **Fix-oriented output**: code recommendations, not just alerts.
  
---

## 👤 Team
- **Harris Hamid**: hhamid@stevens.edu  
- **Ivan Farfan Diaz**: ifarfand@stevens.edu  
- **Akbar Pathan**: apathan5@stevens.edu
- **Azhar Pathan**: apathan4@stevens.edu  
- **Emran Nasseri**: enasseri@stevens.edu

## Required Technologies
- Python 3.12
- [Rust](https://rust-lang.org/tools/install) and `Cargo`.
- JavaScript, Node.js

## Installation Guide
- Download [LM Studio](https://lmstudio.ai/)
  - Download a model (we used DeepSeek-coder-v2-lite-instruct)
  - Go to the Developer section
  - Load in the Model
  - Customize Context Length under **Load settings** (We recommend 12,000 tokens)
  - Go to settings and enable **Local LLM Service (headless)**
- Install [Code2prompt](https://github.com/IvanFarfan08/code2prompt)
```sh
git clone https://github.com/IvanFarfan08/code2prompt
cd code2prompt/
cargo install --path crates/code2prompt
```
- Install LocalSentinel.ai extension by downloading the [latest release](https://github.com/HarrisHamid/LocalSentinel.ai/releases/tag/v0.0.1)
  - Open VSC and click on **Install from VSIX** and pick the downloaded file.
---
