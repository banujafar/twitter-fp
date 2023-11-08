import { User } from "../entity/user.entity.ts";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";
import AppError from "../config/appError.ts";

const registerUser = async (
  username: string,
  email: string,
  password: string
): Promise<string | { error: string }> => {
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

  const user = new User();
  user.email = email;
  user.username = username;
  user.password = await bcrypt.hash(password, 10);

  await user.save();

  const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, {
    expiresIn: "10h",
  });
  return token;
};

export default registerUser;
