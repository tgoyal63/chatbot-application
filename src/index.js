// Import required modules
require("dotenv").config();
const express = require("express");
const socketio = require("socket.io");
const { connectDB, PORT, openaiApiKey } = require("./config/config");
const userRouter = require("./routes/user.routes");
const chatRouter = require("./routes/chat.routes");
const sessionRouter = require("./routes/session.routes");
const { OpenAI } = require("openai");
const {
  saveChat,
  getPreviousChats,
  formatChats,
} = require("./controllers/chat.controller");

// Initialize Express app
const app = express();

// Serve static files from public directory
app.use(express.static("public"));

// Parse JSON request body
app.use(express.json());

// Parse URL encoded request body
app.use(express.urlencoded({ extended: true }));

// Initialize Socket.io server
const server = require("http").createServer(app);
const io = socketio(server);

// Define Express routes
// app.use("/api/user", userRouter);
// app.use("/api/chat", chatRouter);
// app.use("/api/session", sessionRouter);

// Define default route
// app.get("/", (req, res) => {
//   res.send("Welcome to the chatbot application!");
// });

// Define Socket.io events
io.on("connection", async (socket) => {
  console.log("A user connected");
  let sessionId;

  let formattedChats = [];
  socket.on("get_previous_chats", async (sessionID) => {
    sessionId = sessionID;
    const previousChats = await getPreviousChats(sessionID);
    if (previousChats.length) {
      formattedChats = formatChats(previousChats);
      socket.emit("previous_chats", { chats: formattedChats, sessionID });
      console.log("Previous chats:", formattedChats);
    }
  });

  // Listen for chat message
  socket.on("chat_message", async ({sessionId, userMessage}) => {
    try {
      const openai = new OpenAI({
        apiKey: openaiApiKey,
      });
      formattedChats.push({ role: "user", content: userMessage });
      const stream = await openai.beta.chat.completions.stream({
        model: "gpt-3.5-turbo",
        messages: formattedChats,
        stream: true,
      });
      stream.on("content", (delta, snapshot) => {
        socket.emit("stream_data", {message: delta, sessionId});
      });
      stream.on("stop", (delta, snapshot) => {
        console.log("Stream stopped");
      });
      const response = await stream.finalContent();
      console.log(stream.messages);
      saveChat(userMessage, response, sessionId);
    } catch (error) {
      console.error("Socket error:", error);
    }
  });

  // Listen for disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start server
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Server connection error:", err);
  });
