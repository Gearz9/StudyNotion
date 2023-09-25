const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
// ResetPassword Token
exports.resetPasswordToken = async (req, res) => {
  try {
    // get email from req body
    const email = req.body.email;

    // check user for this email, also validation
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.json({
        success: false,
        message: "Your Email is not registered with us",
      });
    }
    // generate token
    const token = crypto.randomUUID();

    // update user by adding token and expiration time
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      { token: token, resetPasswordExpires: Date.now() + 5 * 60 * 1000 },
      { new: true }
    );

    // create URL
    const url = `http://localhost:3000/update-password/${token}`;

    // send mail constaining the URL
    await mailSender(
      email,
      "Password Reset Link",
      `Password Reset Link : ${url} `
    );

    // return response
    return res.status(200).json({
      success: true,
      message:
        "Email Sent Successfully, Please check email and change password",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      meessage: "Something went Wrong, while resetting the password",
    });
  }
};

// Reset Password

exports.resetPassword = async (req, res) => {
  try {
    // fetch the data
    const { password, confirmPassword, token } = req.body;

    // data validation
    if (password !== confirmPassword) {
      return res.json({
        success: false,
        message: "Password and Confirm Password are not matching",
      });
    }

    // get UserDetails from db using token
    const UserDetails = await User.findOne({ token: token });

    // if no entry - invalid token
    if (!UserDetails) {
      return res.json({
        success: false,
        message: "Token Invalid",
      });
    }

    // token time check
    if (UserDetails.resetPasswordExpires < Date.now()) {
      // token is expired
      return res.json({
        success: false,
        message: "Token is Expired. Please regenerate your Token",
      });
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // password update
    await User.findOneAndUpdate(
      { token: token },
      { password: hashedPassword },
      { new: true }
    );

    // return response
    return res.status(200).json({
      success: true,
      message: "Password Reset Successfull",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something Went Wrong while Resetting Password",
    });
  }
};
