import { CgProfile } from 'react-icons/cg';
import { Link } from 'react-router-dom';

const MessageItem = ({ chats, onClick }: any) => {
  return (
    <div className="hover:bg-[#f7f7f7] cursor-pointer py-4 px-3" onClick={() => onClick(chats.id)}>
      <div className="flex items-center">
        <div className="w-auto">
          <Link to={`/profile/${chats.user2.username}`} className="flex text-5xl">
            {chats.user2?.profilePhoto ? (
              <img
                src={`https://res.cloudinary.com/dclheeyce/image/upload/v1701517376/${chats.user2?.profilePhoto}`}
                alt={`${chats.user2?.profilePhoto}'s profile`}
                className={`w-16 h-16 rounded-full mb-4 sm:mb-0 object-cover`}
              />
            ) : (
              <CgProfile className="text-gray-500" />
            )}
          </Link>
        </div>
        <div className="ml-2">
          <h1 className="text-lg font-medium">{chats.user2.username}</h1>
          <Link to={`/profile/${chats.user2.username}`} className="font-semibold text-base text-[#536471]">
            &#64;{chats.user2.username}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
