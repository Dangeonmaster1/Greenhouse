// src/pages/GreenhouseDetail.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function GreenhouseDetail({ id }) {
    const [greenhouse, setGreenhouse] = useState(null);
    const [sensorData, setSensorData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                const token = localStorage.getItem('token');

                // Получаем конкретную теплицу
                const ghResponse = await axios.get(`http://localhost:5000/api/greenhouses/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                // Получаем данные датчиков этой теплицы
                const dataResponse = await axios.get(`http://localhost:5000/api/sensor-data?greenhouse_id=${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                setGreenhouse(ghResponse.data);
                setSensorData(dataResponse.data);
                setLoading(false);

            } catch (err) {
                console.error(err.message);
                setError('Не удалось загрузить данные');
                setLoading(false);
            }
        }

        fetchData();
    }, [id]);

    if (loading) return <p>Загрузка данных...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!greenhouse) return <p>Теплица не найдена</p>;

    // Подготовим данные для графиков
    const labels = sensorData.map(d => new Date(d.recorded_at).toLocaleString());

    const temperatureData = {
        labels,
        datasets: [
            {
                label: 'Температура (°C)',
                data: sensorData.map(d => d.temperature),
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.4,
                fill: true
            }
        ]
    };

    const airHumidityData = {
        labels,
        datasets: [
            {
                label: 'Влажность воздуха (%)',
                data: sensorData.map(d => d.air_humidity),
                borderColor: 'rgba(53, 162, 235, 1)',
                backgroundColor: 'rgba(53, 162, 235, 0.2)',
                tension: 0.4,
                fill: true
            }
        ]
    };

    const soilHumidityData = {
        labels,
        datasets: [
            {
                label: 'Влажность почвы (%)',
                data: sensorData.map(d => d.soil_humidity),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4,
                fill: true
            }
        ]
    };

    const lightLevelData = {
        labels,
        datasets: [
            {
                label: 'Освещённость (уровень)',
                data: sensorData.map(d => d.light_level),
                borderColor: 'rgba(255, 206, 86, 1)',
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                tension: 0.4,
                fill: true
            }
        ]
    };

    return (
        <div style={{ maxWidth: '800px', margin: 'auto' }}>
            <h2>{greenhouse.name}</h2>
            <p><strong>Местоположение:</strong> {greenhouse.location || 'не указано'}</p>

            <h3>📊 Температура</h3>
            <Line data={temperatureData} />

            <h3>💧 Влажность воздуха</h3>
            <Line data={airHumidityData} />

            <h3>🌱 Влажность почвы</h3>
            <Line data={soilHumidityData} />

            <h3>☀️ Освещённость</h3>
            <Line data={lightLevelData} />

            <hr />
            <a href="/dashboard">← Назад к списку</a>
        </div>
    );
}

export default function GHDetailPage(props) {
    const urlParams = new URLSearchParams(window.location.search);
    const greenhouseId = urlParams.get('id');

    if (!greenhouseId) {
        return (
            <div style={{ maxWidth: '400px', margin: 'auto' }}>
                <h2>❌ Ошибка</h2>
                <p>ID теплицы не указан.</p>
                <a href="/dashboard">← К списку теплиц</a>
            </div>
        );
    }

    return <GreenhouseDetail id={greenhouseId} />;
}