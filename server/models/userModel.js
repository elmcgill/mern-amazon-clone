const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: "You must enter an email",
  },
  password: {
    type: String,
    required: "You must enter a password",
  },
  nickName: {
    type: String,
    required: false,
    default: null,
  },
  jwtToken: {
    type: String,
    default: null,
    required: false,
  },
});

module.exports = mongoose.model("User", UserSchema);
