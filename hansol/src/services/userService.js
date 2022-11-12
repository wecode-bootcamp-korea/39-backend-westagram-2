const bcrypt = require('bcrypt');
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

module.exports = { signup };
