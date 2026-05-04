import mongoose from "mongoose";

const AuthSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  wallet: {

    balance: {
      type: Number,
      default: 0
    }

  }

});

const User = mongoose.model(
  "User",
  AuthSchema
);

export default User;