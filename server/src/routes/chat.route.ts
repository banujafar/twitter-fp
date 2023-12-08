import { Router, Request, Response } from 'express';
import tryCatch from '../utils/tryCatch.ts';
import { Chat } from '../entity/Chat.entity.ts';
import AppError from '../config/appError.ts';

const chatRouter = Router();

chatRouter.post(
  '/',
  tryCatch(async (req: Request, res: Response) => {
    const { firstId, secondId } = req.body;

    if (!firstId || !secondId) {
      throw new AppError('Invalid user IDs', 400);
    }

    const existingChat = await Chat.findOne({
      where: {
        user1: { id: firstId },
        user2: { id: secondId },
      },
      relations: ['user1', 'user2'],
    });

    if (existingChat) {
      return res.status(400).json({ message: 'Chat is already exists' });
    }

    const newChat = new Chat();
    newChat.user1 = firstId;
    newChat.user2 = secondId;

    await newChat.save();

    return res.status(201).json(newChat);
  }),
);

chatRouter.get(
  '/:userId',
  tryCatch(async (req: Request, res: Response) => {
    const { userId } = req.params;

    if (!userId) {
      throw new AppError('Invalid user ID', 400);
    }

    const chat = await Chat.createQueryBuilder('chat')
      .where('chat.user1 = :userId OR chat.user2 = :userId', { userId })
      .leftJoinAndSelect('chat.user1', 'user1')
      .leftJoinAndSelect('chat.user2', 'user2')
      .getMany();

    return res.status(201).json(chat);
  }),
);

export default chatRouter;
