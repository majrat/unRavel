import { useState } from "react";

const ChatFooter = ({ socket, userId, group }) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && userId && group) {
      socket.emit("message", {
        text: message,
        from: userId,
        id: `${socket.id}${Math.random()}`,
        socketID: socket.id,
        groupId: group._id,
      });
    }
    setMessage("");
  };
  return (
    <div className="chat__footer sm:h-[10vh] h-[7vh] rounded-md">
      <form className="form" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Write message"
          className="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="sendBtn bg-accentColor rounded-md shadow-md hover:shadow-inner font-semibold">
          SEND
        </button>
      </form>
    </div>
  );
};

export default ChatFooter;
