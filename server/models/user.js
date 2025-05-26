const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  userid: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  wallet: {
    type: Number,
    default: 500, // initial wallet balance
  },
  purchasedVideos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Video',
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
