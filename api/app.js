var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(3200);
const { generateKeyPair } = require("crypto");

const crypto = require("crypto-js");
const key = require("./shared/Encrypt");

const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyparser = require("body-parser");
const cors = require("cors");
const path = require("path");

// Routes
const authRoute = require("./routes/authRoute");
const contactRoute = require("./routes/contactRoute");
const messageRoute = require("./routes/messageRoute");

// Models
const contact = require("./models/ContactModel");
const message = require("./models/MessageModel");

mongoose.connect("mongodb://localhost:27017/BlockChain", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const db = mongoose.connection;

db.on("error", (err) => {
  console.log(err);
});

db.once("open", () => {
  console.log("Database connection established");
});

app.use(morgan("dev"));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cors());

// Registering routes
app.use("/api/auth/", authRoute);
app.use("/api/contact/", contactRoute);
app.use("/api/msg/", messageRoute);

app.get("/", (req, res) => {
  res.send("Hello");
});

var UsersOnline = [];

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    UsersOnline = UsersOnline.filter((item) => {
      return item !== socket.id;
    });
  });

  socket.on("message", (data) => {
    contact.find({ $or: [{ room_id: data.uid + data.to }, { room_id: data.to + data.uid }] }).then((res) => {
      if (res.length == 0) {
        console.log(res, 'res');
        console.log(data.uid + data.to, 'data');
        generateKeyPair(
          "rsa",
          {
            modulusLength: 4096,
            publicKeyEncoding: {
              type: "spki",
              format: "pem",
            },
            privateKeyEncoding: {
              type: "pkcs8",
              format: "pem",
              cipher: "aes-256-cbc",
              passphrase: "top secret",
            },
          },
          (err, publicKey, privateKey) => {
            let obj = new contact({
              owner: data.uid,
              receiver: data.to,
              last_updated: Date.now(),
              public_key: publicKey,
              private_key: privateKey,
              room_id: data.uid + data.to,
            });

            obj.save().then(
              (saveres) => {
                saveres.populate("owner", ["username", "email", "_id"]);
                saveres.populate("receiver", ["username", "email", "_id"]);
                saveres.execPopulate().then((pop) => {
                  message
                    .findOne({}, {}, { sort: { created_at: -1 } })
                    .then((msgres) => {
                      let newmessage = Object.assign({});
                      if (msgres == null) {
                        newmessage = new message({
                          sender: data.uid,
                          receiver: data.to,
                          message: crypto.AES.encrypt(
                            data.message,
                            key.key
                          ).toString(),
                          previous_hash: "0",
                          hash: crypto.AES.encrypt(
                            data.message + data.uid + data.to,
                            key.key
                          ).toString(),
                          room_id: data.to + data.uid
                        });
                      } else {
                        newmessage = new message({
                          sender: data.uid,
                          receiver: data.to,
                          message: crypto.AES.encrypt(
                            data.message,
                            key.key
                          ).toString(),
                          previous_hash: res.hash,
                          hash: crypto.AES.encrypt(
                            data.message + data.uid + data.to,
                            key.key
                          ).toString(),
                          room_id: data.to + data.uid
                        });
                      }

                      console.log(newmessage, "newmsg");

                      newmessage.save().then((newres) => {
                        io.to(data.to).emit("newMessage", {
                          message: data.message,
                          room: saveres,
                          sender: data.uid,
                        });
                      });
                    });
                });
              },
              (error) => { }
            );
          }
        );
      } else {
        res[0].populate("owner", ["username", "email", "_id"]);
        res[0].populate("receiver", ["username", "email", "_id"]);
        res[0].execPopulate().then((pop) => {
          message
            .findOne({}, {}, { sort: { _id: -1 } })
            .then((msgres) => {
              let newmessage = Object.assign({});
              if (msgres == null) {
                newmessage = new message({
                  sender: data.uid,
                  receiver: data.to,
                  message: crypto.AES.encrypt(data.message, key.key).toString(),
                  previous_hash: "0",
                  hash: crypto.AES.encrypt(
                    data.message + data.uid + data.to,
                    key.key
                  ).toString(),
                  room_id: data.to + data.uid
                });
              } else {
                newmessage = new message({
                  sender: data.uid,
                  receiver: data.to,
                  message: crypto.AES.encrypt(data.message, key.key).toString(),
                  previous_hash: msgres.hash,
                  hash: crypto.AES.encrypt(
                    data.message + data.uid + data.to,
                    key.key
                  ).toString(),
                  room_id: data.to + data.uid
                });
              }
              newmessage.save().then((newres) => {
                io.to(data.to).emit("newMessage", {
                  message: data.message,
                  room: res[0],
                  sender: data.uid,
                });
              });
            });
        });
      }
    });
  });

  socket.on("addNewContact",(data)=>{
    io.to(data._id).emit("newContact",{});
  });

  socket.on("online", (data) => {
    socket.join(data.uid);
    UsersOnline.push(socket.rooms[0]);
    io.sockets.emit("onlineUsers", { users: UsersOnline });
  });
  console.log("a user connected");
});

http.listen(5000, () => {
  console.log("listening on *:5000");
});
