import { useState } from "react";

const ChatFooter = ({ socket, userName }) => {
  const [message, setMessage] = useState("");
  console.log(userName);

  const handleSendMessage = (e) => {
    e.preventDefault();
    console.log(message);
    if (message.trim()) {
      socket.emit("message", {
        text: message,
        name: userName,
        id: `${socket.id}${Math.random()}`,
        socketID: socket.id,
      });
    }
    setMessage("");
  };
  return (
    <div className="chat__footer rounded-md">
      <form className="form" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Write message"
          className="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="sendBtn bg-accentColor rounded-md shadow-md hover:shadow-inner font-semibold">SEND</button>
      </form>
    </div>
  );
};

export default ChatFooter;
