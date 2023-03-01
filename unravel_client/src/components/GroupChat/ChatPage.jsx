import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import socketIO from "socket.io-client";
import ChatBody from "./ChatBody";
import ChatFooter from "./ChatFooter";
const socket = socketIO.connect("http://localhost:8080");
// import { useLocation } from "react-router-dom";
// import { useSelector } from "react-redux";

const ChatPage = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const lastMessageRef = useRef(null);
  const userName = user?.first_name + " " + user?.last_name;

  const location = useLocation();
  let group;
  if (location?.state !== null) {
    console.log(location.state);
    group = location?.state;
  }
  console.log(group);
  useEffect(() => {
    socket.on("messageResponse", (data) => setMessages([...messages, data]));
  }, [socket, messages]);

  useEffect(() => {
    // scroll to bottom every time messages change
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat px-12 mt-20">
      <div className="chat__main">
        <ChatBody
          group={group}
          messages={messages}
          userName={userName}
          lastMessageRef={lastMessageRef}
        />
        <ChatFooter socket={socket} userName={userName} />
      </div>
    </div>
  );
};

export default ChatPage;
