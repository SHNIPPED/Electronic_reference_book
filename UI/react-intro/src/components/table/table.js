import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import './table.css';

function Table(){
    let DisplayData = null;


    const navigate = useNavigate();

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
      }
    }, [navigate]);


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






    DisplayData=hosts.map(
        (info)=>{


            const s = {}
            if(info.id === 31) s.background = 'yellow'
            return(

                <tbody class='table_host' style={s}>  

                <tr class ='th_host'>
                    <td class ='tb_host' >{info.id}</td>  
                    <td class ='tb_host'>{info.fcs}</td>
                    <td class ='tb_host' >{info.host}</td>
                </tr>

                </tbody>

            )
        }
    )



    return(
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
    );
}

export default Table