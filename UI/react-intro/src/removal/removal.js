import React, { useState, useEffect, useRef } from 'react';
import clean from '../components/pictures/clean.png'
import './removal.css'

function removal(){
    const handelNavigate = (url)=>{
        window.open(url)
    }
    return(
        <div class="app_removal">
            <div class="removal">
                <img class="clean" src={clean}/>
                Мы переехали
            </div>
            <div>
            <div class="removal_div">
            <button class="list-button" onClick={() => handelNavigate("https://des.permkrai.ru/PhoneBook")} >
                    <h2 class="h2_rem">Новый справочник</h2>
            </button>
            <button class="list-button" onClick={() => handelNavigate("https://des.permkrai.ru/PhoneBook")} >
                    <h2 class="h2_rem">Альтернативная ссылка</h2>
            </button>
            </div>
            </div>
        </div>
    );
}

export default removal;