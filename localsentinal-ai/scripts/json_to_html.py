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

    # Start building HTML
    output_html = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Security Report Data</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            margin: 40px;
            background-color: #f5f5f5;
            color: #333;
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
        }
        ul, ol {
            margin: 10px 0;
            padding-left: 25px;
        }
        li {
            margin: 8px 0;
            padding: 5px 0;
        }
        strong {
            color: #2980b9;
            font-weight: 600;
        }
        .top-level {
            background: #ecf0f1;
            padding: 15px;
            margin: 10px 0;
            border-radius: 5px;
            border-left: 4px solid #3498db;
        }
        .vulnerability-critical {
            border-left-color: #e74c3c;
            background: #fdf2f2;
        }
        .vulnerability-moderate {
            border-left-color: #f39c12;
            background: #fef9e7;
        }
        .secure-implementation {
            border-left-color: #27ae60;
            background: #eafaf1;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Security Report Data Structure</h1>
        <div class="data-content">
'''

    # Process each top-level key-value pair
    for key, value in data.items():
        # Add special styling based on key names
        css_class = "top-level"
        if "critical" in key.lower():
            css_class += " vulnerability-critical"
        elif "moderate" in key.lower():
            css_class += " vulnerability-moderate"
        elif "secure" in key.lower():
            css_class += " secure-implementation"

        output_html += f'        <div class="{css_class}">\n'
        output_html += f'            <strong style="font-size: 1.2em;">{key}</strong>: {format_value(value, 3)}\n'
        output_html += f'        </div>\n'

    # Close HTML
    output_html += '''        </div>
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