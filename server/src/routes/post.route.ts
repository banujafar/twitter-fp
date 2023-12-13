import { PostComment } from './../entity/PostComment.entity.ts';
import { Router, Request, Response } from 'express';
import tryCatch from '../utils/tryCatch.ts';
import AppError from '../config/appError.ts';
import { UserPost } from '../entity/UserPost.entity.ts';
import { User } from '../entity/user.entity.ts';
import multer from 'multer';
import storageCloud from '../config/storage.ts';
import { v4 as uuidv4 } from 'uuid';
import { PostRetweet } from '../entity/PostRetweet.entity.ts';
import { LikedPost } from '../entity/LikedPost.entity.ts';
import { Notifications } from '../entity/notifications.entity.ts';

const uploads = multer({ storage: storageCloud });

const postRouter = Router();

// get all posts
postRouter.get(
  '/',
  tryCatch(async (req: Request, res: Response) => {
    const posts = await UserPost.find({
      relations: ['user', 'likes', 'comments'],
      select: { user: { id: true, username: true, email: true, profilePhoto: true } },
    });

    const retweets = await PostRetweet.find({
      relations: ['post', 'user', 'mainPost'],
    });
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
      const retweet = retweets.find((retweet) => retweet.post.id == post.id);

      const retweeted =
        retweet &&
        (await UserPost.findOne({ where: { id: retweet.mainPost?.id }, relations: ['user', 'likes', 'comments'] }));
      return {
        ...post,
        likes: likes.map((like) => ({
          id: like.id,
          liked_time: like.liked_time,
          post: like.post,
          user: like.user,
        })),
        comments: comments.map((comment) => ({
          id: comment.id,
          comment: comment.comment_text,
          post: comment.post,
          user: comment.user,
          created_time: comment.created_time,
        })),
        retweets: retweetsForPost.map((r) => ({
          id: r.id,
          created_time: r.retweeted_time,
          post: r.post,
          mainPost: r.mainPost,
          user: { id: r.user.id, username: r.user.username, profilePhoto: r.user.profilePhoto },
        })),
        retweeted: retweeted,
      };
    });

    const result = await Promise.all(filteredPostsWithRetweets);
    return res.status(200).json(result);
  }),
);
//get single post
postRouter.get(
  '/:postId',
  tryCatch(async (req: Request, res: Response) => {
    const postId = +req.params.postId;

    const post = await UserPost.findOne({
      where: { id: postId },
      relations: ['user', 'likes', 'comments'],
      select: { user: { id: true, username: true, email: true, profilePhoto: true } },
    });

    const retweets = await PostRetweet.find({
      where: { post: { id: postId } },
      relations: ['post', 'user', 'mainPost'],
    });

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    const likes = await LikedPost.find({
      where: { post: { id: post.id } },
      relations: ['post', 'user'],
      select: { user: { id: true, username: true, email: true } },
    });

    const comments = await PostComment.find({
      where: { post: { id: post.id } },
      relations: ['user', 'post'],
    });

    const retweetsForPost = retweets.filter((retweet) => retweet.mainPost.id === post.id);
    const retweet = retweets.find((retweet) => retweet.post.id === post.id);

    const retweeted =
      retweet &&
      (await UserPost.findOne({
        where: { id: retweet.mainPost?.id },
        relations: ['user', 'likes', 'comments'],
      }));

    const result = {
      ...post,
      likes: likes.map((like) => ({
        id: like.id,
        liked_time: like.liked_time,
        post: like.post,
        user: like.user,
      })),
      comments: comments.map((comment) => ({
        id: comment.id,
        comment: comment.comment_text,
        post: comment.post,
        user: comment.user,
        created_time: comment.created_time,
      })),
      retweets: retweetsForPost.map((r) => ({
        id: r.id,
        created_time: r.retweeted_time,
        post: r.post,
        mainPost: r.mainPost,
        user: { id: r.user.id, username: r.user.username, profilePhoto: r.user.profilePhoto },
      })),
      retweeted: retweeted,
    };

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

    const user = await User.findOne({
      where: { id: user_id },
      select: {
        id: true,
        username: true,
        email: true,
        profilePhoto: true,
        bio: true,
        country: true,
      },
      relations: ['notifications'],
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const post = new UserPost();
    post.content = content;
    post.user = user;
    post.likes = [];
    post.comments = [];
    post.img = files.map((file) => file.filename);

    await post.save();
    if (retweeted_id) {
      const mainPost = await UserPost.findOne({
        where: { id: retweeted_id },
        relations: ['user', 'likes', 'comments'],
      });
      const retweetedPost = new PostRetweet();
      retweetedPost.post = post;
      retweetedPost.mainPost = mainPost;
      retweetedPost.user = user;
      await retweetedPost.save();
      const retweets = await PostRetweet.find({
        relations: ['post', 'user', 'mainPost'],
      });
      const retweetsForPost = retweets.filter((retweet) => retweet.mainPost.id === mainPost.id);
      const likes = await LikedPost.find({
        where: { post: { id: mainPost.id } },
        relations: ['post', 'user'],
        select: { user: { id: true, username: true, email: true } },
      });
      const comments = await PostComment.find({ where: { post: { id: mainPost.id } }, relations: ['user', 'post'] });

      return res.status(201).json({
        originalPost: { ...mainPost, retweets: retweetsForPost, likes, comments },
        retweetedPost: { ...post, retweeted: mainPost },
      });
    }

    const newNotification = new Notifications();
    newNotification.user = user;
    user.notifications.map((notification) => {
      newNotification.receiver = notification;
    });
    newNotification.post = post;
    newNotification.type = 'created';
    newNotification.save();
    return res.status(201).json(post);
  }),
);

// like post
postRouter.post(
  '/like',
  tryCatch(async (req: Request, res: Response) => {
    const { postId, userId } = req.body;
    const post = await UserPost.findOne({ where: { id: postId }, relations: ['likes', 'user'] });
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
    const receiver = post.user;
    const newNotification = new Notifications();
    newNotification.user = user;
    newNotification.receiver = receiver;
    newNotification.post = post;
    newNotification.type = 'liked';
    newNotification.save();
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
    if (!existingLike) {
      return res.status(404).json({ error: 'Like not found' });
    }
    const notification = await Notifications.findOne({ where: { post: { id: postId } } });
    await Promise.allSettled([Notifications.delete(notification?.id), LikedPost.delete(existingLike.id)]);
    res.status(200).json(existingLike.id);
  }),
);

// add comment
postRouter.post(
  '/comment',
  tryCatch(async (req: Request, res: Response) => {
    const { comment, userId, postId } = req.body;
    const post = (await UserPost.find({ where: { id: postId }, relations: ['user'] })) || [];
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

    const postWithComment = {
      created_time: postComment.created_time,
      id: postComment.id,
      comment: postComment.comment_text,
      user: postComment.user,
      post: postComment.post,
    };
    const receiver = postComment.post.user;
    const newNotification = new Notifications();
    newNotification.user = postComment.user;
    newNotification.receiver = receiver;
    newNotification.post = postComment.post;
    newNotification.type = 'added comment';
    newNotification.save();
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
        profilePhoto: true,
        country: true,
        bio: true,
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
      const mainPost = await UserPost.findOne({ where: { id: rtwId }, relations: ['user', 'likes', 'comments'] });
      const retweetedPost = new PostRetweet();
      retweetedPost.post = post;
      retweetedPost.mainPost = mainPost;
      retweetedPost.user = user;
      await retweetedPost.save();
      const receiver = mainPost.user;
      const newNotification = new Notifications();
      newNotification.user = user;
      newNotification.receiver = receiver;
      newNotification.post = post;
      newNotification.type = 'retweeted';
      newNotification.save();
      const retweets = await PostRetweet.find({
        relations: ['post', 'user', 'mainPost'],
      });
      const retweetsForPost = retweets.filter((retweet) => retweet.mainPost.id === mainPost.id);
      const likes = await LikedPost.find({
        where: { post: { id: mainPost.id } },
        relations: ['post', 'user'],
        select: { user: { id: true, username: true, email: true } },
      });
      const comments = await PostComment.find({ where: { post: { id: mainPost.id } }, relations: ['user', 'post'] });
      const retweet = retweets.find((retweet) => retweet.post.id == mainPost.id);

      const retweeted =
        retweet &&
        (await UserPost.findOne({
          where: { id: retweet.mainPost?.id },
          relations: ['user', 'likes', 'comments'],
        }));
      return res.status(201).json({
        originalPost: { ...mainPost, retweets: retweetsForPost, likes, comments, retweeted: retweeted },
        retweetedPost: { ...post, retweeted: mainPost },
      });
    } else {
      return res.status(201).json(post);
    }
  }),
);

//Delete retweet
postRouter.delete(
  '/retweet/:rtwId',
  tryCatch(async (req: Request, res: Response) => {
    const rtwId = +req.params.rtwId;
    const retweeted = await PostRetweet.findOne({ where: { id: rtwId }, relations: ['user', 'post', 'mainPost'] });
    if (!retweeted) {
      return res.status(404).json({ error: 'Retweet not found' });
    }
    const postId = retweeted.post.id;
    const mainPost = retweeted.mainPost;
    const retweetedPost = await UserPost.findOne({ where: { id: postId } });
    if (!retweetedPost) {
      return res.status(404).json({ error: 'Retweeted post not found' });
    }
    const notification = await Notifications.findOne({ where: { post: { id: retweetedPost.id } } });
    console.log(notification);
    await Promise.allSettled([Notifications.delete(notification?.id), PostRetweet.delete(retweeted.id)]);
    await UserPost.delete(retweetedPost.id);
    return res.status(200).json({ retweetedPostId: retweetedPost.id, mainPostId: mainPost.id });
  }),
);
postRouter.get(
  '/notifications/:userId',
  tryCatch(async (req: Request, res: Response) => {
    const userId = +req.params.userId;
    const notifications = await Notifications.find({
      where: { receiver: { id: userId } },
      relations: ['user', 'post'],
    });
    const modifiedNotifications = notifications.map((notification) => ({
      id: notification.id,
      postId: notification.post?.id,
      senderName: notification.user.username,
      type: notification.type,
      read: notification.read,
    }));
    res.status(200).json(modifiedNotifications);
  }),
);
postRouter.post(
  '/notifications/:userId',
  tryCatch(async (req: Request, res: Response) => {
    const userId = +req.params.userId;
    const notifications = await Notifications.find({
      where: { receiver: { id: userId } },
      relations: ['user', 'post'],
    });
    const modifiedNotifications = notifications.map((notification) => ({
      id: notification.id,
      postId: notification.post?.id,
      senderName: notification.user.username,
      sender_id: notification.user.id,
      type: notification.type,
    }));
    for (const modifiedNotification of modifiedNotifications) {
      await Notifications.update({ user: { id: modifiedNotification.sender_id } }, { read: true });
    }
    res.status(200).json('success');
  }),
);

postRouter.delete('/:post_id', tryCatch(async(req:Request, res:Response)=> {
  const {post_id} = req.params;

  const postToDelete = await UserPost.findOne({
    where: { id: parseInt(post_id, 10) }
  });

  if (!postToDelete) {
    throw new AppError('Post not found', 404);
  }
  const notificationsToDelete = await Notifications.find({ where: { post: { id: postToDelete.id } } });
  const retweetPostToDelete = await PostRetweet.find({ where: { post:{id: postToDelete.id} } });


  await Notifications.remove(notificationsToDelete);
  await PostRetweet.remove(retweetPostToDelete);

  await UserPost.remove(postToDelete);

  return res.status(204).json(postToDelete);
}))
export default postRouter;
