import React, { useState ,useEffect} from 'react';
import './Login.css';
import axios from 'axios';

function Login (){
  const [login, setUsername] = useState('');
  const [pwd, setPassword] = useState('');
  const [token, setToken] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault(); 
    try {
      const response = await axios.post('http://192.168.19.117:3001/login', { login, pwd });
      setToken(response.data);
      await localStorage.setItem('token', response.data);
    } catch (error) {
      console.error('Ошибка при авторизации:', error);
      alert('Неверный логин или пароль');
    }
  };

  useEffect(() => {
    if (token) {
        navigate('/Host');
    }
  }, [token]);

  const navigate = (url) =>{
    window.location.href = url
  }


  return (
    <div className="body">
      <div className="login-container">
      <form className="login-form" onSubmit={handleLogin} >
        <h2>Авторизация</h2>
        <div className="form-group">
          <label htmlFor="username"> Имя пользователя</label>
          <input
            type="text"
            id="username"
            value={login}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Пароль</label>
          <input
            type="password"
            id="password"
            value={pwd}
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