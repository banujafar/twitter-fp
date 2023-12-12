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
    const { chat_id, sender_id, text } = req.body;

    if (!chat_id || !sender_id || !text) {
      throw new AppError('req body not found', 400);
    }

    const sender = await User.findOne({
      where: { id: sender_id },
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
      where: { id: chat_id },
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
  '/:chat_id',
  tryCatch(async (req: Request, res: Response) => {
    const { chat_id } = req.params;

    if (!chat_id) {
      throw new AppError('Invalid chat ID', 400);
    }

    const messages = await Message.find({
      where: { chat: { id: parseInt(chat_id, 10) } },
      relations: ['sender', 'chat'],
    });

    const response = messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    return res.status(200).json(response);
  }),
);

messageRouter.post(
  '/mark-as-read',
  tryCatch(async (req: Request, res: Response) => {
    const { chat_id } = req.body;

    if (!chat_id) {
      throw new AppError('Chat ID is required', 400);
    }

    const updatedMsg = await Message.update({ chat: { id: chat_id } }, { isRead: true });

    res.status(200).json(updatedMsg);
  })
)

export default messageRouter;
