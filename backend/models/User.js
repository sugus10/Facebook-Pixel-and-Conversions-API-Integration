
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  facebookId: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  accessToken: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  selectedPixelId: {
    type: String,
  },
});

module.exports = mongoose.model('User', UserSchema);
