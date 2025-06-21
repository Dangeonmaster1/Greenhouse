import React, { useState } from 'react';

function AddGreenhouse() {
    const [formData, setFormData] = useState({
        name: '',
        location: ''
    });

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            setError('Название теплицы обязательно');
            return;
        }

        try {
            const token = localStorage.getItem('token');

            const response = await fetch('http://localhost:5000/api/greenhouses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Ошибка при добавлении теплицы');
            }

            const greenhouse = await response.json();
            setMessage('✅ Теплица добавлена!');
            setError('');

            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1000);

        } catch (err) {
            setError(err.message);
            setMessage('');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: 'auto' }}>
            <h2>➕ Добавить теплицу</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Название:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', marginBottom: '10px' }}
                    />
                </div>
                <div>
                    <label>Местоположение (необязательно):</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        style={{ width: '100%', marginBottom: '10px' }}
                    />
                </div>
                <button type="submit" style={{ width: '100%' }}>Добавить</button>
                {message && <p style={{ color: 'green' }}>{message}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <p><a href="/dashboard">← Назад к списку</a></p>
            </form>
        </div>
    );
}

export default AddGreenhouse;