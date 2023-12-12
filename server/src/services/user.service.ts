import { User } from '../entity/user.entity.ts';
import bcrypt from 'bcrypt';
import validator from 'validator';
//import jwt from "jsonwebtoken";
import AppError from '../config/appError.ts';
import { Token } from '../entity/token.entity.ts';

//Register new user and save  to the database  with default not verified status
const registerUser = async (username: string, email: string, password: string): Promise<string | { error: string }> => {
  if (!username || !email || !password) {
    throw new AppError('Missing credentials', 400);
  }

  if (!validator.isEmail(email)) {
    throw new AppError('Invalid email format', 400);
  }

  const existingUser = await User.findOne({
    where: [{ email }, { username }],
  });

  if (existingUser) {
    throw new AppError('User with this email or username already exists', 400);
  }

  // const verificationToken = jwt.sign({ email }, process.env.SECRET_KEY, {
  //   expiresIn: "1h",
  // });

  const user = new User();
  user.email = email;
  user.username = username;
  user.password = await bcrypt.hash(password, 10);
  user.isVerified = false;
  //user.token = verificationToken;
  await user.save();
  return 'Registration successful';

  //return user.token;
};

//Check if user email is verified after register
async function markEmailAsVerified(token) {
  if (!token) {
    throw new AppError('Invalid or missing verification token', 400);
  }

  const userToken = await Token.findOneBy({ token });

  if (!userToken) {
    throw new AppError('Invalid or expired verification token', 400);
  }

  const user = await User.findOne({
    where: { id: userToken.userId },
  });

  if (user) {
    if (user.isVerified) {
      return { message: 'Email already verified. You can now log in.' };
    }
    user.isVerified = true;
    await user.save();
    return { message: 'Email verified. You can now log in.' };
  } else {
    throw new AppError('Failed to verify email', 500);
  }
}

export {
  registerUser,
  markEmailAsVerified
};
