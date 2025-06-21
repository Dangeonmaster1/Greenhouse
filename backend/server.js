// backend/server.js

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./config/db');
const authenticateToken = require('./middleware/authMiddleware');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// Тестовый маршрут
app.get('/api/test-db', authenticateToken, async (req, res) => {
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

    // Валидация логина
    if (username.length < 3 || username.length > 30) {
        return res.status(400).json({ error: 'Логин должен быть от 3 до 30 символов' });
    }

    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
        return res.status(400).json({ error: 'Логин может содержать только буквы, цифры и подчеркивания' });
    }

    // Валидация пароля
    if (password.length < 6) {
        return res.status(400).json({ error: 'Пароль должен быть не короче 6 символов' });
    }

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

// Вход пользователя
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
            process.env.JWT_SECRET,
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

// Получить свои теплицы
app.get('/api/greenhouses', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM greenhouses WHERE user_id = $1',
            [req.user.id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Добавить новую теплицу
app.post('/api/greenhouses', authenticateToken, async (req, res) => {
    const { name, location } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Имя теплицы обязательно' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO greenhouses (user_id, name, location) VALUES ($1, $2, $3) RETURNING *',
            [req.user.id, name, location]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Получить данные датчиков для своих теплиц
app.get('/api/sensor-data', authenticateToken, async (req, res) => {
    try {
        const greenhousesResult = await pool.query(
            'SELECT id FROM greenhouses WHERE user_id = $1',
            [req.user.id]
        );

        const greenhouseIds = greenhousesResult.rows.map(g => g.id);

        if (greenhouseIds.length === 0) {
            return res.json([]);
        }

        const result = await pool.query(
            'SELECT * FROM sensor_data WHERE greenhouse_id = ANY($1)',
            [greenhouseIds]
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});