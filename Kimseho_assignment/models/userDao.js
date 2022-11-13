const { database } = require("./dataSource");

const createUser = async (name, email, password, profileImage) => {
  try {
    return await database.query(
      `INSERT INTO users(
                    name,
                    email,
                    password,
                    profile_image
                ) VALUES (?, ?, ?, ?);
                `,
      [name, email, password, profileImage]
    );
  } catch (err) {
    const error = new Error("INVALID_DATA_INPUT");
    error.statusCode = 500;
    throw error;
  }
};

const getUserByEmail = async (email) => {
  const [user] = await database.query(
    `
      SELECT *
      FROM users u
      WHERE u.email = ?
    `,
    [email]
  );

  return user;
};

const getUserById = async (id) => {
  const result = await database.query(
    `
		SELECT 
			id,
			name,
			email,
			password,
			profile_image AS profileImage
		FROM users
		WHERE id=?`,
    [id]
  );

  return result[0];
};

const signIn = async (email) => {
  try {
    return await database.query(
      `SELECT
        id, 
        email,
        password
    FROM users
    WHERE email = ?`,
      [email]
    );
  } catch (err) {
    const error = new Error("INVALID_DATA_INPUT");
    error.statusCode = 500;
    throw error;
  }
};
module.exports = { getUserById, createUser, getUserByEmail, signIn };
