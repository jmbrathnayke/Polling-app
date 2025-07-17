// models/Poll.js
const PollSchema = new mongoose.Schema({
  title: String,
  description: String,
  options: [{ text: String, votes: { type: Number, default: 0 } }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  multipleVotesAllowed: Boolean,
  allowComments: Boolean,
  privacy: { type: String, enum: ['public', 'private'], default: 'public' },
  expiresAt: Date,
  votedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });
const mongoose = require('mongoose');