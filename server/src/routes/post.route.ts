import { Router, Request, Response } from 'express';
import tryCatch from '../utils/tryCatch.ts';
import AppError from '../config/appError.ts';
import { UserPost } from '../entity/UserPost.entity.ts';
import { User } from '../entity/user.entity.ts';
import multer from 'multer';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { PostRetweet } from '../entity/PostRetweet.entity.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, res, callback) => {
    const uploadDir = join(__dirname, '../../../client/src/assets/uploads');

    return callback(null, uploadDir);
  },
  filename: (req, file, callback) => {
     const uniqueImgId = uuidv4();
    const originalName = file.originalname;
    const filename = `${uniqueImgId}_${originalName}`;
    callback(null, filename);
  },
});

const uploads = multer({ storage: storage });

const postRouter = Router();

postRouter.get(
  '/',
  tryCatch(async (req: Request, res: Response) => {
    const posts = await UserPost.find({
      relations: ['user'],
    });
    const retweets = await PostRetweet.find({ relations: ['retweetedFromPost', 'post', 'user'] });
    if (!posts || posts.length === 0) {
      throw new AppError('No posts found', 404);
    }
    const filteredPostsWithRetweets = posts.map((post) => {
      const retweetsForPost = retweets.filter((retweet) => retweet.retweetedFromPost?.id === post.id);
      return {
        ...post,
        retweets: retweetsForPost.map((r) => r.post),
        retweetFrom: retweets.filter((retweet) => retweet.post?.id === post.id),
      };
    });
    return res.status(200).json(filteredPostsWithRetweets);
  }),
);

postRouter.post(
  '/',
  uploads.array('files'),
  tryCatch(async (req: Request, res: Response) => {
    const files = (req.files as Express.Multer.File[]) || [];
    const { content, user_id, retweeted_id } = req.body;

    if (!content && !files) {
      throw new AppError('Cannot be empty', 400);
    }

    const user = await User.findOne({ where: { id: user_id } });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const post = new UserPost();
    post.content = content;
    post.user = user;

    post.img = files.map((file) => file.filename);

    await post.save();

    if (retweeted_id) {
      const retweetFromPost = await UserPost.findOne({ where: { id: retweeted_id }, relations: ['user'] });
      const retweetedFromUser = await User.findOne({ where: { id: retweetFromPost['user'].id } });
      const retweetedPost = new PostRetweet();
      retweetedPost.post = post;
      retweetedPost.retweetedFromPost = retweetFromPost;
      retweetedPost.user = retweetedFromUser;
      await retweetedPost.save();

      return res.status(201).json(retweetedPost);
    }
    return res.status(201).json(post);
  }),
);

export default postRouter;
