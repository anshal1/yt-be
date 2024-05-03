const { Schema, model } = require("mongoose");
const ApiError = require("../../utils/ApiError");

const User = new Schema({
  name: {
    type: String,
  },
  username: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
});

User.pre("save", async function (next) {
  const user = this;
  if (!user.email) {
    throw new ApiError("Email Is Required", 400);
  }
  if (!user.username) {
    throw new ApiError("Username Is Required", 400);
  }
  if (!user.password) {
    throw new ApiError("Password Is Required", 400);
  }

  const userExists = await this.model("users").findOne({
    $or: [{ email: user.email }, { username: user.username }],
  });

  if (userExists) {
    throw new ApiError("User With This Email Or Username Already Exists", 201);
  }

  next();
});

module.exports = model("users", User);
