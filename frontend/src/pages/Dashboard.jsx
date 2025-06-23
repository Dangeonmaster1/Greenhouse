// frontend/src/pages/Dashboard.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
    const [greenhouses, setGreenhouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchGreenhouses() {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/greenhouses', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                setGreenhouses(response.data);
                setLoading(false);

            } catch (err) {
                setError('Не удалось загрузить теплицы');
                setLoading(false);
            }
        }

        fetchGreenhouses();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Вы уверены, что хотите удалить эту теплицу?');

        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/greenhouses/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setGreenhouses(greenhouses.filter(gh => gh.id !== id));

        } catch (err) {
            alert('Ошибка при удалении теплицы');
            console.error(err.message);
        }
    };

    if (loading) return <p>Загрузка...</p>;

    return (
        <div style={{ maxWidth: '600px', margin: 'auto' }}>
            <h2>мои теплицы</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {greenhouses.length === 0 ? (
                <p>У вас ещё нет теплиц</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {greenhouses.map(gh => (
                        <li key={gh.id} style={{
                            backgroundColor: '#fff',
                            padding: '20px',
                            marginBottom: '15px',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            position: 'relative'
                        }}>
                            <h3>{gh.name}</h3>
                            <p><strong>Локация:</strong> {gh.location || 'не указана'}</p>
                            <button onClick={() => window.location.href = `/greenhouse?id=${gh.id}`}>
                                Посмотреть данные
                            </button>
                            <button
                                onClick={() => handleDelete(gh.id)}
                                style={{ marginLeft: '10px', background: 'red' }}
                            >
                                ❌ Удалить
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <hr />
            <button onClick={() => window.location.href = '/add-greenhouse'}>
                ➕ Добавить новую теплицу
            </button>
        </div>
    );
}

export default Dashboard;