const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userDao = require('../models/userDao');
const validators = require('../utils/validators');

const signup = async (name, email, password) => {
  validators.validateEmail(email);

  const user = await userDao.getUserByEmail(email);

  if (user) {
    const err = new Error('중복된 이메일 입니다.');
    err.statusCode = 400;
    throw err;
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  await userDao.createUser(name, email, hashedPassword);
};

const login = async (email, password) => {
  const user = await userDao.getUserByEmail(email);
  const hashedPassword = bcrypt.compareSync(password, user.password);

  if (!user) {
    const err = new Error('가입되지 않은 이메일 입니다.');
    err.statusCode = 400;
    throw err;
  }
  if (!hashedPassword) {
    const err = new Error('비밀번호가 틀렸습니다.');
    err.statusCode = 400;
    throw err;
  }

  return jwt.sign(
    { id: user.id, eamil: user.eamil },
    process.env.JWT_SECRET_KEY
  );
};

const getAllUsers = async () => {
  return await userDao.getAllUsers();
};

module.exports = { signup, login, getAllUsers };
