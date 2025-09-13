const vscode = require("vscode");

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
    // Create the three action buttons as tree items
    const uploadItem = new vscode.TreeItem(
      "Upload",
      vscode.TreeItemCollapsibleState.None
    );
    uploadItem.command = {
      command: "localsentinal-ai.upload",
      title: "Upload",
      arguments: [],
    };
    uploadItem.iconPath = new vscode.ThemeIcon("cloud-upload");
    uploadItem.tooltip = "Upload files";

    const editItem = new vscode.TreeItem(
      "Edit",
      vscode.TreeItemCollapsibleState.None
    );
    editItem.command = {
      command: "localsentinal-ai.edit",
      title: "Edit",
      arguments: [],
    };
    editItem.iconPath = new vscode.ThemeIcon("edit");
    editItem.tooltip = "Edit files";

    const deleteItem = new vscode.TreeItem(
      "Delete",
      vscode.TreeItemCollapsibleState.None
    );
    deleteItem.command = {
      command: "localsentinal-ai.delete",
      title: "Delete",
      arguments: [],
    };
    deleteItem.iconPath = new vscode.ThemeIcon("trash");
    deleteItem.tooltip = "Delete files";

    return [uploadItem, editItem, deleteItem];
  }
}

// Async function for upload functionality
async function performUpload() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("Upload operation completed");
      resolve();
    }, 2000);
  });
}

// Async function for edit functionality
async function performEdit() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("Edit operation completed");
      resolve();
    }, 1500);
  });
}

// Async function for delete functionality
async function performDelete() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("Delete operation completed");
      resolve();
    }, 1000);
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

  // Register Upload command
  const uploadDisposable = vscode.commands.registerCommand(
    "localsentinal-ai.upload",
    async function () {
      try {
        vscode.window.showInformationMessage("Starting upload...");
        await performUpload();
        vscode.window.showInformationMessage("Upload completed successfully!");
      } catch (error) {
        vscode.window.showErrorMessage(`Upload failed: ${error.message}`);
      }
    }
  );

  // Register Edit command
  const editDisposable = vscode.commands.registerCommand(
    "localsentinal-ai.edit",
    async function () {
      try {
        vscode.window.showInformationMessage("Starting edit...");
        await performEdit();
        vscode.window.showInformationMessage("Edit completed successfully!");
      } catch (error) {
        vscode.window.showErrorMessage(`Edit failed: ${error.message}`);
      }
    }
  );

  // Register Delete command
  const deleteDisposable = vscode.commands.registerCommand(
    "localsentinal-ai.delete",
    async function () {
      try {
        // Show confirmation dialog
        const result = await vscode.window.showWarningMessage(
          "Are you sure you want to delete?",
          { modal: true },
          "Yes",
          "No"
        );

        if (result === "Yes") {
          vscode.window.showInformationMessage("Starting delete...");
          await performDelete();
          vscode.window.showInformationMessage(
            "Delete completed successfully!"
          );
        }
      } catch (error) {
        vscode.window.showErrorMessage(`Delete failed: ${error.message}`);
      }
    }
  );

  // Add all disposables to subscriptions
  context.subscriptions.push(
    helloWorldDisposable,
    uploadDisposable,
    editDisposable,
    deleteDisposable
  );
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
