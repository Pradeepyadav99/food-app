const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const Response = require("../helpers/responseTrait");

// REGISTER
const registerController = async (req, res) => {
  try {
    const { userName, email, password, phone, address, answer } = req.body;

    //validation
    if (!userName || !email || !password || !address || !phone || !answer) {
      return Response.validationError(res, "Please Provide All Fields");
    }

    // check user
    const existing = await userModel.findOne({ email });
    if (existing) {
      return Response.error(res, "Email Already Registered. Please Login");
    }

    // hashing password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create new user
    const user = await userModel.create({
      userName,
      email,
      password: hashedPassword,
      address,
      phone,
      answer,
    });

    return Response.created(res, "Successfully Registered");
  } catch (error) {
    console.log(error);
    return Response.error(res, "Error In Register API", error);
  }
};

// LOGIN
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return Response.validationError(res, "Please Provide Email and Password");
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return Response.notFound(res, "User Not Found");
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return Response.error(res, "Invalid Credentials");
    }

    // token
    const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    user.password = undefined;

    return Response.success(res, "Login Successfully", { token, user });
  } catch (error) {
    console.log(error);
    return Response.error(res, "Error In Login API", error);
  }
};

module.exports = { registerController, loginController };
