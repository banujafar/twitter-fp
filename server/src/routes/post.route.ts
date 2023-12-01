import { PostComment } from './../entity/PostComment.entity.ts';
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
import { LikedPost } from '../entity/LikedPost.entity.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, res, callback) => {
    const uploadDir = join(__dirname, '../../../client/src/assets/uploads');
console.log(uploadDir)
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

// get all posts
postRouter.get(
  '/',
  tryCatch(async (req: Request, res: Response) => {
    const posts = await UserPost.find({
      relations: ['user', 'likes', 'comments'],
      select: { user: { id: true, username: true, email: true } },
    });
    const retweets = await PostRetweet.find({ relations: ['post', 'user', 'mainPost'] });
    if (!posts || posts.length === 0) {
      throw new AppError('No posts found', 404);
    }
    const filteredPostsWithRetweets = posts.map(async (post) => {
      const likes = await LikedPost.find({
        where: { post: { id: post.id } },
        relations: ['post', 'user'],
        select: { user: { id: true, username: true, email: true } },
      });
      const comments = await PostComment.find({ where: { post: { id: post.id } }, relations: ['user', 'post'] });
      const retweetsForPost = retweets.filter((retweet) => retweet.mainPost.id === post.id);
      return {
        ...post,
        likes: likes.map((like) => ({
          id: like.id,
          liked_time: like.liked_time,
          post: like.post,
          user: like.user,
        })),
        comments: comments.map((r) => ({
          id: r.id,
          comment: r.comment_text,
          postId: r.post.id,
          userId: r.user.id,
          created_time: r.created_time
        })),
        retweets: retweetsForPost.map((r) => ({
          id: r.id,
          retweeted_time: r.retweeted_time,
          post: r.post,
          mainPost: r.mainPost,
          user: { id: r.user.id, username: r.user.username, userPhoto: r.user.profilePhoto },
        })),
      };
    });

    const result = await Promise.all(filteredPostsWithRetweets);
    return res.status(200).json(result);
  }),
);

// add new post
postRouter.post(
  '/',
  uploads.array('files'),
  tryCatch(async (req: Request, res: Response) => {
    const files = (req.files as Express.Multer.File[]) || [];
    console.log(files)
    const { content, user_id, retweeted_id } = req.body;
    console.log(content, user_id);
    if (!content && !files) {
      throw new AppError('Cannot be empty', 400);
    }

    const user = await User.findOne({
      where: { id: user_id },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const post = new UserPost();
    post.content = content;
    post.user = user;

    post.img = files.map((file) => file.filename);

    await post.save();
    if (retweeted_id) {
      const mainPost = await UserPost.findOne({ where: { id: retweeted_id }, relations: ['user'] });
      const retweetedPost = new PostRetweet();
      retweetedPost.post = post;
      retweetedPost.mainPost = mainPost;
      retweetedPost.user = user;
      await retweetedPost.save();
      return res.status(201).json(retweetedPost);
    }
    return res.status(201).json(post);
  }),
);

// like post
postRouter.post(
  '/like',
  tryCatch(async (req: Request, res: Response) => {
    const { postId, userId } = req.body;
    const post = await UserPost.findOne({ where: { id: postId }, relations: ['likes'] });
    const user = await User.findOne({
      where: { id: userId },
    });

    if (!user || !post) {
      return res.status(404).json({ error: 'User or post not found' });
    }

    const existingLike = await LikedPost.findOne({
      where: { post: { id: postId }, user: { id: userId } },
    });

    if (existingLike) {
      return res.status(400).json({ message: 'Post already liked by the user' });
    }

    const likedPost = await LikedPost.create({
      post: await UserPost.findOne({ where: { id: postId }, relations: ['user'] }),
      user: await User.findOne({ where: { id: userId } }),

      liked_time: new Date(),
    }).save();

    const completeLikedPost = await LikedPost.findOne({
      where: { id: likedPost.id },
      relations: ['user', 'post'],
      select: { user: { id: true, username: true, email: true } },
    });
    res.status(200).json(completeLikedPost);
  }),
);

// remove like
postRouter.delete(
  '/like',
  tryCatch(async (req: Request, res: Response) => {
    const { postId, userId } = req.body;
    if (!postId || !userId) {
      return res.status(400).json({ error: 'Invalid request' });
    }
    const existingLike = await LikedPost.findOne({
      where: { post: { id: postId }, user: { id: userId } },
      relations: ['post', 'user'],
      select: { user: { id: true, username: true, email: true } },
    });
    console.log(existingLike.id);
    if (!existingLike) {
      return res.status(404).json({ error: 'Like not found' });
    }

    await LikedPost.delete(existingLike.id);
    res.status(200).json(existingLike.id);
  }),
);

// add comment
postRouter.post(
  '/comment',
  tryCatch(async (req: Request, res: Response) => {
    const { comment, userId, postId } = req.body;
console.log(comment,userId,postId)
    const post = (await UserPost.find({ where: { id: postId } })) || [];
    if (post.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const user =
      (await User.find({
        where: { id: userId },
        select: {
          id: true,
          username: true,
          email: true,
        },
      })) || [];
    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const postComment = new PostComment();
    postComment.comment_text = comment;
    postComment.post = post[0];
    postComment.user = user[0];
    await postComment.save();

    const { id, username } = user[0];
    const postWithComment = {
      id: postComment.id,
      comment_text: postComment.comment_text,
      user: { id, username },
      post: { id: post[0].id },
    };

    return res.status(201).json(postWithComment);
  }),
);

// retweet post
postRouter.post(
  '/retweet',
  tryCatch(async (req: Request, res: Response) => {
    const { userId, rtwId } = req.body;

    const user = await User.findOne({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }
    const post = new UserPost();
    // if (content) {
    //   post.content = content;
    // }
    post.user = user;
    await post.save();

    if (rtwId) {
      const mainPost = await UserPost.findOne({ where: { id: rtwId }, relations: ['user'] });
      const retweetedPost = new PostRetweet();
      retweetedPost.post = post;
      retweetedPost.mainPost = mainPost;
      retweetedPost.user = user;
      await retweetedPost.save();
      return res.status(201).json(retweetedPost);
    }
    return res.status(201).json(post);
  }),
);

//Delete retweet
postRouter.delete(
  '/retweet/:rtwId',
  tryCatch(async (req: Request, res: Response) => {
    const rtwId = +req.params.rtwId;
    const retweeted = await PostRetweet.findOne({ where: { id: rtwId }, relations: ['user', 'post'] });
    if (!retweeted) {
      return res.status(404).json({ error: 'Retweet not found' });
    }
    const postId = retweeted.post.id;
    const retweetedPost = await UserPost.findOne({ where: { id: postId } });
    if (!retweetedPost) {
      return res.status(404).json({ error: 'Retweeted post not found' });
    }
    await Promise.allSettled([PostRetweet.delete(retweeted.id), UserPost.delete(retweetedPost.id)]);
    return res.status(204).json('deleted successfully');
  }),
);

export default postRouter;
