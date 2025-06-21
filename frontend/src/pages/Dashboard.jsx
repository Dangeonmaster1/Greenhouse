
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
                console.error(err.message);
                setError('Не удалось загрузить теплицы');
                setLoading(false);
            }
        }

        fetchGreenhouses();
    }, []);

    if (loading) {
        return <p>Загрузка...</p>;
    }

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
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                            <h3>{gh.name}</h3>
                            <p><strong>Локация:</strong> {gh.location || 'не указана'}</p>
                            <button onClick={() => window.location.href = `/greenhouse/${gh.id}`}>
                                Посмотреть данные
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