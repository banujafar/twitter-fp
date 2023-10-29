import { Router, Request, Response } from 'express';
import registerUser from '../services/user.service.ts';
import passport from 'passport';
const userRouter = Router();

userRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const token = await registerUser(username, email, password);

    if (typeof token !== 'string') {
      return res.status(400).json({ message: token.error });
    }

    return res.status(201).json({ message: 'Registration successful', token: `Bearer ${token}` });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

userRouter.post('/login', (req, res, next) => {
  passport.authenticate(['local', 'local-username'], (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(400).json({ message: info?.message || 'Incorrect credentials.' });
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      console.log(req.cookies);
      return res.status(200).json({ message: 'Login Successful' });
    });
  })(req, res, next);
});
export default userRouter;
