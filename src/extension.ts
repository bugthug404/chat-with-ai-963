import * as vscode from "vscode";

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

      const apiUrl = vscode.workspace.getConfiguration().get("chatApiUrl");

      // Get the HTML content of the chat UI
      const chatUIHtml = getChatUIHtml(panel.webview, apiUrl as string);

      //   panel.webview.postMessage({ type: "getApiUrl" });

      // Set the HTML content of the webview panel
      panel.webview.html = chatUIHtml;
    }
  );

  // Add the disposable to the context so that it can be disposed when the extension is deactivated
  context.subscriptions.push(disposable);
}

function getChatUIHtml(webview: vscode.Webview, apiUrl?: string) {
  return `
  <html>

<head>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>

    <style>
        body {
            padding: 0px;
            margin: 0px;
        }

        .page {
            border-radius: 10px;
            padding: 0px 10px;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: end;
        }

        .result {
            height: 100%;
            overflow-y: auto;
            padding: 20px 0px;
            display: flex;
            flex-direction: column;
            row-gap: 10px;
        }

        .question {
            border-left: 5px solid white;
            padding: 5px 8px;
            ;
        }

        .answer {
            border-left: 5px solid red;
            padding: 5px 10px;
        }

        #input-section {
            display: flex;
            flex-direction: row;
            column-gap: 10px;
            padding: 10px 0px;

        }

        #button {
           
            padding: 5px 15px;
        
            border-radius: 5px;
        }

        .input {
            width: 100%;
            outline: none;
            border: none;
            padding-left: 4px;
            
        }

        .modelInput {
            max-width: 200px;
        }
    </style>
</head>

<body>
    <div class="page">

        <div class="result" id="result"> </div>
        <div id="message">i will post query to this api:
        <span id="showapiurl">http://localhost:11433</span></div>
        <div id="input-section">

            <input class="input" type="text" placeholder="Typess your message here" id="messageInput" />
            <select name="model" id="modelSelect">
                <option value="codellama:7b">Codellama:7b</option>
                <option value="gemma:2b">Gemma:2b</option>
            </select>
            <button id="button" onclick="sendMessage()">Send</button>
        </div>
    </div>
    <script>
        const resultElement = document.getElementById('result');
        const messageElement = document.getElementById('message');

        async function sendMessage() {
            const messageInput = document.getElementById('messageInput');
            const modelSelect = document.getElementById('modelSelect');
            const message = messageInput.value;
            const model = modelSelect.value;
            resultElement.innerHTML += "<div class='question'>" + message + "</div>"

            messageElement.innerText = 'Loading...'
            resultElement.scrollTop = resultElement.scrollHeight;

            if (message.trim() !== '') {
                // Send message to API
                try {
                    messageInput.value = '';
                    const result = await fetch('http://localhost:11433', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ prompt: message, model: model ?? 'codellama:7b', stream: false })
                    });

                    const response = await result.json()
                    console.log(result, response)
                    const answer = marked.parse(response.answer)
                    console.log(answer)
                    resultElement.innerHTML += "<div class='answer'>" + answer + '</div>';
                    resultElement.scrollTop = resultElement.scrollHeight;

                } catch (error) {
                    console.log("error == ", error)
                    resultElement.innerHTML += "<div class='answer'>" + "Something went wrong! try again later." + "</div>"
                }

                messageElement.innerHTML = ''

            }
        }



        // Add event listener to input field to send message when Enter key is pressed
        document.getElementById('messageInput').addEventListener('keypress', function (event) {
            if (event.key === 'Enter') {

                sendMessage()

            }
        });
    </script>
</body>

</html>
  `;
}

export function deactivate() {}
