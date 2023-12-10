import { Router, Request, Response } from 'express';
import tryCatch from '../utils/tryCatch.ts';
import AppError from '../config/appError.ts';
import { Message } from '../entity/Message.entity.ts';
import { User } from '../entity/user.entity.ts';
import { Chat } from '../entity/Chat.entity.ts';

const messageRouter = Router();

messageRouter.post(
  '/',
  tryCatch(async (req: Request, res: Response) => {
    const { chatId, senderId, text } = req.body;

    if (!chatId || !senderId || !text) {
      throw new AppError('req body not found', 400);
    }

    const sender = await User.findOne({
      where: { id: senderId },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    if (!sender) {
      throw new AppError('Sender not found', 404);
    }

    const chat = await Chat.findOne({
      where: { id: chatId },
    });

    if (!chat) {
      throw new AppError('Chat not found', 404);
    }
    

    const message = new Message();
    message.chat = chat;
    message.sender = sender;
    message.messageText = text;
    message.isRead = false;

    await message.save();

    res.status(200).json(message);
  }),
);

messageRouter.get(
  '/:chatId',
  tryCatch(async (req: Request, res: Response) => {
    const { chatId } = req.params;

    if (!chatId) {
      throw new AppError('Invalid chat ID', 400);
    }

    const messages = await Message.find({
      where: { chat: { id: parseInt(chatId, 10) } },
      relations: ['sender', 'chat'],
    });

    return res.status(200).json(messages);
  }),
);

export default messageRouter;
