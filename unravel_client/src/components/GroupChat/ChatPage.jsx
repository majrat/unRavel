import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import socketIO from "socket.io-client";
import ChatBody from "./ChatBody";
import ChatFooter from "./ChatFooter";
import config from "../../utils/constants";

const socket = socketIO.connect("http://localhost:8080");
// import { useLocation } from "react-router-dom";
// import { useSelector } from "react-redux";

const ChatPage = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const lastMessageRef = useRef(null);
  const userId = user?._id;

  const location = useLocation();
  let group;
  if (location?.state !== null) {
    group = location?.state;
  }

  async function getChats() {
    if (user) {
      await axios
        .get(`${config.VITE_SERVER_API}/chats`, {
          params: { groupId: group._id },
        })
        .then((res) => {
          setMessages(res?.data?.messages);
        });
    }
  }
  useEffect(() => {
    getChats();
  }, [socket, messages, user, group]);

  useEffect(() => {
    // scroll to bottom every time messages change
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat sm:px-16 px-4 mt-20">
      <div className="chat__main">
        <ChatBody
          group={group}
          messages={messages}
          userId={userId}
          lastMessageRef={lastMessageRef}
        />
        <ChatFooter socket={socket} messages={messages} userId={userId} group={group} />
      </div>
    </div>
  );
};

export default ChatPage;
