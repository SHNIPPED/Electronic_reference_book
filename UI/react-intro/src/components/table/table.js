import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import './table.css';
import trash from '../pictures/trash.png'
import edit from '../pictures/edit.png'

function Table(){
    const [fcs, setFCS] = useState('');
    const [host, setHost] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [hosts, setHosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);


    const fetchData = () => {
        fetch("http://192.168.19.50:3001/")
            .then(response => response.json())
            .then(data => setHosts(data))
            .catch(error => console.error('Ошибка при загрузке данных:', error));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!fcs || !host) {
            alert('Пожалуйста, заполните все поля');
            return;
        }

        const userData = { fcs, host };

        try {
            let response;
            if (editingUser) {
                console.log(userData)
                response = await fetch(`http://192.168.19.50:3001/edit/${editingUser.id}`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData),
                });
            } else {

                response = await fetch('http://192.168.19.50:3001/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData),
                });
            }

                const data = await response.json();
                alert(data.message);
                setFCS('');
                setHost('');
                setEditingUser(null);
                fetchData();
        } catch (error) {
            console.error('Ошибка при отправке данных:', error);
            alert('Произошла ошибка');
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://192.168.19.50:3001/delete/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchData();
            } else {
                const errorData = await response.json();
                alert(`Ошибка: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };

    const startEditing = (user) => {
        setEditingUser(user);
        setFCS(user.fcs)
        setHost(user.host)
    };


    const DisplayData = hosts.map((info) => (
        <tbody key={info.id} className='table_host'>
            <tr className='th_host'>
                <td className='tb_host'>{info.id}</td>
                <td className='tb_host'>{info.fcs}</td>
                <td className='tb_host host-cell'>
                    {info.host}
                    <div className="host-div">
                        <button className="host-button" onClick={() => startEditing(info)}>
                            <img className="host-button" src={edit} alt="Edit" />
                        </button>
                        <button className="host-button" onClick={() => handleDelete(info.id)}>
                            <img className="host-button" src={trash} alt="Delete" />
                        </button>
                    </div>
                </td>
            </tr>
        </tbody>
    ));

    return (
        <div className="div_table">
            <div className="table">
                <table>
                    <thead className="thead">
                        <tr>
                            <th>№</th>
                            <th>ФИО</th>
                            <th>Хост</th>
                        </tr>
                    </thead>
                    {DisplayData}
                </table>
            </div>
            <div>
              <div class="div-form">
                  <form className="login-form" onSubmit={handleSubmit}>
                      <div className="form-group">
                          <label htmlFor="fcs">ФИО</label>
                          <input
                              type="text"
                              id="fcs"
                              value={fcs}
                              onChange={(e) => setFCS(e.target.value)}
                              placeholder="Введите ФИО"
                              required
                          />
                      </div>
                      <div className="form-group">
                          <label htmlFor="host">Хост</label>
                          <input
                              type="text"
                              id="host"
                              value={host}
                              onChange={(e) => setHost(e.target.value)}
                              placeholder="Введите хост"
                              required
                          />
                      </div>
                      <button type="submit" className="login-button">
                          {editingUser ? 'Изменить' : 'Добавить пользователя'}
                      </button>
                  </form>
              </div>
            </div>
        </div>
    );
};

export default Table

   // {
       // "id": 40,
     //   "fcs": "Романова Светлана Сергеевна",
      //  "post": "Ведущий документовед",
     //   "phone_number": "207-63-56 (707)",
     //   "Email": "ssromanova@des.permkrai.ru",
    //    "addres": "ул.Крупской,5 каб.104",
   //     "deport": "0"
   // },