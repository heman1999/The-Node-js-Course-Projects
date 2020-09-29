const experss = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const Filter = require("bad-words");
const { generateMessage } = require("./utils/messages");
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utils/user");
const { get } = require("https");

const app = new experss();
const server = http.createServer(app);
const io = socketio(server);
const port = process.env.PORT || 3000;
const pathToPublicDir = path.join(__dirname, "../public");

app.use(experss.static(pathToPublicDir));

io.on("connection", (socket) => {
  console.log("new connection!");

  socket.on("join", ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room });
    if (error) {
      return callback(error);
    }
    socket.join(room);

    socket.emit("message", generateMessage("Admin", "Welcome!"));
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        generateMessage("Admin", `${user.username} has joined!`)
      );
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const filter = new Filter();
    if (filter.isProfane(message)) {
      return callback("Profanity not allowed!");
    }

    const user = getUser(socket.id);
    if (user) {
      io.to(user.room).emit("message", generateMessage(user.username, message));
      callback();
    }
  });

  socket.on("sendLocation", ({ latitude, longitude }, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit(
      "locationMessage",
      generateMessage(
        user.username,
        `https://google.com/maps?q=${latitude},${longitude}`
      )
    );
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    io.to(user.room).emit(
      "message",
      generateMessage("Admin", `${user.username} has left!`)
    );
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
  });
});

server.listen(port, () => {
  console.log("Server is up on port " + port);
});
