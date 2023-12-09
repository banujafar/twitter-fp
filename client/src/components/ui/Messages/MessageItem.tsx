import { useSelector } from 'react-redux';
import { IMessage } from '../../../models/message';
import { RootState } from '../../../store';

const MessageItem = ({ msg }: { msg?: IMessage }) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const isCurrentUserMessage = msg?.sender?.id === user?.userId

  return (
    <div className={`w-fit bg-blue-600 p-2 rounded-3xl mb-2 mt-2 ${isCurrentUserMessage ? 'ml-auto': 'mr-auto'}`}>
      <p className="text-white text-lg">{msg?.messageText}</p>
    </div>
  );
};

export default MessageItem;
