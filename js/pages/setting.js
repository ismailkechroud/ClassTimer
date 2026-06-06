import { loadSchedule, saveSchedule } from "../storage.js";
import { showTimerPage } from "../ui.js";

import { initTimerPage } from "./timer.js";






function showClasses(day) {
    const container = document.querySelector(".class-card");
    container.innerHTML = "";

    let filtered = schedule.filter(item => item.day === day);
    filtered.sort((a, b) => a.startMinutes - b.startMinutes);

    if (filtered.length === 0) {
        container.innerHTML = `<p class="empty">Void</p>`;
        return;
    }

    filtered.forEach((cls, index) => {
        const div = document.createElement("div");
        div.classList.add("class-info");

        //  نحفظ index هنا
        div.dataset.index = index;

        div.innerHTML = `
            <div class="settStartEnd"> ${cls.start} <br> ${cls.end} </div>
            <span class="settLine"></span>
            <div class="settTypeModule">${cls.type}: ${cls.module}</div>
            <div class="settClass">Class: ${cls.className}</div>
            
            <button class="settDelete">
                <img src="assets/icons/delete.svg">
            </button>
        `;
        
        container.appendChild(div);
    });

    //  :filtered عشان نستخدمه في الحذف
    window.currentFiltered = filtered;
}

let schedule;
const daysSett = document.querySelectorAll(".daySett");

daysSett.forEach(dayEl => {
    dayEl.addEventListener("click", () => {

        const isActive = dayEl.classList.contains("active");

        // احذف active من الكل
        daysSett.forEach(d => d.classList.remove("active"));

        if (!isActive) {
            // فعل العنصر الجديد
            dayEl.classList.add("active");

            const selectedDay = dayEl.dataset.select;
            schedule = loadSchedule();
            showClasses(selectedDay);

        } else {
            // إذا ضغط على نفس اليوم → إلغاء
            document.querySelector(".class-card").innerHTML = ``;
        }

    });
});





// To delete Lecture
document.querySelector(".class-card").addEventListener("click", (e) => {

    const btn = e.target.closest(".settDelete");
    if (!btn) return;

    const confirmDelete = confirm("Are you sure wanna delete the lecture?");

    if (!confirmDelete) return;

    const card = btn.closest(".class-info");
    const index = card.dataset.index;
    const clsToDelete = window.currentFiltered[index];

    schedule = schedule.filter(item => item !== clsToDelete);

    // حفظ التغييرات
    saveSchedule(schedule);


    const activeDay = document.querySelector(".daySett.active");
    if (activeDay) {
        showClasses(activeDay.dataset.select);
    }

});


const goBackBtn = document.querySelector(".goBack");

goBackBtn.addEventListener("click", () => {

    initTimerPage(); // Load page timer.js
    showTimerPage(); // ui.js
    
});

