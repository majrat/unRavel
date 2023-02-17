import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
const GoToChatWidget = (props) => {
  console.log(props);
  return (
    <Link
      to="/chat"
      state={props?.username}
      className="rounded-full h-20 w-20 shadow-lg shadow-accentColor bg-accentColor/30 hover:bg-accentColor/90 cursor-pointer text-lightColor  backdrop-blur-md bottom-8 right-8 flex flex-col justify-center items-center z-50 fixed"
    >
      <ChatBubbleLeftRightIcon className="mt-2" />
      <p className="text-xs mb-2">Chat</p>
    </Link>
  );
};

export default GoToChatWidget;
