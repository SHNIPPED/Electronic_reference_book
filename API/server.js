import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import AuthRouter from './routes/AuthRouter.js';
import phoneBookRoutes from './routes/phoneBookRoutes.js';
import hostsRoutes from './routes/HostsRoutes.js'

dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
}

app.use(cors(corsOptions))

app.use('/PhoneBook', phoneBookRoutes);
app.use(hostsRoutes)
app.use(AuthRouter);

app.listen(3001, error => {
  error ? console.log(error) : console.log(`Слушается порт ${3001}`);
});