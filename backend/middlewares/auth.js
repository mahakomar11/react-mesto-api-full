const jwt = require("jsonwebtoken");
const CustomError = require("../utils/errors");

const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  let payload;
  try {
    payload = jwt.verify(token, "some-secret-key");
  } catch (err) {
    return next(new CustomError(401, "Необходима авторизация"));
  }

  req.user = payload;
  return next();
};

module.exports = auth;
