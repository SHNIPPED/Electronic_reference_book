import express from 'express';
import mysql  from"mysql2";
import cors  from'cors';
import jwt  from'jsonwebtoken';
import bodyParser  from'body-parser';
import AuthRouter  from'./routes/AuthRouter.js'; 

const app = express();
const SECRET_KEY = 'your_secret_key';


app.use(bodyParser.json());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const corsOptions ={
  origin:'*', 
  credentials:true,            
  optionSuccessStatus:200,
}

app.use(cors(corsOptions))

app.listen(3001, error => {
	error ? console.log(error) : console.log(`listening port ${3001}`);
});

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "des",
    password: "Asdfg123"
});

connection.connect(function(err){
    if (err) {
      return console.error("Ошибка: " + err.message);
    }
    else{
      console.log("Подключение к серверу MySQL успешно установлено");
    }
});


app.get('/',  (req, res) => {
    connection.query("SELECT * FROM des.hosts",(error,result) =>{
    res.json(result)
  })
});

app.delete('/delete/:id',  (req, res) => {
  const {id} = req.params;
  if (isNaN(id)) {
    return res.status(400).json({ message: 'Некорректный ID' });
  }

  const query = 'DELETE FROM des.hosts WHERE id = ?';

  connection.query(query, [id], (error, result) => {
      if (error) {
          console.error('Ошибка при удалении записи:', error);
          return res.status(500).json({ message: 'Ошибка сервера' });
      }

      if (result.affectedRows > 0) {
          return res.status(200).json({ message: `Удалено записей: ${result.affectedRows}` });
      } else {
          return res.status(404).json({ message: 'Запись не найдена' });
      }
  })
});


app.use(AuthRouter);

// const users = [
//   { id: 1, username: '1', password: '1' },
// ];

// function authenticateUser(username, password) {
//   return users.find(user => user.username === username && user.password === password);
// }

// app.post('/login', (req, res) => {
//   const { username, password } = req.body;

//   const user = authenticateUser(username, password);

//   if (user) {
//       const token = jwt.sign({ userId: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });

//       res.json({ token });
//   } else {
//       res.status(401).json({ message: 'Неверные учетные данные' });
//   }
// });