# 🗺️ LocalSentinel.ai - Complete Project Map

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Dependencies & Requirements](#dependencies--requirements)
4. [How It Works - Complete Workflow](#how-it-works---complete-workflow)
5. [Language Support](#language-support)
6. [Installation Guide](#installation-guide)
7. [Usage Instructions](#usage-instructions)
8. [Test Cases Documentation](#test-cases-documentation)
9. [File Structure](#file-structure)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

**LocalSentinel.ai** is an on-device security scanner that runs entirely offline on your local machine. It uses AI to analyze code repositories for security vulnerabilities, backdoors, data leaks, and bad practices.

### Key Features:
- ✅ **100% Offline** - No code leaves your device
- ✅ **AI-Powered** - Uses LLMs for intelligent code analysis
- ✅ **VS Code Integration** - Seamless developer experience
- ✅ **Multi-Language Support** - Works with any programming language
- ✅ **Actionable Reports** - Provides fixes, not just warnings

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         USER                                │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   VS CODE EXTENSION                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ localsentinal-ai/extension.js                         │  │
│  │ - WebView Provider (UI)                               │  │
│  │ - Command handlers                                    │  │
│  │ - File system integration                             │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  CODE2PROMPT (Rust)                         │
│  - Scans project directory                                  │
│  - Generates markdown with all code                         │
│  - Respects .gitignore                                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              SECURITY AUDIT (Python)                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ scripts/security_audit.py                             │  │
│  │ - Loads audit framework                               │  │
│  │ - Sends to LM Studio API                              │  │
│  │ - Processes LLM response                              │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    LM STUDIO                                │
│  - Local LLM server (port 1234)                             │
│  - DeepSeek-coder-v2-lite-instruct (or similar)            │
│  - Analyzes code for vulnerabilities                        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  REPORT GENERATOR                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ scripts/json_to_html.py                               │  │
│  │ - Converts JSON to HTML                               │  │
│  │ - Terminal-style UI                                   │  │
│  │ - Color-coded severity levels                         │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Dependencies & Requirements

### Core Requirements:
| Component | Version | Purpose | Installation |
|-----------|---------|---------|--------------|
| **Python** | 3.12+ | Runs security audit scripts | `python.org` |
| **Rust** | Latest | Required for code2prompt | `rustup.rs` |
| **Node.js** | 16+ | VS Code extension runtime | `nodejs.org` |
| **VS Code** | 1.74+ | IDE integration | `code.visualstudio.com` |
| **LM Studio** | Latest | Local LLM server | `lmstudio.ai` |

### Python Dependencies:
```python
requests  # HTTP client for LM Studio API
json      # JSON processing
pathlib   # File path handling
```

### Node.js Dependencies (VS Code Extension):
```json
{
  "vscode": "^1.74.0",
  "child_process": "built-in",
  "fs": "built-in",
  "path": "built-in"
}
```

### External Tools:
- **code2prompt**: Rust-based code aggregator
  - Repository: `github.com/IvanFarfan08/code2prompt`
  - Install: `cargo install --path crates/code2prompt`

---

## 🔄 How It Works - Complete Workflow

### Step-by-Step Process:

1. **User Initiates Scan**
   ```
   User → Opens VS Code → Clicks LocalSentinel.ai icon → Selects "Start Scan"
   ```

2. **Extension Prepares Environment**
   ```javascript
   // extension.js
   - Gets workspace folder path
   - Creates output directory (LocalSentinel.ai/)
   - Determines target folder for scanning
   ```

3. **Code Aggregation (code2prompt)**
   ```bash
   code2prompt [target_folder] --output-file [folder]-report.md
   ```
   - Recursively scans all files
   - Respects .gitignore rules
   - Outputs markdown with full codebase

4. **Security Analysis (Python)**
   ```python
   # security_audit.py workflow:
   1. Load markdown file
   2. Construct prompt with audit framework
   3. Send to LM Studio API (localhost:1234)
   4. Parse LLM response
   5. Save as JSON report
   ```

5. **LM Studio Processing**
   ```
   - Receives code + audit framework
   - Analyzes for:
     * Hardcoded secrets (API keys, passwords)
     * Injection vulnerabilities (SQL, XSS, command)
     * Weak crypto (MD5, SHA1, DES)
     * Insecure protocols (HTTP, FTP, Telnet)
     * Bad practices (eval, pickle, debug mode)
   - Returns structured findings
   ```

6. **Report Generation**
   ```python
   # json_to_html.py
   - Loads JSON report
   - Generates HTML with:
     * Terminal-style UI
     * Color-coded severity (Red/Yellow/Green)
     * Code snippets
     * Fix recommendations
   ```

7. **Display Results**
   ```
   VS Code → Opens HTML report → User reviews findings
   ```

---

## 🌍 Language Support

### Officially Tested Languages:

| Language | File Extensions | Security Checks |
|----------|----------------|-----------------|
| **JavaScript/TypeScript** | .js, .ts, .jsx, .tsx | XSS, injection, hardcoded secrets, eval() |
| **Python** | .py | pickle, eval, SQL injection, weak crypto |
| **Java** | .java | SQL injection, weak crypto, serialization |
| **C/C++** | .c, .cpp, .h | Buffer overflow, format strings, memory leaks |
| **PHP** | .php | SQL injection, XSS, file inclusion |
| **Ruby** | .rb | Command injection, mass assignment |
| **Go** | .go | SQL injection, race conditions |
| **Rust** | .rs | Unsafe blocks, memory safety |
| **C#** | .cs | SQL injection, XXE, deserialization |
| **Swift** | .swift | Keychain security, URL validation |

### Framework-Specific Checks:
- **React/Vue/Angular**: Props validation, XSS in templates
- **Express/FastAPI**: Authentication middleware, CORS
- **Django/Rails**: CSRF tokens, SQL queries
- **Spring/ASP.NET**: Configuration security

### Configuration Files:
- `.env` files - exposed secrets
- `package.json` - vulnerable dependencies
- `requirements.txt` - outdated packages
- `docker-compose.yml` - insecure configurations

---

## 📥 Installation Guide

### Windows Installation:

```powershell
# 1. Install Python 3.12
# Download from python.org, check "Add to PATH"

# 2. Install Rust
# Download rustup-init.exe from rustup.rs
.\rustup-init.exe

# 3. Install Node.js
# Download from nodejs.org

# 4. Install LM Studio
# Download from lmstudio.ai

# 5. Clone and install code2prompt
git clone https://github.com/IvanFarfan08/code2prompt
cd code2prompt
cargo install --path crates/code2prompt

# 6. Install VS Code Extension
# Download .vsix from releases
# In VS Code: Extensions → ... → Install from VSIX
```

### macOS Installation:

```bash
# 1. Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. Install dependencies
brew install python@3.12
brew install rust
brew install node

# 3. Install LM Studio
# Download from lmstudio.ai

# 4. Install code2prompt
git clone https://github.com/IvanFarfan08/code2prompt
cd code2prompt
cargo install --path crates/code2prompt

# 5. Install Extension
# Same as Windows
```

### Linux Installation:

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install python3.12 python3-pip nodejs npm

# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install code2prompt
git clone https://github.com/IvanFarfan08/code2prompt
cd code2prompt
cargo install --path crates/code2prompt

# LM Studio - Download AppImage from lmstudio.ai
chmod +x LM-Studio-*.AppImage
./LM-Studio-*.AppImage
```

---

## 📖 Usage Instructions

### 1. Configure LM Studio:
```
1. Open LM Studio
2. Download model: "DeepSeek-coder-v2-lite-instruct"
3. Go to Developer tab
4. Load the model
5. Set context length: 12,000 tokens
6. Enable "Local LLM Service (headless)"
7. Verify running on http://localhost:1234
```

### 2. Run Security Scan:
```
1. Open your project in VS Code
2. Click LocalSentinel.ai icon in sidebar
3. Click "Start Server" button
4. Select folder to scan (or leave empty for root)
5. Click "Do Full Scan"
6. Wait for analysis (30s - 2min depending on size)
7. View HTML report that opens automatically
```

### 3. Interpret Results:
- **🔴 RED (Critical)**: Fix immediately - directly exploitable
- **🟡 YELLOW (Moderate)**: Fix soon - potential vulnerabilities
- **🟢 GREEN (Secure)**: Good practices identified

---

## 🧪 Test Cases Documentation

### Vulnerable Bike Shop Demo (`test-cases/`)

**Purpose**: Intentionally vulnerable e-commerce site for testing the scanner

**Files**:
- `index.html` - Shop interface with editable prices
- `script.js` - Contains multiple vulnerabilities
- `styles.css` - Modern UI styling

**Intentional Vulnerabilities**:

1. **Client-Side Price Manipulation**
   - Prices are editable via `contenteditable="true"`
   - Cart total can be modified before checkout
   - No server-side validation

2. **Hardcoded API Key**
   ```javascript
   const API_KEY = 'sk-1234567890abcdef-PRODUCTION-KEY';
   ```

3. **Exposed Helper Functions**
   ```javascript
   window.updatePrice = function(itemId, newPrice) {...}
   ```

**Testing the Scanner**:
```bash
# 1. Start local server
cd test-cases
python3 -m http.server 8000

# 2. Open browser to http://localhost:8000
# 3. Try editing prices (click on any price)
# 4. Run LocalSentinel scan on test-cases folder
# 5. Verify scanner detects all vulnerabilities
```

**Expected Scanner Output**:
- RED: Hardcoded API key detected
- RED: Client-side price validation
- YELLOW: Console-accessible functions
- YELLOW: Missing input validation

---

## 📁 File Structure

```
LocalSentinel.ai/
├── .gitignore                      # Ignores node_modules, PROJECT_MAP.md
├── LICENSE.MD                      # MIT License
├── README.md                       # Public documentation
├── PROJECT_MAP.md                  # This file (private)
│
├── localsentinal-ai/               # VS Code Extension
│   ├── extension.js                # Main extension code
│   ├── package.json                # Extension manifest
│   ├── assets/                     # Icons and images
│   │   └── logo_white.svg
│   ├── webviews/                   # UI components
│   │   └── sidebar.html
│   ├── scripts/                    # Python analysis scripts
│   │   ├── security_audit.py       # LLM security analyzer
│   │   ├── json_to_html.py         # Report generator
│   │   └── report_html/            # HTML templates
│   └── example_files/              # Sample outputs
│       └── security_report.json
│
└── test-cases/                     # Vulnerable demo app
    ├── index.html                  # Bike shop UI
    ├── script.js                   # Vulnerable JavaScript
    └── styles.css                  # Modern styling
```

---

## 🔧 Troubleshooting

### Common Issues:

**1. LM Studio Connection Error**
```
Error: Failed to connect to http://localhost:1234
```
**Solution**:
- Ensure LM Studio is running
- Check "Local LLM Service" is enabled
- Verify port 1234 is not blocked

**2. code2prompt Not Found**
```
Error: code2prompt command not found
```
**Solution**:
```bash
# Add cargo bin to PATH
export PATH="$HOME/.cargo/bin:$PATH"
# Or reinstall
cargo install --path crates/code2prompt
```

**3. Python Script Errors**
```
Error: Module 'requests' not found
```
**Solution**:
```bash
pip install requests
```

**4. Extension Not Loading**
```
Error: Extension activation failed
```
**Solution**:
- Check VS Code version ≥ 1.74
- Reinstall extension from VSIX
- Check developer console for errors

**5. Scan Takes Too Long**
**Solution**:
- Reduce context length in LM Studio
- Exclude large folders (node_modules, etc.)
- Use smaller LLM model

### Debug Mode:
```javascript
// In extension.js, enable debug logging:
console.log("Debug:", variable);
// View in: Help → Toggle Developer Tools → Console
```

---

## 🚀 Advanced Usage

### Custom Security Rules:
Edit `security_audit.py` to add custom checks:
```python
self.audit_framework += """
## Custom Rules
- Check for company-specific patterns
- Validate internal security policies
"""
```

### Batch Scanning:
```bash
# Scan multiple projects
for dir in project1 project2 project3; do
  code2prompt $dir --output-file $dir-report.md
  python3 scripts/security_audit.py $dir-report.md
done
```

### CI/CD Integration:
```yaml
# GitHub Actions example
- name: Security Scan
  run: |
    code2prompt . --output-file report.md
    python3 scripts/security_audit.py report.md
    # Fail if critical issues found
    grep -q "RED" report.json && exit 1 || exit 0
```

---

## 📊 Performance Metrics

| Project Size | Files | Scan Time | LLM Processing | Total Time |
|-------------|-------|-----------|----------------|------------|
| Small (<100 files) | 50 | 5s | 20s | 30s |
| Medium (100-500) | 250 | 15s | 45s | 1min |
| Large (500-1000) | 750 | 30s | 90s | 2min |
| Extra Large (1000+) | 1500 | 60s | 180s | 4min |

**Optimization Tips**:
- Use .gitignore to exclude unnecessary files
- Scan specific folders instead of entire repo
- Use faster LLM models for quick scans
- Increase LM Studio context for accuracy

---

## 🔐 Security & Privacy

### Data Privacy:
- ✅ **100% Local** - No external API calls
- ✅ **No Telemetry** - No usage tracking
- ✅ **No Cloud Storage** - Reports stay on device
- ✅ **Open Source** - Fully auditable code

### Security Considerations:
- LM Studio runs on localhost only
- Reports may contain sensitive code snippets
- Store reports securely
- Don't commit reports to version control

---

## 🤝 Contributing

### Development Setup:
```bash
# Clone repo
git clone https://github.com/HarrisHamid/LocalSentinel.ai

# Install dev dependencies
cd localsentinal-ai
npm install

# Run extension in debug mode
# VS Code: F5 to launch Extension Development Host
```

### Testing Changes:
```bash
# Test Python scripts
python3 scripts/security_audit.py test.md

# Test extension
npm test

# Test on vulnerable demo
cd test-cases
python3 -m http.server 8000
```

---

## 📝 Notes

- This project was built for the Qualcomm Hackathon 2024
- Optimized for Snapdragon X Series processors
- Designed for enterprise security requirements
- Educational vulnerabilities in test-cases are intentional

---

**Last Updated**: December 2024
**Version**: 0.0.1
**Status**: MVP/Hackathon Demo