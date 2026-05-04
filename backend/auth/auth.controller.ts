import User from "./auth.model";
import {
  hashPassword,
  comparePassword,
  createToken
} from "./auth.utils";
export async function signup(req, res) {

  try {

    const {
      name,
      email,
      password
    } = req.body;

    if (!name || !email || !password) {

      return res.status(400).json({
        success: false,
        message: "Missing fields"
      });

    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {

      return res.status(400).json({
        success: false,
        message: "User already exists"
      });

    }

    const hashedPassword =
      await hashPassword(password);

    const user = await User.create({

      name,
      email,
      password: hashedPassword,

      wallet: {
        balance: 0
      }

    });

    const token = createToken(user);

    res.json({

      success: true,
      message: "Signup success",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        wallet: user.wallet
      }

    });

  }

  catch (err) {

    console.error(
      "SIGNUP ERROR:",
      err
    );

    res.status(500).json({

      success: false,
      message: "Signup failed",
      error: err.message

    });




    

}
  }





export async function login(req, res) {

  try {

    const {
      email,
      password
    } = req.body;

    const user =
      await User.findOne({ email });

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
        message: "Invalid password"

      });

    }

    const token = createToken(user);

    res.json({

      success: true,
      message: "Login success",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        wallet: user.wallet
      }

    });

  }

  catch (err) {

    console.error(
      "LOGIN ERROR:",
      err
    );

    res.status(500).json({

      success: false,
      message: "Login failed",
      error: err.message

    });

  }

}