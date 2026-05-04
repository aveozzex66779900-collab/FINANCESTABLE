import User from "./auth.model";

import {
  hashPassword,
  comparePassword,
  createToken
} from "./auth.utils";



// ==========================
// SIGNUP
// ==========================

export async function signup(req, res) {

  try {

    const {
      name,
      email,
      password
    } = req.body;



    // validation
    if (!name || !email || !password) {

      return res.status(400).json({
        success: false,
        message: "Missing fields"
      });

    }



    // check existing user
    const existingUser = await User.findOne({
      email: email
    });

    if (existingUser) {

      return res.status(400).json({
        success: false,
        message: "User already exists"
      });

    }



    // hash password
    const hashedPassword =
      await hashPassword(password);



    // create user
    const user = await User.create({

      name,

      email,

      password: hashedPassword,

      wallet: {
        balance: 0
      }

    });



    // token
    const token = createToken(user);



    res.json({

      success: true,

      message: "Signup success",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }

    });

  }

  catch (err) {

    console.error("❌ SIGNUP ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Signup failed"
    });

  }

}



// ==========================
// LOGIN
// ==========================

export async function login(req, res) {

  try {

    const {
      email,
      password
    } = req.body;



    // validation
    if (!email || !password) {

      return res.status(400).json({
        success: false,
        message: "Missing email or password"
      });

    }



    // find user
    const user = await User.findOne({
      email: email
    });

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found"
      });

    }



    // compare password
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



    // token
    const token = createToken(user);



    res.json({

      success: true,

      message: "Login success",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }

    });

  }

  catch (err) {

    console.error("❌ LOGIN ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Login failed"
    });

  }

}