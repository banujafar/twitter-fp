import { LuSendHorizonal } from 'react-icons/lu';
import ChatItem from '../components/ui/Messages/ChatItem';
import { CgProfile } from 'react-icons/cg';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { getUserChats } from '../store/features/chat/chatSlice';
import { getMessages, sendMessage } from '../store/features/message/messageSlice';
import { IMessage } from '../models/message';
import MessageItem from '../components/ui/Messages/MessageItem';

const Messages = () => {
  const dispatch = useDispatch();
  const userChats = useSelector((state: RootState) => state.chat.chats);
  const user = useSelector((state: RootState) => state.auth.user);
  const loading = useSelector((state: RootState) => state.chat.loading);
  const [selectedChat, setSelectedChat] = useState(0);
  const [messageText, setMessageText] = useState('');
  const messages = useSelector((state: RootState) => state.message.messages);
  const loadingMessages = useSelector((state: RootState) => state.message.loading);

  const selectedChatData = userChats.find((chat) => chat.id === selectedChat);
  const userData = selectedChatData?.user1.id === user?.userId ? selectedChatData?.user2 : selectedChatData?.user1;

  console.log(messages)

  useEffect(() => {
    const userId = user?.userId;
    dispatch(getUserChats(userId) as any);
  }, [dispatch]);

  const handleChatItemClick = (chatId: number) => {
    setSelectedChat(chatId);
  };

  useEffect(() => {
    const chatId = selectedChat;
    dispatch(getMessages(chatId) as any);
  }, [dispatch, selectedChatData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const chatId = selectedChat;
    const senderId = user?.userId;
    const text = messageText;

    if (!text.length) {
      return;
    }

    await dispatch(sendMessage({ chatId, senderId, text }) as any);
    setMessageText('');
  };

  return (
    <>
      <div className="mx-2 sm:mx-0 xs:mx-0 border border-gray-200 w-full overflow-hidden">
        <div className="flex h-screen w-full">
          <div className="w-2/5 bg-white border-r border-navHoverColor overflow-y-auto">
            <div className="p-5 border-b border-gray-200">
              <h1 className="text-2xl font-semibold">Messages</h1>
            </div>
            {loading ? (
              <p>Loading chats...</p>
            ) : userChats && userChats.length > 0 ? (
              userChats.map((chats) => (
                <ChatItem chats={chats} key={chats.id} onClick={() => handleChatItemClick(chats.id)} />
              ))
            ) : (
              <p className="py-4 px-3 text-2xl font-medium">Welcome to your inbox!</p>
            )}
          </div>
          {selectedChat ? (
            <div className="w-3/5 bg-white relative h-screen">
              <div className="px-4 py-1 border-b border-navHoverColor">
                <div className="flex items-center">
                  <div className="w-auto">
                    <Link to={`/profile/${userData?.username}`} className="flex outline-none">
                      {userData?.profilePhoto ? (
                        <img
                          src={`https://res.cloudinary.com/dclheeyce/image/upload/v1701517376/${userData.profilePhoto}`}
                          alt={`${userData.username}'s profile`}
                          className={`w-16 h-16 rounded-full mb-4 sm:mb-0 object-cover`}
                        />
                      ) : (
                        <CgProfile className="text-gray-500 w-16 h-16" />
                      )}
                    </Link>
                  </div>
                  <div className="ml-2">
                    <h1 className="text-lg">{userData?.username}</h1>
                  </div>
                </div>
              </div>
              <div className="px-4 overflow-y-auto h-[520px] flex-1">
                {loadingMessages ? (
                  <p>Loading messages...</p>
                ) : messages && messages.length > 0 ? (
                  messages.map((msg) => (
                    <MessageItem msg={msg as IMessage} key={msg.id} />
                  ))
                ) : (
                  ''
                )}
              </div>
              <div className="bottom-0 left-0 absolute w-full px-4 py-1 border-t border-navHoverColor">
                <div className="flex items-center justify-between bg-[#eff3f4] px-3 py-1 rounded-2xl">
                  <form onSubmit={handleSendMessage} className="flex w-full items-center justify-between">
                    <input
                      type="text"
                      placeholder="Start a new message"
                      className="bg-transparent w-full p-2 focus:outline-none"
                      value={messageText}
                      onChange={(e) => handleInputChange(e)}
                    />
                    <button className="bg-none flex w-9 h-9 items-center justify-center text-3xl text-twitterColor">
                      <LuSendHorizonal />
                    </button>
                  </form>
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
