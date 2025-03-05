import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import './table.css';
import trash from '../pictures/trash.png'

function Table(){
  let DisplayData = null;


  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  },[navigate]);


  const [hosts, setHosts] = useState([])

  const fetchData = () => {
    fetch("http://192.168.19.50:3001/")
      .then(response => {
        return response.json()
      })
      .then(data => {
          setHosts(data)
      })
  }
  
  useEffect(() => {
    fetchData()
  }, [])


    const handleDelete = async (id) => {
      const _id = id;
        try {
            const response = await fetch(`http://192.168.19.50:3001/delete/${_id}`, {
                method: 'DELETE',
            });
            fetchData();
           
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };

    DisplayData=hosts.map(
        (info)=>{


            const s = {}
            if(info.id === 31) s.background = 'yellow'
            return(

                <tbody class='table_host' style={s}>  

                <tr class ='th_host'>
                    <td class ='tb_host' >{info.id}</td>  
                    <td class ='tb_host'>{info.fcs}</td>
                    <td class ='tb_host host-cell' >{info.host}
                      <button value={info.id} class="host-button" onClick={() =>handleDelete(info.id)} >
                        <img  class="host-button" src={trash}/>
                      </button>
                    </td>
                </tr>

                </tbody>

            )
        }
    )



    return(
      <div class="div_table">

        <div class="table">
             <table>
                    <thead class="thead">
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
      <div>
      <form className="login-form"  >
        <div className="form-group">
          <label htmlFor="fcs"> ФИО</label>
          <input
            type="text"
            id="fcs"
             placeholder="Введите ФИО"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="host">Хост</label>
          <input
            type="text"
            id="host"
            placeholder="Введите хост"
            required
          />
        </div>
        <button type="submit" className="login-button" > Добавить </button>
      </form>
    </div>
        </div>
      </div>
    );
}

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