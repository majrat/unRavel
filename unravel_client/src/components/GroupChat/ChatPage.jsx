import socketIO from "socket.io-client";
import ChatBar from "./ChatBar";
import ChatBody from "./ChatBody";
import ChatFooter from "./ChatFooter";
const socket = socketIO.connect("http://localhost:8080");
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ChatPage = () => {
 
  return (
    <div className="chat">
      <ChatBar />
      <div className="chat__main">
        <ChatBody />
        <ChatFooter socket={socket} />
      </div>
    </div>
  );
};

export default ChatPage;
