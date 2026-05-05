
import User from "./auth.model";

import bcrypt from "bcryptjs";

import {
  comparePassword
} from "./auth.utils";
export async function signup(
  req: any,
  res: any
) {

  try {

    const {
      name,
      email,
      password
    } = req.body;

    if (
      !name ||
      !email ||
      !password
    ) {

      return res.status(400).json({
        success: false,
        message: "Missing fields"
      });

    }


    const existing =
  await User.findOne({
    email
  } as any);

if (existing) {

  return res.status(400).json({

    success: false,

    message:
      "Email already exists"

  });

}

const hashed =
  await bcrypt.hash(
    password,
    10
  );

const user =
  await User.create({

    name,
    email,
    password: hashed,

    wallet: {
      balance: 0
    }

  });
    return res.json({

      success: true,

      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }

    });

  } catch (err: any) {

  console.error(
    "❌ SIGNUP FULL ERROR:"
  );

  console.error(err);

  return res.status(500).json({

    success: false,

    message:
      err?.message ||
      "Signup failed",

    stack:
      err?.stack,

    name:
      err?.name

  });

}

}

export async function login(
  req: any,
  res: any
) {

  try {

    const {
      email,
      password
    } = req.body;

    const user =
    
      await User.findOne({
  email
} as any);
    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found"
      });

    }

    const valid =
      await comparePassword(
        password,
        user.password
      );

    if (!valid) {

      return res.status(401).json({
        success: false,
        message: "Wrong password"
      });

    }

    return res.json({

      success: true,

      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }

    });

  } catch (err: any) {

    return res.status(500).json({

      success: false,

      message:
        err.message || "Login failed"

    });

  }

}