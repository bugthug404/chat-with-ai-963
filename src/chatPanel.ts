// @ts-ignore
const vscode = acquireVsCodeApi(); // Get VS Code API reference

document.addEventListener("DOMContentLoaded", () => {
  const userQuestionInput = document.getElementById("user-question");
  if (userQuestionInput) {
    userQuestionInput.focus();
  }
});

document.getElementById("send-button")?.addEventListener("click", () => {
  vscode.window.showInformationMessage("Hello World from Chat with AI!");
  // @ts-ignore
  const question = document.getElementById("user-question")?.value;
  if (question) {
    vscode.postMessage({ question }); // Send message to VS Code extension
    // @ts-ignore
    document.getElementById("user-question").value = ""; // Clear input field
  }
});
