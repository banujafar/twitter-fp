import { Router, Request, Response } from 'express';
import registerUser from '../services/user.service.ts';

const userRouter = Router();

userRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const token = await registerUser(username, email, password);

    if (typeof token !== 'string') {
      return res.status(400).json({ message: token.error });
    }

    return res
      .status(201)
      .json({ message: 'Registration successful', token: `Bearer ${token}` });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default userRouter;
