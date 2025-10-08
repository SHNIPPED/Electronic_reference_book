import React, { useState, useEffect, useRef } from 'react';
import cat from '../pictures/cat.png'
import './error.css'

function error(){
    return(
        <div class="app_error">
            <div class="error">
                404
            </div>
            <div class="div_error">
                <img class="img_error"src={cat} alt="cat"/>
                <h1 class="okak">ОКАК</h1>
            </div>
        </div>
    );
}

export default error;