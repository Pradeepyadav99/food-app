const JWT = require("jsonwebtoken");
const Response = require("../helpers/responseTrait");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return Response.unauthorized(res, "Auth Token Missing");
    }

    const token = authHeader.split(" ")[1]; // Bearer <token>
    if (!token) {
      return Response.unauthorized(res, "Invalid Auth Token");
    }

    JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        return Response.unauthorized(res, "Un-Authorize User");
      } else {
        // yaha pe body ki jagah ek generic property use karo
        req.user = decode;  
        // agar sirf id chahiye
        req.authId = decode.id; 
        next();
      }
    });
  } catch (error) {
    console.log(error);
    return Response.error(res, "Please provide Auth Token", error);
  }
};
