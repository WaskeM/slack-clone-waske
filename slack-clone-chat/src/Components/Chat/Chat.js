import React, { useEffect, useState, useRef } from "react";
import "./Chat.css";
import { useParams } from "react-router-dom";
import StarBorderOutlinedIcon from "@material-ui/icons/StarBorderOutlined";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import db from "../../firebase";
import Message from "../Message/Message";
import ChatInput from "./ChatInput/ChatInput.js";
import { useStateValue } from "../../StateProvider";
import { socket } from "../../SocketServer";
import { useImmer } from "use-immer";
import Emoji from "./Emoji";

function Chat() {
  const { roomId } = useParams();
  const [roomDetails, setRoomDetails] = useState(null);
  const [roomMessages, setRoomMessages] = useImmer([]);

  const [{ user }] = useStateValue([]);

  const messagesEndRef = useRef(null);

  /*
  useEffect(() => {
    if (roomId) {
      db.collection("rooms")
        .doc(roomId)
        .onSnapshot(snapshot => setRoomDetails(snapshot.data()));
    }
    db.collection("rooms")
      .doc(roomId)
      .collection("messages")
      .orderBy("timestamp", "asc")
      .onSnapshot(snapshot =>
        setRoomMessages(snapshot.docs.map(doc => doc.data()))
      );
  }, [roomId]);
*/
  /*
  useEffect(() => {
    if (roomId) {
      socket.emit("userLogin", { roomId: roomId });
    }
  }, [roomId]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connect");
    });

      socket.on("userLoged", (data) => {
        console.log("userLoged:");
        setRoomMessages((draft) => {
          draft.splice(0, draft.length);
        });
        data.forEach((elem) => setRoomMessages((draft) => {
          draft.push(elem);
        })
    );
    scrollToBottom(); 

  });
  console.log("AddMessage to chat:");
  }
  //console.log(roomDetails);
  //console.log("MESSAGES >>> ", roomMessages);
*/

  useEffect(() => {
    if (roomId) {
      socket.emit("userLogin", { roomId: roomId });
    }
  }, [roomId]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connect");
    });

    socket.on("userLoged", data => {
      console.log("userLoged:");
      setRoomMessages(draft => {
        draft.splice(0, draft.length);
      });
      data.forEach(elem =>
        setRoomMessages(draft => {
          draft.push(elem);
        })
      );
      //scrollToBottom();
    });

    socket.on("roomDetails", data => {
      console.log("roomDetails: " + data);
      setRoomDetails(data);
    });

    socket.on("addMessageFromServer", data => {
      if (data.roomId === roomId) {
        console.log("addMessageFromServer");
        setRoomMessages(draft => {
          draft.push(data);
        });
        //scrollToBottom();
      }
    });

    socket.on("reconnect", attemptNumber => {
      console.log("reconnect: " + attemptNumber);
    });

    socket.on("disconnect", () => {
      console.log("disconnect");
      socket.removeAllListeners();
    });

    socket.on("serverSaljeFajl", poruka => {
      console.log("serverSaljeFajl");
      console.log(poruka);
    });

    return () => {
      socket.removeAllListeners();
    };
  }, [roomMessages, setRoomMessages]);

  /*
  function scrollToBottom() {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }
*/

  function addMessage(message) {
    socket.emit("sendMessage", {
      input: message.input,
      channelId: roomId,
      timestamp: Date.now(),
      user: user.displayName,
      photoURL: user.photoURL,
      roomId: roomId
    });
    console.log("AddMessage in chat.js:" + message.input);
  }

  return (
    <div className="chat">
      <div className="chat-header">
        <div className="chat-header-left">
          <h4 className="chat-channel-name">
            <strong>#{roomDetails?.name}</strong>
            <StarBorderOutlinedIcon />
          </h4>
        </div>
        <div className="chat-header-right">
          <p>
            <InfoOutlinedIcon /> Details
          </p>
        </div>
      </div>
      <div className="chat-messages">
        {roomMessages.map(({ message, timestamp, user, userImage }) => (
          <Message
            message={message}
            timestamp={timestamp}
            user={user}
            userImage={userImage}
          />
        ))}
        {/*<Message /> */}
      </div>
      {/*<Emoji />*/}
      <ChatInput
        channelName={roomDetails?.name}
        channelId={roomId}
        addMessage={addMessage}
      />
    </div>
  );
}

export default Chat;
