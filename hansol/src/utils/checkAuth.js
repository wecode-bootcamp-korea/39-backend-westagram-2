const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY;

const withAuth = (req, res, next) => {
  const hasCookie = req.headers.cookie?.includes('accessToken');
  if (!hasCookie) {
    const err = new Error('로그인이 필요합니다.');
    err.statusCode = 401;
    throw err;
  }
  const { cookie } = req.headers;
  const jwtCookie = cookie.split('=')[1];
  const decoded = jwt.verify(jwtCookie, secretKey);
  req.decoded = decoded;
  next();
};

module.exports = { withAuth };
