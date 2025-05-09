const mongoose = require('mongoose');
const { Schema } = mongoose;

const chatSchema = new Schema({
  isGroup: { type: Boolean, default: false },
  name: { type: String }, // Solo si es grupo
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);
