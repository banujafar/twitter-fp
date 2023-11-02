import { Router, Request, Response, NextFunction } from 'express';
import registerUser from '../services/user.service.ts';
import {loginUser} from '../services/auth.service.ts';

const userRouter = Router();
//Register router
userRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const token = await registerUser(username, email, password);

    if (typeof token !== 'string') {
      return res.status(400).json({ message: token.error });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

//Login router
userRouter.post('/login', loginUser);
export default userRouter;
