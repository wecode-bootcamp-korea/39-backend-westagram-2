const userService = require('../services/userService');

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    await userService.signup(name, email, password);

    res.status(201).json({ message: 'userCreated' }).end();
  } catch (err) {
    res.status(err.statusCode || 400).json({ message: err.message });
  }
};

const login = () => {
  console.log('로그인로직');
};

module.exports = { signup, login };
