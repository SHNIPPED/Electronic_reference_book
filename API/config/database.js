import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: process.env.DB_HOST || "192.168.19.101",
    user: process.env.DB_USER || "root",
    database: process.env.DB_NAME || "des",
    password: process.env.DB_PASSWORD || "Asdfg123",
    ssl: false,
    waitForConnections: true,
    connectionLimit: 10,          
    queueLimit: 0,               
    enableKeepAlive: true,        
    keepAliveInitialDelay: 10000  
});

export async function query(sql, params = []) {
    try {
        const [rows] = await pool.query(sql, params);
        return rows;
    } catch (err) {
        console.error('Ошибка выполнения запроса:', err.message);
        throw err;
    }
}

export { pool };