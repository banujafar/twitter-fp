import { LuSendHorizonal } from 'react-icons/lu';
import MessageItem from '../components/ui/Messages/MessageItem';
import { CgProfile } from 'react-icons/cg';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { getUserChats } from '../store/features/chat/chatSlice';

const Messages = () => {
  const dispatch = useDispatch();
  const userChats = useSelector((state: RootState) => state.chat.chats);
  const user = useSelector((state: RootState) => state.auth.user);
  const loading = useSelector((state: RootState) => state.chat.loading);

  useEffect(() => {
    const userId = user?.userId;
    dispatch(getUserChats(userId) as any);
  }, [dispatch]);

  return (
    <>
      <div className="mx-2 sm:mx-0 xs:mx-0 border border-gray-200 w-full overflow-hidden">
        <div className="flex h-screen w-full">
          <div className="w-2/5 bg-white border-r border-navHoverColor">
            <div className="header p-3 border-b border-gray-200">
              <h1 className="text-2xl font-semibold">Messages</h1>
            </div>
            {loading ? (
              <p>Loading chats...</p>
            ) : userChats && userChats.length > 0 ? (
              userChats.map((chats) => <MessageItem chats={chats} key={chats.id} />)
            ) : (
              <p className='text-lg'>Welcome to your inbox!</p>
            )}
          </div>
          {userChats.length ? (
            <div className="w-3/5 bg-white relative h-screen">
              <div className="px-4 py-1 border-b border-navHoverColor">
                <div className="flex items-center">
                  <div className="w-auto">
                    <Link to={`/profile/`} className="flex text-5xl outline-none">
                      <CgProfile className="text-gray-500" />
                    </Link>
                  </div>
                  <div className="ml-2">
                    <h1 className="text-lg">username</h1>
                  </div>
                </div>
              </div>
              <div className="px-4 overflow-y-auto h-[520px] flex-1"></div>
              <div className="bottom-0 left-0 absolute w-full px-4 py-1 border-t border-navHoverColor">
                <div className="flex items-center justify-between bg-[#eff3f4] px-3 py-1 rounded-2xl">
                  <input
                    type="text"
                    placeholder="Start a new message"
                    className="bg-transparent w-full p-2 focus:outline-none"
                  />
                  <button className="bg-none flex w-9 h-9 items-center justify-center text-3xl text-twitterColor">
                    <LuSendHorizonal />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-3/5 bg-white p-3">
              <div className="flex flex-col h-full justify-center items-center text-center mx-auto max-w-[350px]">
                <h1 className="font-bold text-3xl">Select a message</h1>
                <p className="text-[#536471] mt-2">
                  Choose from your existing conversations, start a new one, or just keep swimming.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Messages;
