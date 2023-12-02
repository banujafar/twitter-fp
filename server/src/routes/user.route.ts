import { Router, Request, Response, NextFunction } from 'express';
import { markEmailAsVerified, registerUser } from '../services/user.service.ts';
import {
  checkTokenForReset,
  confirmRequestResetPass,
  verificationWithLink,
  loginUser,
} from '../services/auth.service.ts';
import passport from 'passport';
import { User } from '../entity/user.entity.ts';
import tryCatch from '../utils/tryCatch.ts';
import AppError from '../config/appError.ts';
import { Token } from '../entity/token.entity.ts';

const userRouter = Router();

const Base_Client_Url = process.env.CLIENT_URL || 'http://localhost:5173/';
//Register router
userRouter.post(
  '/register',
  tryCatch(async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    await registerUser(username, email, password).then(async () => {
      await verificationWithLink(email)
        .then(() => {
          return res.status(201).json({
            user: req.body,
            message: 'Check your email for verification instructions.',
          });
        })
        .catch(() => {
          throw new AppError('Failed to send verification email', 500);
        });
    });
  }),
);

//Get Request route for confirm email
userRouter.get(
  '/verify',
  tryCatch(async (req: Request, res: Response) => {
    const token = String(req.query.token);
    await markEmailAsVerified(token).then(async (result) => {
      res.status(200).json('email verified');
      await Token.delete({ token: token });
    });
  }),
);

//Login router
userRouter.post('/login', loginUser);

//Forgot password
userRouter.post(
  '/forgotpass',
  tryCatch(async (req: Request, res: Response, next) => {
    const { email } = req.body;
    await verificationWithLink(email).then(() => res.status(200).json({ message: 'Email sent successfully' }));
  }),
);

//Get reset password link
userRouter.get(
  '/reset_password/:id/:token',
  tryCatch(async (req, res) => {
    const { token } = req.params; // Use req.params to get URL parameters
    const id = +req.params.id;

    await checkTokenForReset({ id, token }).then(() => {
      res.status(200).json('Password reset page has been retrieved successfully');
    });
  }),
);

//Send new password
userRouter.post(
  '/reset_password/:id/:token',
  tryCatch(async (req, res) => {
    const { password, confirm_password } = req.body;
    const id = +req.params.id;

    await confirmRequestResetPass({ id, password, confirm_password }).then(() => {
      res.status(200).json('Password changed');
    });
  }),
);

//Login with Google
userRouter.get('/google', (req, res, next) => {
  passport.authenticate('google', {
    scope: ['email', 'profile'],
    successRedirect: Base_Client_Url,
    failureRedirect: `${Base_Client_Url}login`,
  })(req, res, next);
});

userRouter.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', {
    scope: ['email', 'profile'],
    successRedirect: Base_Client_Url,
    failureRedirect: `${Base_Client_Url}login`,
  })(req, res, next);
});

//Logout process route
userRouter.post(
  '/logout',
  tryCatch((req: Request, res: Response, next: NextFunction) => {
    req.logout(function (err) {
      if (err) {
        throw new AppError('Logout failed', 500);
      }

      res.clearCookie('connect.sid');
      res.clearCookie('auth_token');
      req.session.destroy(function (err) {
        if (err) {
          throw new AppError('Session destruction failed', 500);
        }
        res.status(200).json('Logout successfully');
      });
    });
  }),
);


userRouter.get(
  '/',
  tryCatch(async (req: Request, res: Response) => {

    const user = await User.find();
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(user);
  }),
);


userRouter.post(
  '/follow/:userId',
  tryCatch(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const {targetUser} = req.body;

    // const currentUser = await User.findOne({ where: { id: parseInt(userId) }, relations: ['following', 'followers']  });
    // const userToFollow = await User.findOne({ where: { id: targetUser.id }, relations: ['followers'] });

    // if (!currentUser || !userToFollow) {
    //   return res.status(404).json({ error: 'User not found' });
    // }

    // const isAlreadyFollowing = currentUser.following && currentUser.following.some(follower => follower.id === userToFollow.id);

    // if (isAlreadyFollowing) {
    //   return res.status(400).json({ error: 'User is already being followed' });
    // }

    // currentUser.following = [...(currentUser.following || []), userToFollow];
    // await currentUser.save();

    // userToFollow.followers = [...(userToFollow.followers || []), currentUser];
    // await userToFollow.save();


    return res.status(200).json({message:'success'});
  }),
);


export default userRouter;
