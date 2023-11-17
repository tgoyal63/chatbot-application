const Chat = require("../models/chat.model");

const saveChat = async (userMessage, botResponse, sessionID) => {
  const chat = new Chat({ userMessage, botResponse, sessionID });
  await chat.save();
};

// Previous chats array according to timestamp (oldest to newest) for a given sessionID in userMessage and botResponse
const getPreviousChats = async (sessionID) => {
  const chats = await Chat.find({ sessionID }).sort({ createdAt: 1 });
  return chats;
};

// Format chats to array for OpenAI
const formatChats = (chats) => {
  const formattedChats = [];
  chats.forEach((chat) => {
    formattedChats.push({ role: "user", content: chat.userMessage });
    formattedChats.push({ role: "assistant", content: chat.botResponse });
  });
  return formattedChats;
};

module.exports = { saveChat, getPreviousChats, formatChats };
