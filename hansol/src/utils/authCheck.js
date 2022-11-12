const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY;

const withAuth = (req, res, next) => {
  const { cookie } = req.headers;
  const jwtCookie = cookie.split('=')[1];
  const decoded = jwt.verify(jwtCookie, secretKey);
  req.decoded = decoded;
  next();
};

module.exports = withAuth;
