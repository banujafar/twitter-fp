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
      relations: ['user', 'likes'],
    });
    const retweets = await PostRetweet.find({ relations: ['retweetedFromPost', 'post', 'user'] });
    if (!posts || posts.length === 0) {
      throw new AppError('No posts found', 404);
    }
    const filteredPostsWithRetweets = posts.map(async (post) => {
      const likes = await LikedPost.find({
        where: { post: { id: post.id } },
        relations: ['post', 'user'],
      });
      const comments = await PostComment.find({ where: { post: { id: post.id } }, relations: ['user', 'post'] });
      console.log(comments);
      const retweetsForPost = retweets.filter((retweet) => retweet.retweetedFromPost?.id === post.id);
      return {
        ...post,
        likes: likes.map((like) => ({
          id: like.id,
          liked_time: like.liked_time,
          post: like.post,
          user: like.user,
        })),
        comments:comments.map((r)=>({
          id: r.id,
          comment: r.comment_text,
          postId:r.post.id,
          userId:r.user.id

        })),
        retweets: retweetsForPost.map((r) => r.post),
        retweetFrom: retweets.filter((retweet) => retweet.post?.id === post.id),
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
      console.log(retweetedPost);
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
    console.log(postId, userId);
    const post = await UserPost.findOne({ where: { id: postId }, relations: ['likes'] });
    const user = await User.findOne({ where: { id: userId } });

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
    });
    console.log(existingLike.id);
    if (!existingLike) {
      return res.status(404).json({ error: 'Like not found' });
    }

    await LikedPost.delete(existingLike.id);
    res.status(200).json(existingLike.id);
  }),
);

postRouter.post(
  '/comment',
  tryCatch(async (req: Request, res: Response) => {
    const { comment, user_id, post_id } = req.body;

    const post = (await UserPost.find({ where: { id: post_id } })) || [];
    if (post.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const user = (await User.find({ where: { id: user_id } })) || [];
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

export default postRouter;
