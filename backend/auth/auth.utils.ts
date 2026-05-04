import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(
  password: string,
  hashed: string
) {
  return await bcrypt.compare(password, hashed);
}

export function createToken(user: any) {

  return jwt.sign(

    {
      id: user._id,
      email: user.email
    },

    process.env.JWT_SECRET ||
    "financestable_secret",

    {
      expiresIn: "7d"
    }

  );

}