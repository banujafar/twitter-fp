import bcrypt from 'bcrypt';
import { Router, Request, Response, NextFunction } from 'express';
import registerUser from '../services/user.service.ts';
import { checkTokenForReset, forgotPass, loginUser } from '../services/auth.service.ts';
import { Token } from '../entity/token.entity.ts';

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
//Forgot password
userRouter.post('/forgotpass', (req: Request, res: Response) => {
  const { email } = req.body;
  const result = forgotPass(email);
  if (result) {
    return res.status(200).json({ message: 'Email sent' });
  } else {
    return res.status(400).send({ message: 'No account found' });
  }
});

userRouter.get('/reset_password/:id/:token', async (req, res) => {
  const { token } = req.params; // Use req.params to get URL parameters
  const id=+req.params.id
  try {
    const result=await checkTokenForReset({id,token})
    res.status(200).json(token)
  } catch (error) {
    console.log('Error in resetting the passsword');
    res.status(401).json('Invalid link')
  }
});

export default userRouter;
