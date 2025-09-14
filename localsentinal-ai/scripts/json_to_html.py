import json
import os

def format_value(value, indent_level=0):
    """Recursively format JSON values into HTML with proper indentation."""
    indent = "  " * indent_level

    if isinstance(value, dict):
        html = f"\n{indent}<ul>\n"
        for key, val in value.items():
            html += f"{indent}  <li><strong>{key}</strong>: {format_value(val, indent_level + 2)}</li>\n"
        html += f"{indent}</ul>"
        return html
    elif isinstance(value, list):
        if not value:  # Empty list
            return "[]"
        html = f"\n{indent}<ol>\n"
        for i, item in enumerate(value):
            if isinstance(item, dict):
                html += f"{indent}  <li>{format_value(item, indent_level + 2)}</li>\n"
            else:
                html += f"{indent}  <li>{item}</li>\n"
        html += f"{indent}</ol>"
        return html
    else:
        return str(value)

def json_to_html(json_file_path, output_html_path):
    """Convert JSON file to HTML with structured list items."""

    # Load JSON data
    try:
        with open(json_file_path, 'r') as file:
            data = json.load(file)
    except FileNotFoundError:
        print(f"Error: JSON file '{json_file_path}' not found.")
        return
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON format - {e}")
        return

    # Start building HTML with terminal styling
    output_html = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LocalSentinel Terminal - Security Report</title>
    <style>
        body {
            font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
            line-height: 1.6;
            margin: 0;
            background: linear-gradient(135deg, #1a2332 0%, #2d3748 100%);
            color: #e2e8f0;
            font-size: 14px;
            min-height: 100vh;
            padding: 20px;
        }
        .terminal-window {
            max-width: 1000px;
            margin: 20px auto;
            background: #1a202c;
            border-radius: 12px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.3);
            overflow: hidden;
            border: 1px solid #2d3748;
        }
        .terminal-header {
            background: #2d3748;
            padding: 12px 20px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #4a5568;
        }
        .traffic-lights {
            display: flex;
            gap: 8px;
            margin-right: 15px;
        }
        .light {
            width: 12px;
            height: 12px;
            border-radius: 50%;
        }
        .light.red { background: #ff5f56; }
        .light.yellow { background: #ffbd2e; }
        .light.green { background: #27ca3f; }
        .terminal-title {
            color: #a0aec0;
            font-weight: 500;
            font-size: 14px;
        }
        .terminal-content {
            padding: 24px;
            background: #1a202c;
        }
        .command-line {
            color: #48bb78;
            margin-bottom: 20px;
            font-weight: 600;
        }
        .command-line::before {
            content: "$ ";
            color: #68d391;
        }
        ul, ol {
            margin: 10px 0;
            padding-left: 25px;
            color: #cbd5e0;
        }
        li {
            margin: 8px 0;
            padding: 5px 0;
            color: #e2e8f0;
        }
        strong {
            color: #90cdf4;
            font-weight: 600;
        }
        .top-level {
            background: rgba(45, 55, 72, 0.3);
            padding: 20px;
            margin: 16px 0;
            border-radius: 8px;
            border-left: 4px solid #4299e1;
        }
        .vulnerability-critical {
            border-left-color: #f56565;
            background: rgba(245, 101, 101, 0.1);
        }
        .vulnerability-moderate {
            border-left-color: #ed8936;
            background: rgba(237, 137, 54, 0.1);
        }
        .secure-implementation {
            border-left-color: #48bb78;
            background: rgba(72, 187, 120, 0.1);
        }
        .section-title {
            color: #f7fafc;
            font-size: 1.2em;
            font-weight: 600;
            margin-bottom: 12px;
        }
        .vulnerability-detail {
            background: rgba(26, 32, 44, 0.8);
            padding: 16px;
            margin: 12px 0;
            border-radius: 6px;
            border: 1px solid #2d3748;
        }
        .file-ref {
            color: #90cdf4;
        }
        .line-ref {
            color: #f687b3;
        }
        .summary-info {
            color: #a0aec0;
            font-size: 13px;
            margin: 4px 0;
        }
        .blink {
            animation: blink 1s infinite;
        }
        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }
        .scan-result {
            margin: 16px 0;
            display: flex;
            align-items: center;
            gap: 8px;
            color: #68d391;
        }
        .icon {
            font-size: 16px;
            width: 20px;
        }
        .data-structure {
            color: #cbd5e0;
            margin-top: 24px;
        }
    </style>
</head>
<body>
    <div class="terminal-window">
        <div class="terminal-header">
            <div class="traffic-lights">
                <div class="light red"></div>
                <div class="light yellow"></div>
                <div class="light green"></div>
            </div>
            <div class="terminal-title">LocalSentinel Terminal - Security Report</div>
        </div>
        <div class="terminal-content">
            <div class="command-line">localsentinel generate-report --format=html</div>
            
            <div class="scan-result">
                <span class="icon">✓</span>
                <span>Report generated successfully</span>
            </div>
            
            <div class="data-structure">
'''

    # Process each top-level key-value pair
    for key, value in data.items():
        # Add special styling based on key names
        css_class = "top-level"
        if "critical" in key.lower() or "vulnerabilities" in key.lower():
            css_class += " vulnerability-critical"
        elif "moderate" in key.lower():
            css_class += " vulnerability-moderate"
        elif "secure" in key.lower():
            css_class += " secure-implementation"

        output_html += f'            <div class="{css_class}">\n'
        output_html += f'                <div class="section-title">{key}</div>\n'
        output_html += f'                <div>{format_value(value, 4)}</div>\n'
        output_html += f'            </div>\n'

    # Close HTML with terminal footer
    output_html += '''            </div>
            
            <div style="margin-top: 24px; color: #4a5568; display: flex; align-items: center; gap: 8px;">
                <span>Report complete</span>
                <span class="blink">█</span>
            </div>
        </div>
    </div>
</body>
</html>'''

    # Save HTML file
    try:
        with open(output_html_path, 'w', encoding='utf-8') as html_file:
            html_file.write(output_html)
        print(f" HTML file successfully created: {output_html_path}")
        print(f" Processed {len(data)} top-level keys from JSON")

        # Print summary of data processed
        print("\n Data Summary:")
        for key, value in data.items():
            if isinstance(value, dict):
                print(f"  • {key}: {len(value)} properties")
            elif isinstance(value, list):
                print(f"  • {key}: {len(value)} items")
            else:
                print(f"  • {key}: {type(value).__name__}")

    except Exception as e:
        print(f" Error writing HTML file: {e}")

def main():
    import sys

    # Accept command line arguments
    if len(sys.argv) > 1:
        json_file = sys.argv[1]
    else:
        json_file = 'security_report.json'

    # Extract filename without extension for folder name
    base_name = os.path.splitext(os.path.basename(json_file))[0]

    # Create report_html directory
    report_dir = 'report_html'
    if not os.path.exists(report_dir):
        os.makedirs(report_dir)
        print(f" Created directory: {report_dir}")

    # Output HTML file in the report_html directory
    html_file = os.path.join(report_dir, f'{base_name}_report.html')

    # Check if JSON file exists
    if not os.path.exists(json_file):
        print(f" Error: '{json_file}' not found")
        return False

    # Convert JSON to HTML
    print(f" Converting {json_file} to {html_file}...")
    json_to_html(json_file, html_file)
    return True

if __name__ == "__main__":
    main()