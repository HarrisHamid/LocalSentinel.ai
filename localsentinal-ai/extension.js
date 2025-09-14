const vscode = require("vscode");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

// WebView Provider for sidebar integration
class LocalSentinalWebviewProvider {
  constructor(context) {
    this._context = context;
    this.serverRunning = false;
    this.selectedFolder = null;
  }

  resolveWebviewView(webviewView, context, _token) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.file(path.join(this._context.extensionPath, "assets")),
        vscode.Uri.file(path.join(this._context.extensionPath, "webviews")),
      ],
    };

    webviewView.webview.html = this.getWebviewContent(webviewView.webview);

    // Handle messages from webview
    webviewView.webview.onDidReceiveMessage(async (message) => {
      switch (message.command) {
        case "startServer":
          try {
            vscode.window.showInformationMessage(
              "🚀 Starting LocalSentinel.ai server..."
            );
            const result = await startServer();
            vscode.window.showInformationMessage(
              `✅ Success! Server is now running on port ${result.port}`
            );
            this.serverRunning = true;
            this.serverPort = result.port;

            // Switch to dashboard view
            this.switchToDashboard();
          } catch (error) {
            vscode.window.showErrorMessage(
              `❌ Failed to start server: ${error.message}`
            );
            webviewView.webview.postMessage({ command: "serverError" });
          }
          break;

        case "showServerStatus":
          if (this.serverRunning && this.serverPort) {
            vscode.window.showInformationMessage(
              `🟢 LocalSentinel.ai server is running on port ${this.serverPort}`
            );
          } else {
            vscode.window.showInformationMessage(
              "⚫ LocalSentinel.ai server is not running"
            );
          }
          break;

        case "doFullScan":
          (async () => {
            try {
              const workspaceFolders = vscode.workspace.workspaceFolders;
              const workspacePath =
                workspaceFolders && workspaceFolders[0]
                  ? workspaceFolders[0].uri.fsPath
                  : null;

              if (!workspacePath) {
                vscode.window.showErrorMessage("No workspace folder is open");
                return;
              }

              // Determine target folder relative to workspace
              const targetFolder = this.selectedFolder || ".";

              // Create output directory if it doesn't exist
              const outputDir = path.join(workspacePath, 'LocalSentinel.ai');
              if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
              }

              // Generate filenames based on target folder
              const folderName = targetFolder === "." ? "root" : targetFolder.replace(/[\/\\]/g, '-');
              const mdOutputPath = path.join(outputDir, `${folderName}-report.md`);

              vscode.window.showInformationMessage(
                `🔍 Starting security scan of: ${targetFolder}`
              );

              // Step 1: Generate markdown report with code2prompt
              const code2promptCommand = `code2prompt ${targetFolder} --output-file "${mdOutputPath}"`;
              console.log("Running code2prompt command:", code2promptCommand);

              exec(code2promptCommand, { cwd: workspacePath }, (error, stdout, stderr) => {
                if (error) {
                  console.error("Code2prompt error:", error);
                  vscode.window.showErrorMessage(
                    `❌ Code analysis failed: ${error.message}`
                  );
                  return;
                }

                console.log("Code2prompt completed, starting security audit...");

                // Step 2: Run security audit on the generated markdown file
                const pythonPath = process.platform === 'win32' ? 'python' : 'python3';
                const scriptPath = path.join(this._context.extensionPath, 'scripts', 'security_audit.py');
                const auditCommand = `${pythonPath} "${scriptPath}" "${mdOutputPath}"`;

                console.log("Running security audit:", auditCommand);
                vscode.window.showInformationMessage(
                  `🔐 Running security audit...`
                );

                exec(auditCommand, { cwd: workspacePath }, (auditError, auditStdout, auditStderr) => {
                  if (auditError) {
                    console.error("Security audit error:", auditError);
                    vscode.window.showWarningMessage(
                      `⚠️ Security audit failed: ${auditError.message}`
                    );
                    // Still open the markdown file even if audit failed
                    vscode.workspace.openTextDocument(mdOutputPath).then((doc) => {
                      vscode.window.showTextDocument(doc);
                    });
                    return;
                  }

                  console.log("Security audit completed, generating HTML report...");

                  // Determine the audit report filename (generated by security_audit.py)
                  const baseName = path.basename(mdOutputPath, '.md');
                  const auditReportPath = path.join(outputDir, `${baseName}_audit_report.json`);

                  // Step 3: Generate HTML report from JSON
                  const htmlScript = path.join(this._context.extensionPath, 'scripts', 'json_to_html.py');
                  const htmlCommand = `${pythonPath} "${htmlScript}" "${auditReportPath}"`;

                  console.log("Running HTML generation command:", htmlCommand);

                  exec(htmlCommand, { cwd: workspacePath }, (htmlError, htmlStdout, htmlStderr) => {
                    // Determine the HTML report path
                    const htmlReportName = path.basename(auditReportPath, '.json') + '_report.html';
                    const htmlReportPath = path.join(workspacePath, 'report_html', htmlReportName);

                    if (htmlError) {
                      console.error("HTML generation error:", htmlError);
                      vscode.window.showWarningMessage(
                        `⚠️ HTML report generation failed, but JSON report was created: ${auditReportPath}`
                      );
                    } else {
                      // Success - all steps completed
                      vscode.window.showInformationMessage(
                        `✅ Security scan completed! Reports generated:\n📄 Markdown: ${mdOutputPath}\n📊 JSON: ${auditReportPath}\n🌐 HTML: ${htmlReportPath}`
                      );

                      // Open the HTML report if it exists
                      if (fs.existsSync(htmlReportPath)) {
                        vscode.env.openExternal(vscode.Uri.file(htmlReportPath));
                      }
                    }

                    // Open the markdown file
                    vscode.workspace.openTextDocument(mdOutputPath).then((doc) => {
                      vscode.window.showTextDocument(doc);
                    });
                  });
                });
              });
            } catch (error) {
              vscode.window.showErrorMessage(
                `Failed to perform scan: ${error.message}`
              );
            }
          })();
          break;

        case "stopServer":
          (async () => {
            try {
              vscode.window.showInformationMessage(
                "🛑 Stopping LocalSentinel.ai server..."
              );
              await stopServer();
              this.serverRunning = false;
              this.serverPort = null;
              this.switchToWelcome();
              vscode.window.showInformationMessage(
                "✅ Server stopped successfully"
              );
            } catch (error) {
              vscode.window.showErrorMessage(
                `❌ Failed to stop server: ${error.message}`
              );
            }
          })();
          break;

        case "selectFolder":
          (async () => {
            try {
              const workspaceFolders = vscode.workspace.workspaceFolders;
              if (!workspaceFolders || workspaceFolders.length === 0) {
                vscode.window.showErrorMessage("No workspace folder is open");
                return;
              }

              const workspaceRoot = workspaceFolders[0].uri;
              const selectedUri = await vscode.window.showOpenDialog({
                canSelectFolders: true,
                canSelectFiles: false,
                canSelectMany: false,
                defaultUri: workspaceRoot,
                openLabel: "Select Scan Folder",
              });

              if (selectedUri && selectedUri[0]) {
                const relativePath = vscode.workspace.asRelativePath(
                  selectedUri[0]
                );
                this.selectedFolder = relativePath;

                // Send update to webview
                if (this._view) {
                  this._view.webview.postMessage({
                    command: "folderSelected",
                    folderPath: relativePath,
                  });
                }
              }
            } catch (error) {
              vscode.window.showErrorMessage(
                `Failed to select folder: ${error.message}`
              );
            }
          })();
          break;
      }
    });
  }

  getWebviewContent(webview, view = "welcome") {
    const htmlFile = view === "dashboard" ? "dashboard.html" : "webview.html";
    const htmlPath = path.join(
      this._context.extensionPath,
      "webviews",
      htmlFile
    );
    let html = fs.readFileSync(htmlPath, "utf8");

    // Get the URI for the logo
    const logoUri = webview.asWebviewUri(
      vscode.Uri.file(
        path.join(this._context.extensionPath, "assets", "logo_white.svg")
      )
    );

    // Replace the placeholder with the actual URI
    html = html.replace("${logoUri}", logoUri);

    // Replace server port and project path if in dashboard view
    if (view === "dashboard" && this.serverPort) {
      html = html.replace("${serverPort}", this.serverPort);

      // Get current workspace folder
      const workspaceFolders = vscode.workspace.workspaceFolders;
      const projectPath =
        workspaceFolders && workspaceFolders[0]
          ? workspaceFolders[0].name
          : "No active workspace";
      html = html.replace("${projectPath}", projectPath);

      // Set initial selected folder (workspace root by default)
      const selectedFolder =
        this.selectedFolder ||
        (workspaceFolders && workspaceFolders[0]
          ? workspaceFolders[0].name
          : "Select folder...");
      html = html.replace("${selectedFolder}", selectedFolder);
    }

    return html;
  }

  switchToDashboard() {
    if (this._view) {
      this._view.webview.html = this.getWebviewContent(
        this._view.webview,
        "dashboard"
      );
    }
  }

  switchToWelcome() {
    if (this._view) {
      this._view.webview.html = this.getWebviewContent(
        this._view.webview,
        "welcome"
      );
    }
  }
}

// Async function for start server functionality
async function startServer() {
  return new Promise((resolve, reject) => {
    exec("lms server start", (error, stdout, stderr) => {
      // The lms command outputs to stderr, so we primarily check stderr
      const output = stderr.trim();

      // Parse the output lines
      const lines = output.split("\n");

      // Look for the success pattern in the output
      let portNumber = null;
      let hasStartingMessage = false;

      for (const line of lines) {
        if (line.includes("Starting server...")) {
          hasStartingMessage = true;
        }

        // Check for success message and extract port
        const portMatch = line.match(
          /Success! Server is now running on port (\d+)/
        );
        if (portMatch && portMatch[1]) {
          portNumber = portMatch[1];
        }
      }

      if (portNumber) {
        resolve({
          success: true,
          port: portNumber,
          fullOutput: output,
        });
      } else if (error && !hasStartingMessage) {
        // Only reject if there's an actual error and no server starting message
        reject(new Error(`Command failed: ${error.message}`));
      } else {
        // Unexpected output format or other error
        reject(new Error(`Server failed to start. Output: ${output}`));
      }
    });
  });
}

// Async function for stop server functionality
async function stopServer() {
  return new Promise((resolve, reject) => {
    exec("lms server stop", (error, stdout, stderr) => {
      // The lms command might output to stderr or stdout
      const output = (stderr + stdout).trim();

      console.log("Stop server output:", output);
      console.log("Stop server error:", error);

      // Check for successful stop patterns or no error
      if (
        output.includes("Server stopped") ||
        output.includes("stopped successfully") ||
        output.includes("stopped") ||
        !error ||
        (error && error.code === 0)
      ) {
        resolve({
          success: true,
          output: output,
        });
      } else if (error) {
        reject(
          new Error(`Command failed: ${error.message}. Output: ${output}`)
        );
      } else {
        reject(new Error(`Failed to stop server. Output: ${output}`));
      }
    });
  });
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log("LocalSentinel.ai extension is now active!");

  // Create webview provider for sidebar
  const webviewProvider = new LocalSentinalWebviewProvider(context);

  // Register webview provider for the sidebar view
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "localsentinalView",
      webviewProvider,
      {
        webviewOptions: {
          retainContextWhenHidden: true,
        },
      }
    )
  );

  // Register commands
  const helloWorldDisposable = vscode.commands.registerCommand(
    "localsentinal-ai.helloWorld",
    function () {
      vscode.window.showInformationMessage(
        "Hello World from LocalSentinel.ai!"
      );
    }
  );

  const startServerDisposable = vscode.commands.registerCommand(
    "localsentinal-ai.startServer",
    async function () {
      if (webviewProvider.serverRunning) {
        vscode.window.showInformationMessage(
          `Server is already running on port ${webviewProvider.serverPort}!`
        );
        return;
      }

      try {
        vscode.window.showInformationMessage(
          "🚀 Starting LocalSentinel.ai server..."
        );
        const result = await startServer();
        vscode.window.showInformationMessage(
          `✅ Success! Server is now running on port ${result.port}`
        );
        webviewProvider.serverRunning = true;
        webviewProvider.serverPort = result.port;

        // Switch to dashboard view if webview is available
        if (webviewProvider._view) {
          webviewProvider.switchToDashboard();
        }
      } catch (error) {
        vscode.window.showErrorMessage(
          `❌ Failed to start server: ${error.message}`
        );
        if (webviewProvider._view) {
          webviewProvider._view.webview.postMessage({ command: "serverError" });
        }
      }
    }
  );

  // Add all disposables to subscriptions
  context.subscriptions.push(helloWorldDisposable, startServerDisposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};