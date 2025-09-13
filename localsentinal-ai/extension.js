const vscode = require("vscode");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

// WebView Provider for sidebar integration
class LocalSentinalWebviewProvider {
  constructor(context) {
    this._context = context;
    this.serverRunning = false;
  }

  resolveWebviewView(webviewView, context, _token) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.file(path.join(this._context.extensionPath, 'assets')),
        vscode.Uri.file(path.join(this._context.extensionPath, 'webviews'))
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

            // Notify webview that server started
            webviewView.webview.postMessage({ command: "serverStarted" });
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
      }
    });
  }

  getWebviewContent(webview) {
    const htmlPath = path.join(this._context.extensionPath, 'webviews', 'webview.html');
    let html = fs.readFileSync(htmlPath, 'utf8');
    
    // Get the URI for the logo
    const logoUri = webview.asWebviewUri(
      vscode.Uri.file(path.join(this._context.extensionPath, 'assets', 'logo_white.svg'))
    );
    
    // Replace the placeholder with the actual URI
    html = html.replace('${logoUri}', logoUri);
    
    return html;
  }
}

// Async function for start server functionality
async function startServer() {
  return new Promise((resolve, reject) => {
    exec("lms server start", (error, stdout, stderr) => {
      // The lms command outputs to stderr, so we primarily check stderr
      const output = stderr.trim();

      // Parse the output lines
      const lines = output.split('\n');
      
      // Look for the success pattern in the output
      let portNumber = null;
      let hasStartingMessage = false;
      
      for (const line of lines) {
        if (line.includes("Starting server...")) {
          hasStartingMessage = true;
        }
        
        // Check for success message and extract port
        const portMatch = line.match(/Success! Server is now running on port (\d+)/);
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

        // Update webview if available
        if (webviewProvider._view) {
          webviewProvider._view.webview.postMessage({
            command: "serverStarted",
          });
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
