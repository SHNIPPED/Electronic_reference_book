import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';

function Login (){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  const handleLogin = async () => {
     try {
        const response = await axios.post('http://192.168.19.50:3001/login', { username, password });
          await setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          await navigate(`http://192.168.19.50:3000/Host`);
      } catch (error) {
         console.log("slomal")
     }

  };

  const navigate = (url) =>{
    window.location = url
  }


  return (
    <div className="body">
      <div className="login-container">
      <form className="login-form" >
        <h2>Авторизация</h2>
        <div className="form-group">
          <label htmlFor="username"> Имя пользователя</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Пароль</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button" onClick={handleLogin} > Войти </button>
      </form>
    </div>
    </div>
  );
};

export default Login;