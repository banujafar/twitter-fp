import { Router, Request, Response } from 'express';
import tryCatch from '../utils/tryCatch.ts';
import AppError from '../config/appError.ts';
import { UserPost } from '../entity/UserPost.entity.ts';
import { User } from '../entity/user.entity.ts';
// import multer from 'multer';

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

const postRouter = Router();

postRouter.get(
  '/',
  tryCatch(async (req: Request, res: Response) => {
    const posts = await UserPost.find({
      relations: ['user'],
    });

    if (!posts || posts.length === 0) {
      throw new AppError('No posts found', 404);
    }

    return res.status(200).json(posts);
  }),
);

postRouter.post(
  '/',
  // upload.single('imageInput'),
  tryCatch(async (req: Request, res: Response) => {
    const { content, user_id } = req.body;
    // const imageBuffer = req.file?.buffer;

    if (!content) {
      throw new AppError('Cannot be empty', 400);
    }

    const user = await User.findOne({ where: { id: user_id } });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const post = new UserPost();
    post.content = content;
    post.user = user;
    // post.img = null;
    // post.img = imageBuffer;

    await post.save();

    return res.status(201).json(post);
  }),
);

export default postRouter;
