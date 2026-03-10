import mysql from 'mysql2';

const connection = mysql.createConnection({
    host: process.env.DB_HOST|| "localhost",
    user: process.env.DB_USER ||"root",
    database: process.env.DB_NAME || "des",
    password: process.env.DB_PASSWORD || "Asdfg123"
});

connection.connect((error)=>{
    if(error){
        console.log('Ошибка подключения к БД:',error);
        return;
    }

    console.log('Успешное подключение к БД');
});

export default connection;
