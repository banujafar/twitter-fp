import { IMessage } from './message';
import { IUser } from './user';

export interface IChatInitial {
  chats: IChat[];
  error: string | null;
  loading: boolean | null;
}

export interface IChat {
  id: number;
  user1: IUser;
  user2: IUser;
  messages : IMessage[]
}
