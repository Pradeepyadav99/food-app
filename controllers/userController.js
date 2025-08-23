const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const Response = require("../helpers/responseTrait");

// GET USER INFO
const getUserController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.user.id });

    if (!user) {
      return Response.notFound(res, "User Not Found");
    }

    user.password = undefined;
    return Response.success(res, "User Fetched Successfully", user);
  } catch (error) {
    console.log(error);
    return Response.error(res, "Error In Get User API", error);
  }
};

// UPDATE USER
const updateUserController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.user.id });

    if (!user) {
      return Response.notFound(res, "User Not Found");
    }

    const { userName, address, phone } = req.body;
    if (userName) user.userName = userName;
    if (address) user.address = address;
    if (phone) user.phone = phone;

    await user.save();
    return Response.successMsg(res, "User Updated Successfully");
  } catch (error) {
    console.log(error);
    return Response.error(res, "Error In Update User API", error);
  }
};

// UPDATE USER PASSWORD
const updatePasswordController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.user.id });

    if (!user) {
      return Response.notFound(res, "User Not Found");
    }

    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return Response.validationError(res, "Please Provide Old and New Password");
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return Response.error(res, "Invalid Old Password");
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;

    await user.save();
    return Response.successMsg(res, "Password Updated Successfully");
  } catch (error) {
    console.log(error);
    return Response.error(res, "Error In Password Update API", error);
  }
};

// RESET PASSWORD
const resetPasswordController = async (req, res) => {
  try {
    const { email, newPassword, answer } = req.body;
    if (!email || !newPassword || !answer) {
      return Response.validationError(res, "Please Provide All Fields");
    }

    const user = await userModel.findOne({ email, answer });
    if (!user) {
      return Response.error(res, "User Not Found or Invalid Answer");
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;

    await user.save();
    return Response.successMsg(res, "Password Reset Successfully");
  } catch (error) {
    console.log(error);
    return Response.error(res, "Error In Password Reset API", error);
  }
};

// DELETE PROFILE
const deleteProfileController = async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.params.id);
    return Response.successMsg(res, "Your Account Has Been Deleted");
  } catch (error) {
    console.log(error);
    return Response.error(res, "Error In Delete Profile API", error);
  }
};

module.exports = {
  getUserController,
  updateUserController,
  updatePasswordController,
  resetPasswordController,
  deleteProfileController,
};
