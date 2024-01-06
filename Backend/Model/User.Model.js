const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: ["Student", "Tutor"],
    required: true,
  },
  language: {
    type: String,
  },
  subject: {
    type: String,
  },
  classGrade: {
    type: String,
  },
});

const UserModel = mongoose.model("User", userSchema);

module.exports = {
  UserModel,
};
