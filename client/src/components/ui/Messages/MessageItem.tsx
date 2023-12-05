import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";

const MessageItem = () => {
  return (
    <div className="hover:bg-navHoverColor cursor-pointer py-4 px-3">
      <div className="flex items-center">
        <div className="w-auto">
          <Link to={`/profile/`} onClick={(e) => e.stopPropagation()} className="flex text-5xl">
            <CgProfile className="text-gray-500" />
          </Link>
        </div>
        <div className="ml-2">
          <h1 className="text-lg">username</h1>
          <Link to={`/profile/`} className="font-semibold text-lg text-[#536471]">
            @username
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
