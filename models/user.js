const pool = require('../db');

const User = {
  async findByEmailOrUsername(value) {
    const { rows } = await pool.query(
      `SELECT * FROM users WHERE email = $1 OR username = $1`,
      [value]
    );
    return rows[0];
  },

  async exists(username, email) {
    const { rowCount } = await pool.query(
      `SELECT 1 FROM users WHERE email = $1 OR username = $2`,
      [email, username]
    );
    return rowCount > 0;
  },

  async create({ username, email, passwordHash }) {
    const { rows } = await pool.query(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, username, email`,
      [username, email, passwordHash]
    );
    return rows[0];
  },

  async findById(id) {
    const { rows } = await pool.query(
      `SELECT id, username, email FROM users WHERE id = $1`,
      [id]
    );
    return rows[0];
  }
};

module.exports = User;
