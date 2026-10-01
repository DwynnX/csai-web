import dotenv from 'dotenv';
import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import bcrypt from 'bcryptjs';

// Инициализация переменных окружения
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Подключение к базе данных
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

// 1. РЕГИСТРАЦИЯ
app.post('/api/register', async (req, res) => {
  try {
    const { username, firstName, lastName, email, birthDate, password } = req.body;
    
    // Проверка на существующего пользователя
    const [existing] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'ERR: Operator ID already exists' });
    }

    // Хэширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO users (username, password_hash, first_name, last_name, email, birth_date) VALUES (?, ?, ?, ?, ?, ?)',
      [username, hashedPassword, firstName, lastName, email, birthDate]
    );

    res.status(201).json({ message: 'SUCCESS: Operator registered' });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// 2. АВТОРИЗАЦИЯ
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    
    if (rows.length === 0) {
      return res.status(401).json({ error: 'ERR: Invalid credentials' });
    }
    
    const user = rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isValid) {
      return res.status(401).json({ error: 'ERR: Invalid credentials' });
    }

    // Удаляем хэш пароля перед отправкой клиенту
    delete user.password_hash;
    res.json(user);
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// 3. ОБНОВЛЕНИЕ ПРОФИЛЯ
app.put('/api/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, birthDate, newPassword } = req.body;
    
    let query = 'UPDATE users SET first_name=?, last_name=?, email=?, birth_date=?';
    let params = [firstName, lastName, email, birthDate];

    if (newPassword && newPassword.length > 0) {
      const hashed = await bcrypt.hash(newPassword, 10);
      query += ', password_hash=?';
      params.push(hashed);
    }
    
    query += ' WHERE id=?';
    params.push(id);

    await pool.query(query, params);
    res.json({ message: 'SUCCESS: Profile updated' });
  } catch (err) {
    console.error('Profile Update Error:', err);
    res.status(500).json({ error: 'Server error updating profile' });
  }
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` CSAI API Server running on http://localhost:${PORT}`);
});