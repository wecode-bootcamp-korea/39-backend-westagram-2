const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userDao = require("../models/userDao");
const { validateEmail, validatePw } = require("../utils/validation");

const getUserById = async (id) => {
  const result = await userDao.getUserById(id);
  return result;
};

const signUp = async (name, email, password, profileImage) => {
  validateEmail(email);
  validatePw(password);

  const user = await userDao.getUserByEmail(email);

  if (user) {
    const err = new Error("duplicated email");
    err.statusCode = 400;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(
    password,
    parseInt(process.env.saltRounds)
  );

  await userDao.createUser(name, email, hashedPassword, profileImage);
};

const signIn = async (email, password) => {
  const user = await userDao.getUserByEmail(email);

  if (!user) {
    const err = new Error("specified user does not exist");
    err.statusCode = 404;
    throw err;
  }

  const result = await bcrypt.compare(password, user.password);

  if (!result) {
    const err = new Error("invalid password");
    err.statusCode = 401;
    throw err;
  }

  return jwt.sign({ id: user.id }, process.env.secretKey, { expiresIn: "1d" });
};

module.exports = { signUp, signIn, getUserById };
