// const express = require("express");
// const app = express();
// const http = require("http");
// const path = require("path");

// const socketio = require("socket.io");
// const server = http.createServer(app);
// const io = socketio(server);

// app.set("view engine", "ejs");
// app.use(express.static(path.join(__dirname, "public")));

// io.on("connection", function (socket) {
//     socket.on("send-location", function (data) {
//         io.emit("receive-location", { id: socket.id, ...data })
//     });
//   // console.log("connected");
//   socket.on("disconnect", function () {
//     io.emit("user-disconnected", socket.id);
//   });
// });
 
// app.get("/", (req, res) => {
//   res.render("index");
// });

// server.listen(3000);





const express = require("express");
const app = express();
const http = require("http");
const path = require("path");

const server = http.createServer(app);
const socketio = require("socket.io");
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});

io.on("connection", (socket) => {
  socket.on("send-location", ({ latitude, longitude, userId, color }) => {
    io.emit("receive-location", {
      userId,
      latitude,
      longitude,
      color,
    });
  });

  socket.on("disconnect", () => {
    io.emit("user-disconnected", socket.id); // Optional – not used anymore
  });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
