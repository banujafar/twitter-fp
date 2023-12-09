import { CgProfile } from 'react-icons/cg';
import { Link } from 'react-router-dom';
import { RootState } from '../../../store';
import { useSelector } from 'react-redux';

const ChatItem = ({ chats, onClick }: any) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const userData = chats.user1.id === user?.userId ? chats.user2 : chats.user1;

  return (
    <div className="hover:bg-[#f7f7f7] cursor-pointer py-4 px-3" onClick={() => onClick(chats.id)}>
      <div className="flex items-center">
        <div className="w-auto">
          <Link to={`/profile/${userData?.username}`} className="flex">
            {userData?.profilePhoto ? (
              <img
                src={`https://res.cloudinary.com/dclheeyce/image/upload/v1701517376/${userData?.profilePhoto}`}
                alt={`${userData?.profilePhoto}'s profile`}
                className={`w-16 h-16 rounded-full mb-4 sm:mb-0 object-cover`}
              />
            ) : (
              <CgProfile className="text-gray-500 w-16 h-16" />
            )}
          </Link>
        </div>
        <div className="ml-2">
          <h1 className="text-lg font-medium">{userData?.username}</h1>
          <Link to={`/profile/${userData?.username}`} className="font-semibold text-base text-[#536471]">
            &#64;{userData?.username}
          </Link>
        </div>
      </div>
  
    </div>
  );
};

export default ChatItem;
