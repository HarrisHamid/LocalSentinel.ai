const vscode = require("vscode");
const { exec } = require("child_process");

// Tree data provider for the sidebar view
class LocalSentinalProvider {
  constructor() {
    this._onDidChangeTreeData = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
  }

  refresh() {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element) {
    return element;
  }

  getChildren() {
    // Create the Start Server button as tree item
    const startServerItem = new vscode.TreeItem(
      "Start Server",
      vscode.TreeItemCollapsibleState.None
    );
    startServerItem.command = {
      command: "localsentinal-ai.startServer",
      title: "Start Server",
      arguments: [],
    };
    startServerItem.iconPath = new vscode.ThemeIcon("run");
    startServerItem.tooltip = "Start LocalSentinel server";

    return [startServerItem];
  }
}

// Async function for start server functionality
async function startServer() {
  return new Promise((resolve, reject) => {
    exec("lms server start", (error, stdout, stderr) => {
      // Combine stdout and stderr as some CLIs output to stderr
      const output = (stdout + stderr).trim();
      
      // Check for the success pattern in the combined output
      const portMatch = output.match(/Server is now running on port (\d+)/);
      
      if (portMatch && portMatch[1]) {
        resolve({
          success: true,
          port: portMatch[1],
          fullOutput: output
        });
      } else if (error) {
        // Only reject if there's an actual error and no success pattern
        reject(new Error(`Command failed: ${error.message}`));
      } else {
        // Unexpected output format
        reject(new Error(`Unexpected output format: ${output}`));
      }
    });
  });
}


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log("LocalSentinal.ai extension is now active!");

  // Create tree data provider
  const provider = new LocalSentinalProvider();

  // Register tree data provider
  vscode.window.createTreeView("localsentinalView", {
    treeDataProvider: provider,
    showCollapseAll: true,
  });

  // Register Hello World command
  const helloWorldDisposable = vscode.commands.registerCommand(
    "localsentinal-ai.helloWorld",
    function () {
      vscode.window.showInformationMessage(
        "Hello World from LocalSentinal.ai!"
      );
    }
  );

  // Register Start Server command
  const startServerDisposable = vscode.commands.registerCommand(
    "localsentinal-ai.startServer",
    async function () {
      try {
        vscode.window.showInformationMessage("Starting server...");
        const result = await startServer();
        vscode.window.showInformationMessage(`Success! Server is now running on port ${result.port}`);
      } catch (error) {
        vscode.window.showErrorMessage(`Failed to start server: ${error.message}`);
      }
    }
  );


  // Add all disposables to subscriptions
  context.subscriptions.push(
    helloWorldDisposable,
    startServerDisposable
  );
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
