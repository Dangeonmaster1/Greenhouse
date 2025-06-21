// backend/server.js

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./config/db');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // адрес фронтенда на Vite
    credentials: true
}));

// Тестовый маршрут
app.get('/api/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ db_time: result.rows[0].now });
    } catch (err) {
        console.error('Ошибка подключения к БД:', err.message);
        res.status(500).json({ error: 'Не могу подключиться к базе данных' });
    }
});

// Регистрация пользователя
app.post('/api/auth/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Логин и пароль обязательны' });
    }

    // Проверка длины логина
    if (username.length < 3 || username.length > 30) {
        return res.status(400).json({ error: 'Логин должен быть от 3 до 30 символов' });
    }

    // Проверка формата логина (буквы, цифры, подчеркивания)
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
        return res.status(400).json({ error: 'Логин может содержать только буквы, цифры и подчеркивания' });
    }

    // Проверка длины пароля
    if (password.length < 6) {
        return res.status(400).json({ error: 'Пароль должен быть не короче 6 символов' });
    }

    // Опционально: требуем хотя бы одну заглавную букву и одну цифру
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ error: 'Пароль должен содержать минимум 6 символов, одну заглавную букву и одну цифру' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username',
            [username, hashedPassword]
        );

        res.status(201).json({
            message: 'Пользователь зарегистрирован',
            user: result.rows[0]
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Логин пользователя
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Логин и пароль обязательны' });
    }

    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Неверный логин или пароль' });
        }

        const valid = await bcrypt.compare(password, result.rows[0].password_hash);

        if (!valid) {
            return res.status(400).json({ error: 'Неверный логин или пароль' });
        }

        const token = jwt.sign(
            { id: result.rows[0].id, username: result.rows[0].username },
            process.env.JWT_SECRET || 'mySuperSecretKey123',
            { expiresIn: '1h' }
        );

        res.json({
            message: 'Вход выполнен',
            token,
            user: {
                id: result.rows[0].id,
                username: result.rows[0].username
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});