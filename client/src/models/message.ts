import { IChat } from "./chat";
import { IUser } from "./user";

export interface IMessageInitial {
  messages: IMessage[];
  error: string | null;
  loading: boolean | null;
}

export interface IMessage {
  id: number;
  chat: IChat;
  sender: IUser;
  messageText: string;
  isRead: boolean;
  timestamp: Date;
}
