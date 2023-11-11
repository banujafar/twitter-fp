import { Request, Response, NextFunction } from 'express';

//Try catch function for using in general
const tryCatch = (controller) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await controller(req, res);
   
  
  } catch (error) {
    return next(error);
  }
};

export default tryCatch;
