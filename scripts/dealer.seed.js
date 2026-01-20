import 'dotenv/config';
import bcrypt from 'bcrypt';
import pool from '../src/config/db.js';

async function seedDealer() {
  const username = 'dealer';
  const plainPassword = 'admin123';

  const conn = await pool.getConnection();

  try {
    const [rows] = await conn.execute('SELECT id FROM dealers WHERE username = ?', [username]);

    if (rows.length > 0) {
      console.log('Dealer already exists, skipping seed');
      return;
    }

    const passwordHash = await bcrypt.hash(plainPassword, 10);

    await conn.execute(
      `INSERT INTO dealers (name, username, password_hash, address)
       VALUES (?, ?, ?, ?)`,
      ['Main Dealer', username, passwordHash, 'Head Office'],
    );

    console.log('Dealer user seeded successfully');
  } catch (error) {
    console.error('Seed dealer failed:', error);
    process.exitCode = 1;
  } finally {
    conn.release();
    process.exit();
  }
}

seedDealer();
