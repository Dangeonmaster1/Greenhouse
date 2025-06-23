// backend/utils/generateTestData.js

const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function generateSensorDataForGreenhouse(greenhouseId) {
    const now = new Date();
    const data = [];

    // Генерируем данные за последние 7 дней, каждые 30 минут
    for (let i = 0; i < 7 * 48; i++) { // 7 дней × 48 записей по 30 минут
        const recordedAt = new Date(now.getTime() - i * 30 * 60 * 1000); // минус 30 минут на итерацию

        const temperature = Number((Math.random() * 10 + 20).toFixed(2)); // 20–30°C
        const airHumidity = Number((Math.random() * 20 + 50).toFixed(2)); // 50–70%
        const soilHumidity = Number((Math.random() * 20 + 30).toFixed(2)); // 30–50%
        const lightLevel = Number((Math.random() * 100).toFixed(2)); // 0–100

        data.push({
            greenhouse_id: greenhouseId,
            temperature,
            air_humidity: airHumidity,
            soil_humidity: soilHumidity,
            light_level: lightLevel,
            recorded_at: recordedAt.toISOString()
        });
    }

    try {
        await pool.query('DELETE FROM sensor_data WHERE greenhouse_id = $1', [greenhouseId]);

        const queryText = `
          INSERT INTO sensor_data (
            greenhouse_id, temperature, air_humidity, soil_humidity, light_level, recorded_at
          ) VALUES ${data.map((_, i) => `($1, $2, $3, $4, $5, $6)`)}
        `;

        for (const row of data) {
            await pool.query(queryText, [
                row.greenhouse_id,
                row.temperature,
                row.air_humidity,
                row.soil_humidity,
                row.light_level,
                row.recorded_at
            ]);
        }

        console.log(`✅ Добавлено ${data.length} записей для теплицы ${greenhouseId}`);
    } catch (err) {
        console.error('❌ Ошибка при вставке данных:', err.message);
    }
}

async function main() {
    const GREENHOUSE_ID = 1; // ID теплицы, которую будем заполнять
    await generateSensorDataForGreenhouse(GREENHOUSE_ID);
    await pool.end();
}

main();