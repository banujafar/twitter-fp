import { Router, Request, Response, NextFunction } from 'express';
import registerUser from '../services/user.service.ts';
import {forgotPass, loginUser} from '../services/auth.service.ts';

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
userRouter.post('/forgotpass',(req:Request,res:Response)=>{
  const {email}=req.body;
  const result=forgotPass(email);
  if(result){
    return res.status(200).send('Email sent');
  }else{
    return res.status(400).send("No account found");
  }

})
export default userRouter;
