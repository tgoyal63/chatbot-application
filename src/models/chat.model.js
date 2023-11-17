const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    userMessage: { type: String, required: true },
    botResponse: { type: String, required: true },
    sessionID: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);
