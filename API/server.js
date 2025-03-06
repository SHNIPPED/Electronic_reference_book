import express from 'express';
import mysql  from"mysql2";
import cors  from'cors';
import bodyParser  from'body-parser';
import AuthRouter  from'./routes/AuthRouter.js'; 

const app = express();


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

app.post('/create',     (req,res) =>{
   const {fcs,host} = req.body;
   if(!fcs || !host){
    return res.status(400).json({message: 'Необходимо указать ФИО и хост'});
   }

    const query = "INSERT INTO `des`.`hosts` (`fcs`, `host`) VALUES (?, ?);";

    connection.query(query,[fcs,host],(error,result) =>{
      if(error){
          console.error('Ошибка при добавлении записи:', error);
          return res.status(500).json({message: 'Ошибка сервера'});
      }

      if(result.affectedRows >0){
        return res.status(200).json({message: `Добавлена запись: ${result.affectedRows}`});
      }else{
        return res.status(404).json({message:'Запись не добавлена'});
      }
    })
   });

   app.post('/edit/:id',   (req,res) =>{
    const {fcs,host} = req.body;
    const {id} = req.params;
    if(!fcs || !host || !id){
     return res.status(400).json({message: 'Необходимо указать ФИО и хост'});
    }
 
     const query = 'UPDATE des.hosts SET `fcs` = ?, `host` = ? WHERE (`id` = ?);';
 
     connection.query(query,[fcs,host,id],(error,result) =>{
       if(error){
           console.error('Ошибка при изменении записи:', error);
           return res.status(500).json({message: 'Ошибка сервера'});
       }
 
       if(result.affectedRows >0){
         return res.status(200).json({message: `Изменена запись: ${result.affectedRows}`});
       }else{
         return res.status(404).json({message:'Запись не изменена'});
       }
     })
    });
 


app.use(AuthRouter);