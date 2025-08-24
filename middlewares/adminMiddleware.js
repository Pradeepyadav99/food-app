const userModel = require("../models/userModel");
const Response = require("../helpers/responseTrait");

module.exports = async (req, res, next) => {
  try {
    // jwt se aya hua id
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return Response.unauthorized(res, "User not found");
    }

    if (user.usertype !== "admin") {
      return Response.unauthorized(res, "Only Admin Access");
    }

    // admin hai to next middleware
    next();
  } catch (error) {
    console.log(error);
    return Response.error(res, "Un-Authorized Access", error);
  }
};
