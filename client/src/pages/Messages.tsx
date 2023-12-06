import MessageItem from '../components/ui/Messages/MessageItem';

const Messages = () => {
  return (
    <>
      <div className="mx-2 sm:mx-0 xs:mx-0 border border-gray-200 w-full">
        <div className="flex h-full w-full">
          <div className="w-2/5 bg-white border-r border-navHoverColor">
            <div className="header p-3 border-b border-gray-200">
              <h1 className="text-2xl font-semibold">Messages</h1>
            </div>
            <MessageItem />
          </div>
          <div className="w-3/5 bg-white p-3">
            <div className="flex flex-col h-full justify-center items-center text-center mx-auto max-w-[350px]">
              <h1 className="font-bold text-3xl">Select a message</h1>
              <p className="text-[#536471] mt-2">
                Choose from your existing conversations, start a new one, or just keep swimming.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Messages;
