import React from "react";
import json from "./res.json";
import search from './pictures/search.png';
import qrtg from './pictures/qrtg.png'
import qrvk from './pictures/qrvk.png'
import up from './pictures/up.png';
import { useRef } from "react";
import logo from './pictures/DES-PB.png';

function Search(){

    const [searchItem, setSearchItem] =  React.useState('')
    const [_search, setSearch] = React.useState(json);

    var _json = JSON.parse(JSON.stringify(_search));
         
    let DisplayData = null;


    const handleInputChange = (e) => { 
        const searchTerm = searchItem;
    
        const _search = json.filter((user) =>
        user.fcs.toLowerCase().includes(searchTerm.toLowerCase())
        );
    
        setSearch(_search);
    }
    
    DisplayData=_json.map(
        (info)=>{
            return(
                <tbody>  

                <tr class="tr_post">
                    {info.deport === "0" ? (
                      console.log(0)
                    ) : (
                        <td  class="post" colSpan="5" >{info.deport}</td>
                    )}
                </tr>

                <tr>
                    <td>{info.fcs}</td>
                    <td>{info.post}</td>
                    <td>{info.phone_number}</td>
                    <td>{info.Email}</td>
                    <td>{info.addres}</td>
                </tr>

                </tbody>

            )
        }
    )

    const onkeydown = (e) =>{
        if(e.key === "Enter"){
            const searchTerm = searchItem;
    
            const _search = json.filter((user) =>
            user.fcs.toLowerCase().includes(searchTerm.toLowerCase()));
    
            setSearch(_search);
        }
        if(e.key === "Backspace" && searchItem.length === 1){

            const searchTerm = "";
    
            const _search = json.filter((user) =>
            user.fcs.toLowerCase().includes(searchTerm.toLowerCase()));
            setSearch(_search);
            
        }
    }

    const text = "Контактная информация: \n тел. +7(342)207-05-20 , e-mail: info@des.permkrai.ru"
  
    
  
  const refScrollUp = useRef();

    const scrollUp = () =>{
        refScrollUp.current.scrollIntoView({ behavior: "smooth" });
    }




    return(
        <div>

             <div ref={refScrollUp}> 
                  <div class="div-logo"  >
                    <img class="App-logo" src={logo}/>
                    <div>
                    <h2 class="h2">Контактная информация: <br/> тел. +7(342)207-05-20 , e-mail: info@des.permkrai.ru</h2>
                    </div>
                    <img class="App-qrtg" src={qrtg} />
                    <img class="App-qrvk" src={qrvk}/>
                  </div>
                  <button class="up-button"  >
                      <img class="up-image" src={up}  alt = "image" onClick={scrollUp}/>
                  </button>
            </div>


            <div class="trace">

            <div class="core">
                <button class="search-button" onClick={handleInputChange}  >
                    <img class="search-image" src={search}  alt = "image"/>
                </button>
                <input type='search' id='q' 
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
                          
                 
                        {DisplayData}
                </table>
            </div>
        </div>
    );
}
export default Search