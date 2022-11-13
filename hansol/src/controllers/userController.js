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

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const accessToken = await userService.login(email, password);

    res.cookie('accessToken', accessToken);
    res.status(201).json({ message: 'login success' }).end();
  } catch (err) {
    res.status(err.statusCode || 400).json({ message: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const usersData = await userService.getAllUsers();

    res.status(200).json(usersData);
  } catch (err) {
    res.status(err.statusCode || 400).json({ message: err.message });
  }
};

module.exports = { signup, login, getAllUsers };
