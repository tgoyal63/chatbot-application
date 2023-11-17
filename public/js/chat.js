const socket = io();
let messageCount = 0;

if (!localStorage.getItem("sessionId")) {
  const sessionId =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  localStorage.setItem("sessionId", sessionId);
}

const sessionId = localStorage.getItem("sessionId");
socket.emit("get_previous_chats", sessionId);

document.getElementById("send-button").addEventListener("click", () => {
  const inputElement = document.getElementById("chat-input");
  const userMessage = inputElement.value;
  inputElement.value = "";

  if (userMessage.trim()) {
    socket.emit("chat_message", { userMessage, sessionId });
    const chatBox = document.getElementById("chat-box");
    const messageId = `message-${messageCount++}`;
    chatBox.innerHTML += `<p><strong>You:</strong> ${userMessage}</p>`;
    chatBox.innerHTML += `<p><strong>Bot:</strong> <span id="${messageId}">Thinking...</span></p>`;
  }
});

socket.on("stream_data", ({ message, sessionId }) => {
  if (sessionId === localStorage.getItem("sessionId")) {
    const chatBox = document.getElementById(`message-${messageCount - 1}`);
    if (chatBox.innerHTML.includes("Thinking...")) {
      chatBox.innerHTML = "";
    }
    chatBox.innerHTML += message;
  }
});

socket.on("previous_chats", ({ chats, sessionId }) => {
    const chatBox = document.getElementById("chat-box");
    chats.forEach((chat) => {
      chatBox.innerHTML += `<p><strong>${chat.role === "user" ? "You": "Bot"}:</strong> ${chat.content}</p>`;
    });
});
