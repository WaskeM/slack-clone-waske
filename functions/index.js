const firebase = require("firebase");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const app = express();
const socketIo = require("socket.io");
const port = process.env.PORT || 5002;
const http = require("http");
app.use(cors({ origin: true }));

const server = http.createServer(app);

var serviceAccount = require("./permissions.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://my-slack-f1bca.firebaseio.com"
});
const db = admin.firestore();

const io = socketIo(server);

//app.get('/hello-world', (req, res) => {
//  return res.status(200).send('Hello World!');
//});

io.on("connection", socket => {
  console.log("New client connected: " + socket.id);
  console.log(socket.request.sessionID);

  socket.on("reconnect", socket => {
    console.log("Client reconnected: " + socket.id);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

  socket.on("getRoomList", () => {
    console.log("getRoomList");
    const rooms = db.collection("rooms");
    let res = [];
    const roomsList = rooms.get().then(data => {
      data.forEach(doc => {
        res.push({
          id: doc.id,
          name: doc.data().name
        });
      });
      io.emit("roomsList", res);
      return true;
    });
  });

  socket.on("userLogin", roomIdData => {
    console.log("user login: " + roomIdData.roomId);

    const rooms = db.collection("rooms").doc(roomIdData.roomId);
    const a = rooms.get().then(doc => {
      socket.emit("roomDetails", doc.data());
      return true;
    });

    const messsagesDb = db
      .collection("rooms")
      .doc(roomIdData.roomId)
      .collection("messages")
      .orderBy("timestamp");
    const msgs = messsagesDb.get().then(data => {
      let res = [];
      data.forEach(doc => {
        res.push({
          id: doc.id,
          user: doc.data().user,
          userImage: doc.data().userImage,
          timestamp: doc.data().timestamp,
          message: doc.data().message
        });
      });
      socket.emit("userLoged", res);
      return true;
    });
  });

  socket.on("addRoom", newRoomData => {
    console.log("add room");
    db.collection("rooms")
      .add({
        name: newRoomData.name
      })
      .then(res => {
        const rooms = db.collection("rooms");
        let rez = [];
        const b = rooms.get().then(data => {
          data.forEach(doc => {
            rez.push({
              id: doc.id,
              name: doc.data().name
            });
          });
          io.emit("roomList", rez);
          return true;
        });
      });
  });

  socket.on("sendMessage", msg => {
    console.log("New message arrived from client:" + msg.channelId);

    let data = JSON.parse(
      JSON.stringify({
        message: msg.input,
        timestamp: Date.now(),
        user: msg.user,
        userImage: msg.photoURL
      })
    );

    const a = db
      .collection("rooms")
      .doc(msg.channelId)
      .collection("messages")
      .add(data)
      .then(res => {
        data.id = res.id;
        data.roomId = msg.channelId;
        io.emit("addMessageFromServer", data);
        return true;
      });
  });

  socket.on("sendingFile", msg => {
    console.log("sendingFromClient:");
    console.log(msg);
    //socket.broadcast.emit("sendingFileFromServer", msg)
    // io.emit("sendingFileFromServer", msg)
    const b = db
      .collection("files")
      .add(msg)
      .then(res => {
        msg.id = res.id;

        let data = JSON.parse(
          JSON.stringify({
            message: "<a |/downloadFile/" + msg.id + "|" + msg.ime + "|",
            timestamp: Date.now(),
            user: msg.user,
            userImage: msg.photoURL
          })
        );

        const a = db
          .collection("rooms")
          .doc(msg.channelId)
          .collection("messages")
          .add(data)
          .then(res => {
            data.id = res.id;
            data.roomId = msg.channelId;
            io.emit("addMessageFromServer", data);
            return true;
          });
      });
  });
});

// getting file
app.get("/downloadFile/:item_id", (req, res) => {
  (async () => {
    try {
      const document = db.collection("files").doc(req.params.item_id);
      let item = await document.get();
      let response = item.data();

      var fileContents = response.content;

      var readStream = new stream.PassThrough();
      readStream.end(fileContents);

      res.set(
        "Content-disposition",
        "attachment; filename=" + item.data().name
      );
      res.set("Content-Type", item.data().type);

      readStream.pipe(res);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

exports.app = functions.https.onRequest(app);

server.listen(port, () => console.log(`Listening on port ${port}`));

//app.listen(3001);
