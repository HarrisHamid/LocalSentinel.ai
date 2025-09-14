Project Path: webviews

Source Tree:

```txt
webviews
├── dashboard.html
└── webview.html

```

`dashboard.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LocalSentinel.ai Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
            background-color: var(--vscode-sideBar-background);
            color: var(--vscode-foreground);
            height: 100vh;
            display: flex;
            flex-direction: column;
            padding: 16px;
            overflow-y: auto;
        }
        
        .dashboard-container {
            max-width: 100%;
            animation: fadeIn 0.6s ease-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 1px solid var(--vscode-widget-border);
        }
        
        .header-left {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .logo-small {
            width: 32px;
            height: 32px;
        }
        
        .logo-small img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
        
        .server-status {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--vscode-charts-green);
            box-shadow: 0 0 6px rgba(0, 255, 0, 0.3);
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
        
        .status-text {
            font-size: 13px;
            color: var(--vscode-descriptionForeground);
        }
        
        
        .section-title {
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 12px;
            color: var(--vscode-foreground);
        }
        
        .project-info {
            margin-bottom: 24px;
        }
        
        .project-path {
            display: flex;
            align-items: center;
            gap: 8px;
            background: var(--vscode-editor-background);
            border: 1px solid var(--vscode-widget-border);
            border-radius: 4px;
            padding: 12px;
            font-family: var(--vscode-editor-font-family);
            font-size: 13px;
        }
        
        .project-icon {
            font-size: 16px;
        }
        
        .project-name {
            color: var(--vscode-foreground);
            word-break: break-all;
        }
        
        .folder-selector {
            margin-top: 16px;
        }
        
        .section-subtitle {
            font-size: 12px;
            font-weight: 500;
            margin-bottom: 8px;
            color: var(--vscode-descriptionForeground);
        }
        
        .folder-select-container {
            position: relative;
        }
        
        .selected-folder {
            display: flex;
            align-items: center;
            gap: 8px;
            background: var(--vscode-input-background);
            border: 1px solid var(--vscode-input-border);
            border-radius: 4px;
            padding: 8px 12px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 13px;
        }
        
        .selected-folder:hover {
            border-color: var(--vscode-inputOption-activeBorder);
            background: var(--vscode-input-background);
        }
        
        .selected-folder:focus {
            border-color: var(--vscode-focusBorder);
            outline: none;
        }
        
        .folder-icon {
            font-size: 14px;
        }
        
        .folder-path {
            flex: 1;
            color: var(--vscode-input-foreground);
            word-break: break-all;
        }
        
        .select-icon {
            font-size: 10px;
            color: var(--vscode-descriptionForeground);
        }
        
        
        .action-buttons {
            display: flex;
            gap: 8px;
            margin-top: 24px;
        }
        
        .action-button {
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 8px 16px;
            font-size: 12px;
            font-weight: 500;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .action-button:hover {
            background: var(--vscode-button-hoverBackground);
        }
        
        .action-button.secondary {
            background: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
        }
        
        .action-button.secondary:hover {
            background: var(--vscode-button-secondaryHoverBackground);
        }
        
    </style>
</head>
<body>
    <div class="dashboard-container">
        <div class="header">
            <div class="header-left">
                <div class="logo-small">
                    <img src="${logoUri}" alt="LocalSentinel.ai" />
                </div>
                <h1 style="font-size: 16px; font-weight: 400;">LocalSentinel.ai</h1>
            </div>
            <div class="server-status">
                <div class="status-dot"></div>
                <span class="status-text">Server running on port ${serverPort}</span>
            </div>
        </div>
        
        <div class="project-info">
            <div class="section-title">Active Project</div>
            <div class="project-path">
                <span class="project-icon">📁</span>
                <span class="project-name">${projectPath}</span>
            </div>
            <div class="folder-selector">
                <div class="section-subtitle">Scan Target Folder</div>
                <div class="folder-select-container">
                    <div class="selected-folder" id="selectedFolder" onclick="selectFolder()">
                        <span class="folder-icon">📂</span>
                        <span class="folder-path" id="selectedFolderPath">${selectedFolder}</span>
                        <span class="select-icon">▼</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="action-buttons">
            <button class="action-button" onclick="doFullScan()">
                Scan selected folder
            </button>
            <button class="action-button secondary" onclick="stopServer()">
                Stop Server
            </button>
        </div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        
        function doFullScan() {
            vscode.postMessage({
                command: 'doFullScan'
            });
        }
        
        function stopServer() {
            vscode.postMessage({
                command: 'stopServer'
            });
        }
        
        function selectFolder() {
            vscode.postMessage({
                command: 'selectFolder'
            });
        }
        
        function updateSelectedFolder(folderPath) {
            const folderPathElement = document.getElementById('selectedFolderPath');
            if (folderPathElement) {
                folderPathElement.textContent = folderPath;
            }
        }
        
        // Listen for messages from the extension
        window.addEventListener('message', event => {
            const message = event.data;
            
            switch (message.command) {
                case 'updateStats':
                    // Update statistics when received from extension
                    break;
                case 'serverStopped':
                    // Handle server stopped event
                    break;
                case 'folderSelected':
                    updateSelectedFolder(message.folderPath);
                    break;
            }
        });
    </script>
</body>
</html>
```

`webview.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LocalSentinel.ai</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
            background-color: var(--vscode-sideBar-background);
            color: var(--vscode-foreground);
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 16px;
            overflow: hidden;
        }
        
        .welcome-container {
            text-align: center;
            max-width: 240px;
            width: 100%;
            animation: fadeIn 0.6s ease-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .logo {
            width: 67px;
            height: 67px;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s ease;
        }
        
        .logo img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
        
        .logo:hover {
            transform: scale(1.05);
        }
        
        h1 {
            font-size: 20px;
            font-weight: 300;
            margin-bottom: 8px;
            color: var(--vscode-foreground);
            line-height: 1.3;
        }
        
        .subtitle {
            font-size: 13px;
            color: var(--vscode-descriptionForeground);
            margin-bottom: 24px;
            font-weight: 400;
        }
        
        .start-button {
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 12px 20px;
            font-size: 13px;
            font-weight: 500;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s ease;
            width: 100%;
            max-width: 160px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            margin: 0 auto;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .start-button:hover {
            background: var(--vscode-button-hoverBackground);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .start-button:active {
            transform: translateY(0);
        }
        
        .start-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }
        
        .start-button.running {
            background: var(--vscode-testing-iconPassed);
            color: var(--vscode-button-foreground);
        }
        
        .start-button.running:hover {
            background: var(--vscode-testing-iconPassed);
            opacity: 0.9;
        }
        
        .loading-container {
            display: none;
            margin-top: 16px;
            color: var(--vscode-descriptionForeground);
            font-size: 12px;
            align-items: center;
            justify-content: center;
            gap: 6px;
        }
        
        .loading-container.show {
            display: flex;
        }
        
        .spinner {
            width: 14px;
            height: 14px;
            border: 2px solid var(--vscode-descriptionForeground);
            border-radius: 50%;
            border-top-color: transparent;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .status-indicator {
            position: absolute;
            top: 12px;
            right: 12px;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: var(--vscode-charts-red);
            transition: background-color 0.3s ease;
        }
        
        .status-indicator.running {
            background: var(--vscode-charts-green);
            box-shadow: 0 0 6px rgba(0, 255, 0, 0.3);
        }
        
        .footer {
            position: absolute;
            bottom: 12px;
            font-size: 10px;
            color: var(--vscode-descriptionForeground);
            opacity: 0.7;
        }
        
        /* Dark theme adjustments */
        body[data-vscode-theme-kind="vscode-dark"] .start-button {
            box-shadow: 0 2px 8px rgba(255, 255, 255, 0.1);
        }
        
        body[data-vscode-theme-kind="vscode-dark"] .start-button:hover {
            box-shadow: 0 4px 12px rgba(255, 255, 255, 0.15);
        }
        
        /* Responsive adjustments for sidebar */
        @media (max-width: 220px) {
            .welcome-container {
                max-width: 180px;
            }
            
            h1 {
                font-size: 18px;
            }
            
            .logo {
                width: 58px;
                height: 58px;
            }
            
            .start-button {
                padding: 10px 16px;
                font-size: 12px;
                max-width: 140px;
            }
        }
    </style>
</head>
<body>
    <div class="status-indicator" id="statusIndicator"></div>
    
    <div class="welcome-container">
        <div class="logo">
            <img src="${logoUri}" alt="LocalSentinel.ai Logo" />
        </div>
        <h1>Welcome to LocalSentinel.ai</h1>
        <div class="subtitle">Let's get started</div>
        <button class="start-button" id="startButton" onclick="handleStartServer()">
            <span id="buttonText">Start Server</span>
        </button>
        <div class="loading-container" id="loadingContainer">
            <div class="spinner"></div>
            <span>Starting server...</span>
        </div>
    </div>
    
    <div class="footer">AI Security Assistant</div>

    <script>
        const vscode = acquireVsCodeApi();
        let serverRunning = false;
        
        function handleStartServer() {
            const button = document.getElementById('startButton');
            const loading = document.getElementById('loadingContainer');
            const buttonText = document.getElementById('buttonText');
            
            if (serverRunning) {
                // Server is running, show status or stop option
                vscode.postMessage({
                    command: 'showServerStatus'
                });
                return;
            }
            
            // Start server
            button.disabled = true;
            button.classList.add('loading');
            buttonText.textContent = 'Starting...';
            loading.classList.add('show');
            
            // Send message to extension
            vscode.postMessage({
                command: 'startServer'
            });
        }
        
        function updateServerStatus(running) {
            const button = document.getElementById('startButton');
            const loading = document.getElementById('loadingContainer');
            const statusIndicator = document.getElementById('statusIndicator');
            const buttonText = document.getElementById('buttonText');
            
            serverRunning = running;
            button.disabled = false;
            loading.classList.remove('show');
            
            if (running) {
                button.classList.add('running');
                buttonText.textContent = 'Server Running';
                statusIndicator.classList.add('running');
            } else {
                button.classList.remove('running', 'loading');
                buttonText.textContent = 'Start Server';
                statusIndicator.classList.remove('running');
            }
        }
        
        // Listen for messages from the extension
        window.addEventListener('message', event => {
            const message = event.data;
            
            switch (message.command) {
                case 'serverStarted':
                    updateServerStatus(true);
                    break;
                case 'serverStopped':
                    updateServerStatus(false);
                    break;
                case 'serverError':
                    updateServerStatus(false);
                    break;
            }
        });
        
        // Initialize with current state
        updateServerStatus(false);
    </script>
</body>
</html>
```