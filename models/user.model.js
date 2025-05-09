const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  contacts: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    alias: String
  }],
  chats: [{
    chatId: { type: Schema.Types.ObjectId, ref: 'Chat' },
    lastMessage: { type: String },
    lastMessageDate: { type: Date },
  }],
  lastLogin: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
