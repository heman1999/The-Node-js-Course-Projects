const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email!");
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
  },
  age: {
    type: Number,
    trim: true,
    dedault: 0,
    validate(value) {
      if (value < 0) {
        throw new Error("Age cannot be negative!");
      }
    },
  },
});

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Unable to login!");
  }
  const isMatch = await bcryptjs.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Unable to login!");
  }
  return user;
};

// Hash plain text password
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    const hashPassword = await bcryptjs.hash(user.password, 8);
    user.password = hashPassword;
  }
  next();
});

const User = mongoose.model("users", userSchema);

module.exports = User;
