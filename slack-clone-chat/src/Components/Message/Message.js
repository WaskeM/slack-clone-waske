import React from "react";
import "./Message.css";

function Message({ message, timestamp, user, userImage }) {
  //let date = new Date(timestamp?.toDate()).toUTCString();
  //let date = new Date.now();

  return (
    <div className="message">
      <img src={userImage} alt="" />
      <div className="message-info">
        <h4>
          {user} <span className="message-timestamp">{/*date*/}</span>
        </h4>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default Message;
