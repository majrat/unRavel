import { useNavigate } from "react-router-dom";

const ChatBody = ({ messages, userId, lastMessageRef, group }) => {
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
          <p className="text-xl font-bold text-accentColor self-center ml-3">
            {group?.name}
          </p>
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
          message?.from?._id === userId ? (
            <div className="message__chats mt-3" key={message?._id}>
              <div className="message__sender rounded-bl-lg rounded-br-lg rounded-tl-lg bg-accentColor text-lightColor">
                <p>{message?.message}</p>
              </div>
            </div>
          ) : (
            <div className="message__chats mt-3" key={message?._id}>
              <div className="flex">
                <img
                  src={message?.from?.profile_photo || "/profile-setup.gif"}
                  className="hidden sm:block w-9 h-9 object-cover rounded-full shadow mr-3"
                  alt=""
                />
                <div className="relative message__recipient rounded-bl-lg rounded-br-lg rounded-tr-lg bg-secondaryColor">
                  <p className="text-gray-600 text-xs absolute top-0.5 left-1 w-36 truncate">
                    {message?.from?.first_name + " " + message?.from?.last_name}
                  </p>
                  <p className="text-gray-600 text-xs absolute top-0.5 right-1 w-36 truncate">
                    {message?.from?.email}
                  </p>
                  <p className="mt-3">{message?.message}</p>
                </div>
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
