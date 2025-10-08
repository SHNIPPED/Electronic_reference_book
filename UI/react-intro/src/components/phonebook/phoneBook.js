import React, { useState, useEffect } from "react";
import search from '../pictures/search.png';
import qrtg from '../pictures/qrtg.png'
import qrvk from '../pictures/qrvk.png'
import up from '../pictures/up.png';
import { useRef } from "react";
import logo from '../pictures/DES-PB.png';
import axios from 'axios';

function PhoneBook(){
    const [phone, setPhone] = useState([]);
    const [searchItem, setSearchItem] =  React.useState('')
    const [groupedPhone, setGroupedPhone] = useState({});
         
    useEffect(() => {
        const fetchData = async () =>{
            try {
                const response = await axios.get("http://192.168.19.50:3001/PhoneBook");
                
                if (response.data && response.data.phoneBooks) {
                    setPhone(response.data.phoneBooks);
                    sortPeople(response.data.phoneBooks);
                } else {
                    console.error("Данные не получены или пустые:", response.data);
                    setPhone([]);
                    sortPeople([]); 
                }
            } catch (error) {
                console.error("Ошибка при загрузке данных:", error);
                setPhone([]); 
                sortPeople([]);
            }
        }
        fetchData();
    }, []);

    const handleInputChange = () => { 
        const searchTerm = searchItem.toLowerCase();
    
        const filteredData = phone.filter((user) =>
            user.fcs.toLowerCase().includes(searchTerm)
        );
    
        sortPeople(filteredData);
    }

    const sortPeople = (data) =>{
        const departments = {};

        data.forEach(person => {
            if (!departments[person.deport]) {
                departments[person.deport] = [];
            }
            departments[person.deport].push(person);
        });
        setGroupedPhone(departments);
    } 

    const onkeydown = (e) =>{
        if(e.key === "Enter"){
            handleInputChange();
        }
        if(e.key === "Backspace" && searchItem.length === 1){

          setSearchItem("");
          sortPeople(phone);
        }
    }
  
    const refScrollUp = useRef();
    const scrollUp = () =>{
        refScrollUp.current.scrollIntoView({ behavior: "smooth" });
    }

    return(
        <div>

            <div ref={refScrollUp}> 
                <div class="div-logo"  >
                    <img class="App-logo" src={logo} alt="logo"/>
                <div>
                <h2 class="h2">Контактная информация: <br/> тел. +7(342)207-05-20 , e-mail: info@des.permkrai.ru</h2>
                </div>
                    <img class="App-qrtg" src={qrtg} alt="tg"/>
                    <img class="App-qrvk" src={qrvk} alt="vk"/>
                </div>
                <button class="up-button"  >
                    <img class="up-image" src={up}  alt = "scroll up" onClick={scrollUp}/>
                </button>
            </div>

            <div class="trace">

            <div class="core">
                <button class="search-button" onClick={handleInputChange}  >
                    <img class="search-image" src={search}  alt = "search"/>
                </button>
                <input 
                type='search'
                id='q' 
                value={searchItem} 
                placeholder='Поиск'  
                onChange={event => setSearchItem(event.target.value) }
                onKeyDown={onkeydown} 
                />    
            </div>
            </div>
            <div class="div-logo">
                <table class="styled-table">
                    <thead class="thead">
                        <tr>
                            <th>ФИО</th>
                            <th>Должность</th>
                            <th>Телефон</th>
                            <th>Email</th>
                            <th>Адрес</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(groupedPhone).map((deport) => (
                            <React.Fragment key={deport}>
                                <tr className="tr_post">
                                    <td className="post" colSpan="5">
                                        {deport}
                                    </td>
                                </tr>
                                {groupedPhone[deport].map((info, index) => (
                                    <tr key={index}>
                                        <td>{info.fcs}</td>
                                        <td>{info.post}</td>
                                        <td>{info.phone_number}</td>
                                        <td>{info.email}</td>
                                        <td>{info.addres}</td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default PhoneBook