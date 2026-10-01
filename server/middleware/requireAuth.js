const { isAuthConfigured, verifyToken } = require("../helpers/authToken");

exports.requireAuth = (req, res, next) => {
  const [type, token] = (req.headers.authorization || "").split(" ");

  if (!isAuthConfigured() || type !== "Bearer" || !verifyToken(token)) {
    return res
      .status(401)
      .json({ status: "fail", error: "Unauthorized - please log in" });
  }

  next();
};
