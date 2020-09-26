const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./task");

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
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error("Age cannot be negative!");
      }
    },
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "thisiscourse");
  user.tokens.push({ token });
  await user.save();

  return token;
};

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

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

// Delete user tasks when user is removed
userSchema.pre("remove", async function (next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });
  next();
});

const User = mongoose.model("users", userSchema);

module.exports = User;
