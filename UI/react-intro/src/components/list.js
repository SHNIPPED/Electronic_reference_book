import React from "react";
import logo from './pictures/DES_gor_blue.svg';
import qrtg from './pictures/qrtg.png'
import qrvk from './pictures/qrvk.png'
import pochta from './pictures/Pochta.png'
import msed from './pictures/msed.png'
import vk from './pictures/VK.png'
import tg from './pictures/tg.png'
import gu from './pictures/gu.png'
import ts from './pictures/ts.png'
import wialon from './pictures/w.png'
import zgv from './pictures/zgv.png'
import rz from './pictures/rz.png'
import ufhd from './pictures/ufhd.png'
import pp from './pictures/pp.png'
import cw from './pictures/cw.jpg'
import mart from './pictures/mart.jpg'

function List(){
    const navigate = (url) =>{
        window.open(url)
    }

    return(
        <div>
            <div  class="list-logo" >
                <div class="list-div-in" >
                    <img class="App-logo" src={logo}/>
                    <img class="list-qrtg " src={qrtg} />
                    <img class="App-qrvk" src={qrvk}/>
                    <button class="list-button-hidden" onClick={() => navigate("http://192.168.19.50:3000/Login?")}/>
                </div>
            </div>
            <div class="list-logo">
                <div class="list-div-in" > 
                <button class="list-button" onClick={() => navigate("http://192.168.19.50:3000/PhoneBoock")}  >
                    <img class="list-image" src={ts}  alt = "PhoneBoock" />
                </button>

                <button class="list-button" onClick={() => navigate("https://pochta.permkrai.ru/?Skin=Samoware")} >
                    <img class="list-image"  src={pochta}  alt = "Samoware" />
                </button>

                <button class="list-button" onClick={() => navigate("https://edms.permkrai.ru/auth.php?uri=%2F")} >
                    <img class="list-image"  src={msed}  alt = "МСЭД" />
                </button>
                </div>  
            </div>

            <div class="list-logo">
                <div class="list-div-in" > 
                <button class="list-button" onClick={() => navigate("https://vk.com/despermskiykray")} >
                    <img class="list-image" src={vk}  alt = "vk" />
                </button>

                <button class="list-button" onClick={() => navigate("https://t.me/DESPermskiyKray")} >
                    <img class="list-image" src={tg}   alt = "tg" />
                </button>

                <button class="list-button" onClick={() => navigate("https://www.gosuslugi.ru/")} >
                    <img class="list-image"  src={gu} alt = "ГосУслуги" />
                </button>
                </div>  
            </div>


            <div class="list-logo">
                <div class="list-div-in" > 
                    <button class="list-button" onClick={() => navigate("https://zakupki.mos.ru/")} >
                        <img class="list-image" src={pp}   alt = "MosZakupki" />
                    </button>
                    <button class="list-button" onClick={() => navigate("https://zakupki.gov.ru/epz/main/public/home.html")} >
                        <img class="list-image" src={zgv}   alt = "GosZakupki" />
                    </button>
                    <button class="list-button" onClick={() => navigate("https://auth.permkrai.ru/auth/realms/pk/protocol/openid-connect/auth?state=1aa010b51b808f39881be83dd8b093f7&scope=name%2Cemail&response_type=code&approval_prompt=auto&redirect_uri=http%3A%2F%2Fgoszakaz2.permkrai.ru%2Findex.php%3Flogout&client_id=pk2-client")} >
                        <img class="list-image" src={rz}   alt = "RisZakupki" />
                    </button>
                </div>  
            </div>

            <div class="list-logo">
                <div class="list-div-in" > 
                    <button class="list-button" onClick={() => navigate("https://web2.wiapro.ru/?lang=ru")} >
                        <img class="list-image" src={wialon}   alt = "Wialon" />
                    </button>

                    <button class="list-button" onClick={() => navigate("https://accounting.permkrai.ru/")} >
                        <img class="list-image" src={ufhd}   alt = "EisUFHD" />
                    </button>

                    <button class="list-button" onClick={() => navigate("https://cirwiki.permkrai.ru/doku.php")} >
                        <img class="list-image-des" src={cw}  alt = "CirWIKI" />
                    </button>
                </div>  
            </div>

            <div class="list-logo">
                <div class="image-container" > 
                    <img  src={mart} alt = "CirWIKI" />
                </div>  
            </div>
           
        </div>  
    );
}

export default List