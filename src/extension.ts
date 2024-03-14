import * as vscode from "vscode";

// import fetch from "node-fetch";

export function activate(context: vscode.ExtensionContext) {
  // Register command to open chat UI
  let disposable = vscode.commands.registerCommand(
    "chat-with-ai-963.chatPanel",
    () => {
      // Create a new webview panel
      const panel = vscode.window.createWebviewPanel(
        "chatUI", // Identifies the type of the webview. Used internally
        "Chat UI", // Title of the panel displayed to the user
        vscode.ViewColumn.One, // Editor column to show the new webview panel in.
        {
          enableScripts: true, // Enable JavaScript in the webview
        }
      );

      // Get the HTML content of the chat UI
      const chatUIHtml = getChatUIHtml(panel.webview);

      // Set the HTML content of the webview panel
      panel.webview.html = chatUIHtml;
    }
  );

  // Add the disposable to the context so that it can be disposed when the extension is deactivated
  context.subscriptions.push(disposable);
}

function getChatUIHtml(webview: vscode.Webview) {
  return `
        <html>
            <head>
                <style>
                    /* Your CSS styles for the chat UI can go here */
                </style>
            </head>
            <body>
                <div class="result" id="result"></div>
                <div class="chat-container" id="chatContainer">
                    <div class="message">Welcome to the chat!</div>
                    <!-- Other chat messages can be dynamically added here -->
                </div>
                <input type="text" placeholder="Typess your message here" id="messageInput" />
                <button onclick="sendMessage()">Send</button>
                
                <script>
                    // Function to send message
                    function sendMessage() {
                        const messageInput = document.getElementById('messageInput');
                        const message = messageInput.value;
                        
                        if (message.trim() !== '') {
                            // Send message to API
                            fetch('http://localhost:3002', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ prompt: message, model: 'gemma:2b', stream: false })
                            })
                            .then(response => response.json())
                            .then(data => {
                                // Display result above input field
                                const resultElement = document.getElementById('result');
                                resultElement.textContent = JSON.stringify(data);
                            })
                            .catch(error => console.error('Error:', error));
                            
                            // Clear input after sending message
                            messageInput.value = '';
                        }
                    }

                    // Add event listener to input field to send message when Enter key is pressed
                    document.getElementById('messageInput').addEventListener('keypress', function(event) {
                        if (event.key === 'Enter') {
                            sendMessage();
                        }
                    });
                </script>
            </body>
        </html>
    `;
}

export function deactivate() {}
