import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import trash from "../pictures/trash.png";
import edit from "../pictures/edit.png";
import axios from 'axios';

function Phone(){

    const [fcs, setFCS] = useState("");
    const [post, setPost] = useState("");
    const [phone_number, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [addres, setAddres] = useState("");
    const [deport, setDeport] = useState("");
    const [groupedPhone, setGroupedPhone] = useState({});
    const [editingUser, setEditingUser] = useState(null);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const response = await axios.get("http://192.168.19.50:3001/PhoneBook");
            
            if (response.data && response.data.phoneBooks) {
                sortPeople(response.data.phoneBooks);
            } else {
                console.error("Данные не получены или пустые:", response.data);
                sortPeople([]); 
            }
        } catch (error) {
            console.error("Ошибка при загрузке данных:", error); 
            sortPeople([]);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!fcs || !post || !deport) {
            alert("Пожалуйста, заполните все поля");
            return;
        }
    
        const userData = {fcs, post, phone_number, email, addres, deport };
    
        try {
            let response;
            if (editingUser) {
                console.log(userData)
                response = await axios.post(
                    `http://192.168.19.50:3001/PhoneBook/edit/${editingUser.id}`,
                    userData
                   
                );
            } else {
                response = await axios.post(
                    `http://192.168.19.50:3001/PhoneBook/create`,
                    userData
                );
            }
    
            alert(response.data.message);
            resetForm();
            setEditingUser(null);
            fetchData();
        } catch (error) {
            console.error("Ошибка при отправке данных:", error);
            alert(error.response?.data?.message || "Произошла ошибка");
        }
    };
    
    const resetForm = () => {
        setFCS("");
        setAddres("");
        setDeport("");
        setEmail("");
        setPhoneNumber("");
        setPost("");
    };
    
    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://192.168.19.50:3001/PhoneBook/delete/${id}`);
            
            alert(response.data.message);
            fetchData();
        } catch (error) {
            console.error("Ошибка:", error);
            alert(error.response?.data?.message || "Произошла ошибка при удалении");
        }
    };
    
    const startEditing = (user) => {
        setEditingUser(user);
        setFCS(user.fcs);
        setPost(user.post);
        setPhoneNumber(user.phone_number);
        setEmail(user.email);
        setAddres(user.addres);
        setDeport(user.deport);
    };

    return(
        <div className="div_table">
            <div сlassName="div_table">
                <table сlassName="table">
                    <thead сlassName="thead">
                        <tr>
                            <th>ФИО</th>
                            <th>Должность</th>
                            <th>Телефон</th>
                            <th>Email</th>
                            <th>Адрес</th>
                        </tr>
                    </thead>
                    <tbody className="table_host">
                        {Object.keys(groupedPhone).map((deport) => (
                            <React.Fragment key={deport}>
                                <tr className="tb_host">
                                    <td className="post" colSpan="5">
                                        {deport}
                                    </td>
                                </tr>
                                {groupedPhone[deport].map((info, index) => (
                                    <tr key={info.id} className="th_host" >
                                        <td className="tb_host" >{info.fcs}</td>
                                        <td className="tb_host" >{info.post}</td>
                                        <td className="tb_host" >{info.phone_number}</td>
                                        <td className="tb_host" >{info.email}</td>
                                        <td className="tb_host host-cell" >{info.addres}
                                            <div className="host-div">
                                                <button className="host-button" onClick={() => startEditing(info)} >
                                                    <img className="host-button" src={edit} alt="Edit" />
                                                </button>
                                                <button
                                                    className="host-button"
                                                    onClick={() => handleDelete(info.id)}
                                                    >
                                                    <img className="host-button" src={trash} alt="Delete" />
                                                </button>
                                            </div>    
                                        </td>                
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
            <div>
                <div>
                    <div class="div-form">
                        <form className="login-form" onSubmit={handleSubmit}>
                            <div className="form-group" >
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
                                <label htmlFor="post">Должность</label>
                                <input
                                type="text"
                                id="post"
                                value={post}
                                onChange={(e) => setPost(e.target.value)}
                                placeholder="Введите должность"
                                required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone_number">Телефон</label>
                                <input
                                type="text"
                                id="phone_number"
                                value={phone_number}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="Введите телефон"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                type="text"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Введите email"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="addres">Адрес</label>
                                <input
                                type="text"
                                id="addres"
                                value={addres}
                                onChange={(e) => setAddres(e.target.value)}
                                placeholder="Введите адрес"
                                required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="deport">Отдел</label>
                                <input
                                type="text"
                                id="deport"
                                value={deport}
                                onChange={(e) => setDeport(e.target.value)}
                                placeholder="Введите отдел"
                                required
                                />
                            </div>
                            <button type="submit" className="login-button">
                                {editingUser ? "Изменить" : "Добавить"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <div className="div-button">
                <button className="button-rgb" onClick={() => navigate("/Host")}>
                    Хосты
                </button>
            </div>
        </div>
    );
}
export default Phone