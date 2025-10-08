import mysql from 'mysql2';

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "des",
    password: "Asdfg123"
});

connection.connect((error)=>{
    if(error){
        console.log('Ошибка подключения к БД:',error);
        return;
    }

    console.log('Успешное подключение к БД');
});

export default connection;