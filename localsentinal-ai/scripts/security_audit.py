#!/usr/bin/env python3
"""
Security Audit LM Studio Client
Sends code for security analysis using the comprehensive audit framework
"""

import json
import requests
import sys
import io
from pathlib import Path
from typing import Dict, Any, Optional

# Set UTF-8 encoding for stdout to handle emojis on Windows
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

class SecurityAuditClient:
    def __init__(self, lm_studio_url: str = "http://localhost:1234/v1/chat/completions"):
        self.lm_studio_url = lm_studio_url
        self.audit_framework = """# Security Audit Framework

## Severity Levels
- RED (Critical – Fix Now)  
  Directly exploitable → immediate risk.  
  Examples: API/DB/SSH keys, OAuth tokens, SQL/OS injection, unsafe `eval`/`pickle`, hardcoded master passwords.  

- YELLOW (Moderate – Fix Soon)  
  Weakens posture, exploitable in combination.  
  Examples: MD5/SHA1/DES, `random.random()` in security, telnet/ftp/http, deprecated libs, test creds, logging sensitive data.  

- GREEN (Secure)  
  No issues, best practices followed.  
  Examples: strong crypto, HTTPS, no secrets, debug off in prod, updated libs.  

---

## Report Format
1. Executive Dashboard  
   - 3–5 sentence project summary (scope/limits).  
   - Security score (0–100).  
   - Pie chart + counts (Red/Yellow/Green).  

2. Detailed Findings (ordered RED → YELLOW → GREEN)  
   - RED: file/line, issue, why critical, exploit path, code snippet, fix.  
   - YELLOW: file/line, issue, risk, timeline, fix steps.  
   - GREEN: file/line, good practice, why secure.  

3. Remediation Guide  
   - Group by severity → issue type.  
   - Each: summary, strategy, steps, verification.  

---

## Guidelines
- Define scope and exclusions.  
- Use consistent terminology and format.  
- All findings must be actionable and testable.  
- Tone: professional, developer-focused, risk-clear.  
- Only report visible code issues; no assumptions.  
"""

    def read_code_file(self, file_path: str) -> str:
        """Read code content from a file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read()
        except FileNotFoundError:
            print(f"Error: File '{file_path}' not found")
            sys.exit(1)
        except Exception as e:
            print(f"Error reading file '{file_path}': {e}")
            sys.exit(1)


    def create_audit_prompt(self, code_content: str) -> str:
        """Combine the audit framework with code content"""
        prompt = f"""You are a security auditor. Use this comprehensive framework to analyze the provided code:

{self.audit_framework}

Now analyze this code and provide a complete security audit report in JSON format following this structure:

```
{code_content}
```

Please provide your response in the following JSON format:
{{
    "project_name": "Project name extracted from the code or path",
    "total_files": number_of_files_scanned,
    "project_overview": "3-5 sentence summary covering project purpose, scope, and audit methodology",
    "security_score": number_out_of_100,
    "vulnerabilities": {{
        "critical": {{
            "count": number_of_critical_issues,
            "items": [
                {{
                    "file": "file_path",
                    "line": line_number,
                    "issue": "Issue title",
                    "description": "Detailed description of the vulnerability",
                    "immediate_actions": "Specific actions to take immediately to fix this issue",
                    "how_to_fix": "Step-by-step instructions to remediate this vulnerability",
                    "code_snippet": "Relevant code if applicable"
                }}
            ]
        }},
        "moderate": {{
            "count": number_of_moderate_issues,
            "items": [
                {{
                    "file": "file_path",
                    "line": line_number,
                    "issue": "Issue title",
                    "description": "Detailed description of the vulnerability",
                    "remediation": "Steps to address this issue",
                    "how_to_fix": "Step-by-step instructions to remediate this vulnerability"
                }}
            ]
        }}
    }},
    "secure_implementations": {{
        "count": number_of_secure_items,
        "items": [
            {{
                "file": "file_path",
                "description": "Brief description of what was done correctly"
            }}
        ]
    }}
}}

Focus on:
1. Security vulnerabilities, exposed secrets, injection risks, and insecure practices
2. Logic errors - code that may technically work but doesn't make sense in the program's context
3. Business logic flaws - implementations that could lead to unintended behavior
4. Context-specific issues - code that might be secure in isolation but problematic in this specific application

Return ONLY valid JSON, no additional text."""
        
        return prompt

    def create_payload(self, prompt: str, model: str = "local-model", max_tokens: int = 4000) -> Dict[str, Any]:
        """Create the JSON payload for LM Studio API"""
        return {
            "model": model,
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "max_tokens": max_tokens,
            "temperature": 0.1,  # Low temperature for consistent security analysis
            "stream": False
        }

    def send_request(self, payload: Dict[str, Any]) -> Optional[str]:
        """Send request to LM Studio API"""
        try:
            print(f"Sending request to {self.lm_studio_url}...")
            response = requests.post(
                self.lm_studio_url,
                headers={
                    "Content-Type": "application/json"
                },
                json=payload,
                timeout=300  # 5 minute timeout
            )
            
            if response.status_code == 200:
                data = response.json()
                content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
                
                # Extract JSON from content if it's wrapped in markdown code blocks
                if content:
                    # Remove markdown code blocks if present
                    if "```json" in content:
                        start = content.find("```json") + 7
                        end = content.rfind("```")
                        if end > start:
                            content = content[start:end].strip()
                    elif "```" in content:
                        # Handle generic code blocks
                        start = content.find("```") + 3
                        end = content.rfind("```")
                        if end > start:
                            content = content[start:end].strip()
                
                return content
            else:
                print(f"Error: API returned status code {response.status_code}")
                print(f"Response: {response.text}")
                return None
                
        except requests.exceptions.ConnectionError:
            print("Error: Could not connect to LM Studio. Make sure it's running on the specified URL.")
            return None
        except requests.exceptions.Timeout:
            print("Error: Request timed out. The model might be taking too long to respond.")
            return None
        except Exception as e:
            print(f"Error sending request: {e}")
            return None

    def save_results(self, results: str, output_file: str = "security_audit_report.json") -> None:
        """Save audit results to file"""
        try:
            # Try to parse and format JSON
            try:
                json_data = json.loads(results)
                formatted_json = json.dumps(json_data, indent=2, ensure_ascii=False)
                with open(output_file, 'w', encoding='utf-8') as f:
                    f.write(formatted_json)
                print(f"Audit report saved to: {output_file}")
            except json.JSONDecodeError:
                # If not valid JSON, save as is
                with open(output_file, 'w', encoding='utf-8') as f:
                    f.write(results)
                print(f"Warning: Response was not valid JSON. Saved raw output to: {output_file}")
        except Exception as e:
            print(f"Error saving results: {e}")

    def run_audit(self, file_path: str, output_file: str = None, 
                  lm_studio_url: Optional[str] = None) -> None:
        """Run the complete security audit process"""
        
        # Update LM Studio URL if provided
        if lm_studio_url:
            self.lm_studio_url = lm_studio_url
        
        print("=" * 60)
        print("Security Audit Framework - LM Studio Client")
        print("=" * 60)
        
        # Get code content from file
        print(f"Reading code from file: {file_path}")
        code_content = self.read_code_file(file_path)
        
        # Generate output filename based on input file if not provided
        if output_file is None:
            # Extract the base name from the input file
            base_name = Path(file_path).stem
            # Find the LocalSentinel.ai folder
            current_dir = Path(file_path).parent
            while current_dir.name != "LocalSentinel.ai" and current_dir.parent != current_dir:
                current_dir = current_dir.parent
            
            # If LocalSentinel.ai folder found, use it; otherwise use the same directory as input
            if current_dir.name == "LocalSentinel.ai":
                output_dir = current_dir
            else:
                output_dir = Path(file_path).parent
            
            # Create output filename with _audit_report.json suffix
            output_file = str(output_dir / f"{base_name}_audit_report.json")
        
        # Create audit prompt
        print("Creating audit prompt with framework...")
        full_prompt = self.create_audit_prompt(code_content)
        
        # Create API payload
        payload = self.create_payload(full_prompt)
        
        print(f"Prompt length: {len(full_prompt)} characters")
        print(f"Target API: {self.lm_studio_url}")
        
        # Send request
        results = self.send_request(payload)
        
        if results:
            print("\n" + "=" * 60)
            print("AUDIT RESULTS")
            print("=" * 60)
            
            # Try to parse and display JSON summary
            try:
                json_data = json.loads(results)
                print(f"Project: {json_data.get('project_name', 'Unknown')}")
                print(f"Security Score: {json_data.get('security_score', 'N/A')}/100")
                print(f"Total Files Scanned: {json_data.get('total_files', 0)}")
                print(f"Critical Issues: {json_data.get('vulnerabilities', {}).get('critical', {}).get('count', 0)}")
                print(f"Moderate Issues: {json_data.get('vulnerabilities', {}).get('moderate', {}).get('count', 0)}")
                print(f"Secure Implementations: {json_data.get('secure_implementations', {}).get('count', 0)}")
            except json.JSONDecodeError:
                print("Warning: Could not parse JSON response")
                print(results[:500] + "..." if len(results) > 500 else results)
            
            # Save results
            self.save_results(results, output_file)
            
        else:
            print("Failed to get audit results from LM Studio")

def main():
    """Main function with command line argument handling"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Security Audit using LM Studio")
    parser.add_argument("file", help="Path to markdown file containing code summary to audit")
    parser.add_argument("--output", "-o", default=None, 
                       help="Output file for audit report (JSON format). If not specified, will use input filename with _audit_report.json suffix")
    parser.add_argument("--url", "-u", default="http://127.0.0.1:1234/v1/chat/completions",
                       help="LM Studio API URL")
    
    args = parser.parse_args()
    
    # Create client
    client = SecurityAuditClient(args.url)
    
    # Run audit with the provided file
    client.run_audit(args.file, args.output, args.url)

if __name__ == "__main__":
    main()