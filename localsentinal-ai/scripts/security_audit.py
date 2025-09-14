#!/usr/bin/env python3
"""
Security Audit LM Studio Client
Sends code for security analysis using the comprehensive audit framework
"""

import json
import requests
import sys
from pathlib import Path
from typing import Dict, Any, Optional

class SecurityAuditClient:
    def __init__(self, lm_studio_url: str = "http://localhost:1234/v1/chat/completions"):
        self.lm_studio_url = lm_studio_url
        self.audit_framework = """Comprehensive Security Audit Framework
Overview
This framework provides a systematic approach to security auditing with clear severity classifications, consistent reporting standards, and actionable remediation guidance.
Classification System
🛑 RED (Critical - Immediate Action Required)
Risk Level: High - Must be fixed immediately
 Impact: Direct exploitability, immediate security breach potential
Categories & Examples:
Secrets and Credentials:
AWS keys (AKIA...), Google Cloud keys, Azure keys
Private keys (-----BEGIN PRIVATE KEY-----), SSH keys
Database passwords, connection strings, service account tokens
OAuth tokens, Slack/Twilio API secrets, Stripe/PayPal keys
Code Injection / Remote Execution:
SQL injection via string concatenation or f-strings
OS command injection (subprocess with shell=True, os.system)
Deserialization of untrusted input (pickle.load, yaml.load without SafeLoader)
Arbitrary code execution (eval, exec with user input)
Unsafe Crypto or Authentication:
Hardcoded master passwords
Insecure default credentials in config files
Exploitability Criteria: If an attacker can directly use this to steal data, escalate privileges, or run code → RED

⚠️ YELLOW (Moderate - Should Be Addressed)
Risk Level: Low to Medium - Should be reviewed and fixed as needed
 Impact: Degrades security posture, increases risk when combined with other vulnerabilities
Categories & Examples:
Weak Cryptography:
MD5, SHA1, DES, RC4 usage
Use of non-cryptographic randomness (random.random()) in security contexts
Insecure Protocols / Libraries:
telnetlib, ftplib, http (instead of https)
Deprecated libraries still in use
Suspicious Practices:
Hardcoded test credentials (user:test, password:1234)
Base64-encoded strings that may hide secrets
Sensitive data logged to console/files without masking
Exploitability Criteria: Issues that moderately degrade security posture, may increase risk if combined with other vulnerabilities → YELLOW

✅ GREEN (Secure - No Issues Detected)
Risk Level: None - Code is secure and compliant
 Impact: Best practices followed, no security concerns
Categories & Examples:
Secure and Clean Code:
No secrets or credentials exposed
Use of strong cryptography and secure protocols
No code injection or unsafe execution patterns
Best Practices Followed:
Proper debugging and development settings (debug mode off in production)
No sensitive data leakage
Up-to-date and secure libraries in use
Exploitability Criteria: No security concerns detected, code is considered secure and compliant → GREEN

Report Structure
Section 1: Executive Dashboard
Purpose: One-page executive summary for leadership and stakeholders
Required Components:
Project Overview
3-5 sentence summary covering project purpose, scope, and audit methodology
Clear statement of audit coverage and limitations
Security Score
Overall security score out of 100
Weighted calculation based on severity distribution:
RED flags: Heavy negative weight
YELLOW flags: Moderate negative weight
GREEN flags: Positive weight
Visual Summary
Pie chart showing percentage breakdown of Red/Yellow/Green flags
Clear legend and percentages displayed
Flag Summary
Total count for each severity level
Severity icons (🛑 ⚠️ ✅) prominently displayed
Brief impact statement for each category
Section 2: Detailed Findings
Purpose: Technical analysis for development teams and security professionals
Organization:
Severity-First Ordering: RED → YELLOW → GREEN
Consistent Format: All findings follow the same structure
Red Flag Format:
File Path: Complete path and line range
Issue Title: Clear, descriptive heading with 🛑 icon
Criticality Explanation: Why this requires immediate attention
Exploitability Analysis: How an attacker could leverage this
Code Context: Relevant code snippets when helpful
Patch Diff: When available and applicable
Yellow Flag Format:
File Location: Path and specific line numbers
Issue Description: Clear explanation with ⚠️ icon
Risk Assessment: Why this matters and potential impact
Timeline Guidance: Suggested resolution timeframe
Improvement Recommendations: Specific steps to address
Code Examples: Before/after when applicable
Green Flag Format:
File Reference: Location of secure implementation
Best Practice Note: What was done correctly with ✅ icon
Educational Value: Why this is a good example
Improvement Suggestions: Optional enhancements
Section 3: Remediation Guide
Purpose: Actionable solutions and implementation guidance
Organization:
By Severity: RED issues first, then YELLOW
By Category: Group similar issue types together
Progressive Detail: High-level strategy → specific implementation
Remediation Format:
For each finding:
Issue Summary
What the problem is
Where it occurs (file, line)
Why it matters (business/technical impact)
Solution Strategy
High-level approach to resolution
Alternative approaches when applicable
Dependencies and prerequisites
Implementation Steps
Step-by-step instructions in plain English
Code examples and snippets
Configuration changes required
Testing and validation steps
Verification
How to confirm the fix works
Regression testing considerations
Monitoring and alerting setup

Audit Guidelines
Scope Definition
Clearly define what code/systems are included
Document any exclusions or limitations
Specify audit methodology and tools used
Consistency Standards
Use standardized terminology throughout
Maintain consistent severity classification
Apply uniform formatting and structure
Quality Assurance
All findings must include specific file/line references
Solutions must be actionable and testable
Technical accuracy verified before publication
Communication Principles
Developer-Focused: Actionable, technical guidance
Business-Aware: Clear risk communication for leadership
No Assumptions: Self-contained explanations
Solution-Oriented: Every problem includes a path to resolution

Operational Rules
Response Standards
Maintain professional, technical tone throughout
Provide specific, actionable feedback only
Focus exclusively on security-related findings
No conversational elements or role-playing
Technical Boundaries
No external API calls or cloud lookups
No assumptions about infrastructure not visible in code
Stick to static code analysis findings only
Document limitations clearly
Reporting Discipline
Complete all sections for every audit
Maintain consistent formatting and structure
Verify all file paths and line numbers
Include confidence levels for complex findings"""

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

    def run_audit(self, file_path: str, output_file: str = "security_audit_report.json", 
                  lm_studio_url: Optional[str] = None) -> None:
        """Run the complete security audit process"""
        
        # Update LM Studio URL if provided
        if lm_studio_url:
            self.lm_studio_url = lm_studio_url
        
        print("=" * 60)
        print("🛡️  Security Audit Framework - LM Studio Client")
        print("=" * 60)
        
        # Get code content from file
        print(f"Reading code from file: {file_path}")
        code_content = self.read_code_file(file_path)
        
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
            print("📊 AUDIT RESULTS")
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
    parser.add_argument("--output", "-o", default="security_audit_report.json", 
                       help="Output file for audit report (JSON format)")
    parser.add_argument("--url", "-u", default="http://127.0.0.1:1234/v1/chat/completions",
                       help="LM Studio API URL")
    
    args = parser.parse_args()
    
    # Create client
    client = SecurityAuditClient(args.url)
    
    # Run audit with the provided file
    client.run_audit(args.file, args.output, args.url)

if __name__ == "__main__":
    main()