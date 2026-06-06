import {showTimerPage} from '../ui.js';
import {changeOrder} from '../storage.js';

import {initTimerPage} from './timer.js';



const btn = document.getElementById("btnBackToTimer");

btn.addEventListener("click", () => {

    showTimerPage();
    initTimerPage();

});


const icons = document.querySelectorAll(".univCard");

icons.forEach(icon => {
    icon.addEventListener("click", () => {
        
        if (icon.classList.contains("USTHB")) {

            changeOrder("#00c8ff");
        
        } else if (icon.classList.contains("ALGER2")) {
            
            changeOrder("#5bff5d");

        }
       
    });
});

