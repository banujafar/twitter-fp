import { Router, Request, Response } from 'express';
import tryCatch from '../utils/tryCatch.ts';
import AppError from '../config/appError.ts';
import { UserPost } from '../entity/UserPost.entity.ts';

const postRouter = Router();

postRouter.post(
  '/',
  tryCatch(async (req: Request, res: Response) => {
    const { content } = req.body;
    if (!content ) {
      throw new AppError('Cannot be empty', 400);
    }
    const post = new UserPost();
    post.content = content;

    await post.save();
    return res.status(201).json(post);
  })
);

export default postRouter;
