import { User } from "../entity/user.entity.ts";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";

const registerUser = async (
  username: string,
  email: string,
  password: string
): Promise<string | { error: string }> => {
  if (!username || !email || !password) {
    return { error: "please enter credentials" };
  }

  if (!validator.isEmail(email)) {
    return { error: "Invalid email format" };
  }

  const existingUser = await User.findOne({
    where: [{ email }, { username }],
  });

  if (existingUser) {
    return { error: `User with this email or username already exists` };
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
