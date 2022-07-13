const express = require("express");
const app = express();

const port = process.env.PORT || 8080;
app.use(express.static("public"));

app.use(express.json());
// database;

const dbConnect = require("./db");
dbConnect();

const ChatModal = require("./models/schema");

// routes;

app.post("/msg", (req, res) => {
  const chat = new ChatModal({
    user: req.body.user,
    message: req.body.message,
  });

  chat.save().then((response) => {
    res.send(response);
  });
});

app.get("/msg", (req, res) => {
  ChatModal.find().then((msg) => {
    res.redirect("/");
  });
});

// deleting all users

app.get("/delete", (req, res) => {
  ChatModal.deleteMany({}, (err, data) => {
    if (err) {
      console.log(err);
    }

    res.send(data);
  });
});

// app.get("/", (req, res) => {
//   res.send("hello this is Owais Idrisi");
// });
// creating server
const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// Socket
const io = require("socket.io")(server);

// users is variable to store no of online users
let users = 0;
io.on("connection", (socket) => {
  users++;
  // function when new user join
  socket.on("newUserJoin", (username) => {
    socket.broadcast.emit("newUserBroad", username.toUpperCase());
  });
  // function to count no of online users
  io.emit("onlineUsers", users);
  // console.log("Connected...");

  // receiving message and send to other users
  socket.on("message", (msg) => {
    socket.broadcast.emit("message", msg);
  });

  // disconnect function work when user leave the site
  socket.on("disconnect", () => {
    socket.on("newUserJoin", (username) => {
      socket.broadcast.emit("userLeftBroad", username.toUpperCase());
    });

    users--;
    io.emit("onlineUsers", users);
  });
});
