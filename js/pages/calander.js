import {showTimerPage} from '../ui.js';

import {initTimerPage} from './timer.js';



const btn = document.getElementById("btnBack");

btn.addEventListener("click", () => {

    showTimerPage();
    initTimerPage();

});




// add Schedule 
const addBtn = document.getElementById("addSchedule");
const fileInput = document.getElementById("scheduleInput");
const scheduleImage = document.getElementById("scheduleImage");

addBtn.addEventListener("click", () => {
    fileInput.click();
});

fileInput.addEventListener("change", (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(event) {

        const imageData = event.target.result;

        scheduleImage.src = imageData;
        scheduleImage.style.display = "block";

        // حفظ الصورة
        localStorage.setItem("scheduleImage", imageData);
    };

    reader.readAsDataURL(file);
});

// عند فتح التطبيق
const savedImage = localStorage.getItem("scheduleImage");

if (savedImage) {
    scheduleImage.src = savedImage;
    scheduleImage.style.display = "block";
}








const fullscreenViewer = document.getElementById("fullscreenViewer");

const fullscreenImage = document.getElementById("fullscreenImage");

scheduleImage.addEventListener("click", () => {

    if (!scheduleImage.src) return;

    fullscreenImage.src = scheduleImage.src;

    fullscreenViewer.style.display = "flex";
});

fullscreenViewer.addEventListener("click", () => {
    fullscreenViewer.style.display = "none";
});