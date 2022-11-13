const { dataSource } = require('./dataSource');

const getUserByEmail = async (email) => {
  const [user] = await dataSource.query(
    `
      SELECT *
      FROM users
      WHERE users.email = ?
    `,
    [email]
  );
  return user;
};

const createUser = async (name, email, hashedPassword) => {
  await dataSource.query(
    `
      INSERT INTO users(
        name,
        email,
        password
      ) VALUES (?, ?, ?);
    `,
    [name, email, hashedPassword]
  );
};

const getAllUsers = async () => {
  const allUsers = await dataSource.query(
    `
      SELECT *
      FROM users
    `
  );
  return allUsers;
};

module.exports = {
  getUserByEmail,
  createUser,
  getAllUsers,
};
