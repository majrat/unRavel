import { useNavigate } from "react-router-dom";

const ChatBody = ({ messages, userName, lastMessageRef, group }) => {
  const navigate = useNavigate();

  const handleLeaveChat = () => {
    navigate("/");
  };

  return (
    <>
      <header className="chat__mainHeader bg-primaryColor/50 rounded-md">
        <div className="flex">
          <img
            src={group.group_profile}
            className="w-12 rounded-full h-12"
            alt=""
          />
          <p className="text-xl font-bold text-accentColor self-center ml-3">{group?.name}</p>
        </div>
        <button
          className="leaveChat__btn rounded bg-orange-600/60 hover:bg-orange-600"
          onClick={handleLeaveChat}
        >
          LEAVE CHAT
        </button>
      </header>

      <div className="message__container">
        {messages.map((message) =>
          message?.name === userName ? (
            <div className="message__chats" key={message?.id}>
              <p className="sender__name">You</p>
              <div className="message__sender bg-accentColor text-lightColor">
                <p>{message?.text}</p>
              </div>
            </div>
          ) : (
            <div className="message__chats" key={message?.id}>
              <p>{message?.name}</p>
              <div className="message__recipient bg-secondaryColor">
                <p>{message?.text}</p>
              </div>
            </div>
          )
        )}
        <div ref={lastMessageRef} />
      </div>
    </>
  );
};

export default ChatBody;
