const User = require("../../src/model/user");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Task = require("../../src/model/task");

const userOneId = mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: "Mike",
  email: "mike@example.com",
  password: "56what!!",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
    },
  ],
};

const userTwoId = mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  name: "Poonam",
  email: "poonam@example.com",
  password: "56what!!",
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET),
    },
  ],
};

const task1 = {
  description: "first",
  completed: false,
  owner: userOneId,
};

const task2 = {
  description: "second",
  completed: true,
  owner: userOneId,
};

const task3 = {
  description: "third",
  completed: true,
  owner: userTwoId,
};

const setUpDB = async () => {
  await User.deleteMany();
  await Task.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
  await new Task(task1).save();
  await new Task(task2).save();
  await new Task(task3).save();
};

module.exports = {
  userOne,
  userOneId,
  setUpDB,
  userTwo,
  task3,
};
