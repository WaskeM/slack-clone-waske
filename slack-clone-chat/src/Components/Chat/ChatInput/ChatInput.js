import React, { useState } from "react";
import "./ChatInput.css";
import db from "../../../firebase";
import firebase from "../../../firebase";
import { useStateValue } from "../../../StateProvider";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import { socket } from "../../../SocketServer";
import ImageIcon from "@material-ui/icons/Image";

function ChatInput({ channelName, channelId, addMessage }) {
  const [input, setInput] = useState("");
  const [{ user }] = useStateValue();

  const [file, setFile] = useState(null);

  const types = ["image/png", "image/jpeg"];
  const [error, setError] = useState(null);

  /*
  const sendMessage = e => {
    e.preventDefault();

    if (channelId) {
      db.collection("rooms")
        .doc(channelId)
        .collection("messages")
        .add({
          message: input,
          timestamp: Date.now(),
          user: user.displayName,
          userImage: user.photoURL
        });
    }
  };
*/
  const sendMessage = e => {
    e.preventDefault();

    if (channelId) {
      addMessage({ input });
    }

    setInput("");
  };

  const openFileDialogClicked = e => {
    openFileDialog(".txt,text/plain", true, fileDialogChanged);
  };
  function openFileDialog(accept, multy = false, callback) {
    var inputElement = document.createElement("input");
    inputElement.type = "file";
    inputElement.accept = accept;
    if (multy) {
      inputElement.multiple = multy;
    }
    if (typeof callback === "function") {
      inputElement.addEventListener("change", callback);
    }
    inputElement.dispatchEvent(new MouseEvent("click"));
  }

  function fileDialogChanged(event) {
    [...this.files].forEach(file => {
      console.log(file);

      var reader = new FileReader();
      reader.readAsText(file, "UTF-8");

      reader.onload = readerEvent => {
        var content = readerEvent.target.result;
        socket.emit("saljemFajl", {
          type: file.type,
          user: user.displayName,
          photoURL: user.photoURL,
          name: file.name,
          channelId: channelId,
          content: content
        });
      };
    });
    //sending IMGs to firestorage
    /*function changeHandler(e) {
      //console.log("changed");
      let selected = e.target.files[0];
      //console.log(selected);

      if (selected && types.includes(selected.type)) {
        setFile(selected);
        setError("");
      } else {
        setFile(null);
        setError("Please select an image file (png or jpeg)");
      }
    }*/
  }
  return (
    <div className="chatInput">
      <form>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={`Message #${channelName?.toLowerCase()}`}
        />
        <button type="submit" onClick={sendMessage}>
          SEND
        </button>
      </form>
      <button className="button" onClick={openFileDialogClicked}>
        File <AttachFileIcon />
      </button>
      <button className="button2">
        <ImageIcon />
      </button>

      <form>
        <label>
          <input type="file" />
          <span>
            <ImageIcon />
          </span>
        </label>
        <div className="output">
          {error && <div className="error"> {error} </div>}
          {file && <div>{file.name}</div>}
          {/*file && <ProgressBar file={file} setFile={setFile} />*/}
        </div>
      </form>
    </div>
  );
}

export default ChatInput;
