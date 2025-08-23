const JWT = require("jsonwebtoken");
const Response = require("../helpers/responseTrait");
module.exports = async (req, res, next) => {
  try {
    // get token
    //console.log("Auth Header:", req.headers["authorization"]);
    const token = req.headers["authorization"].split(" ")[1];
    JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        return Response.unauthorized(res, "Un-Authorize User");
      } else {
        req.user = decode;
        req.authId = decode.id;
        next();
      }
    });
  } catch (error) {
    console.log(error);
    return Response.error(res, "Please provide Auth Token", error);
  }
};
