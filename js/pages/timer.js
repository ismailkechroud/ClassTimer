import { loadSchedule } from "../storage.js";
import {showBeginPage, showSettingPage, showCalanderPage, showUnivPage} from '../ui.js';





/* ============ Home-Uni-Cala-Sett + install-link ============ */

let deferredPrompt = null;

window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
});

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}


const icons = document.querySelectorAll(".icon");

icons.forEach(icon => {
    icon.addEventListener("click", () => {
        
        if (icon.classList.contains("home")) {

            StopTimerPage();
            showBeginPage();   // ui.js
        
        } else if (icon.classList.contains("install")) {
            // when I click, install the app then hide the icon and show the icon "Link"
            if (deferredPrompt) {
                deferredPrompt.prompt();

                deferredPrompt.userChoice.then((choiceResult) => {

                    deferredPrompt = null;

                    if (choiceResult.outcome === "accepted") {

                        localStorage.setItem("app-installed", "true");

                        document.querySelector(".install").style.display = "none";
                        document.querySelector(".link").style.display = "block";
                    }
                });

            } else {
                alert("التثبيت غير متاح حالياً من هذا المتصفح");
            }
        

        } else if (icon.classList.contains("link")) {

            // when I click, I just copy the link of website to share it
            const appUrl = window.location.href;

            navigator.clipboard.writeText(appUrl).then(() => {
                showToast("تم نسخ رابط التطبيق ويمكنك مشاركته");
            });


        
        } else if (icon.classList.contains("univ")) {

            StopTimerPage();
            showUnivPage(); // ui.js
            
        } else if (icon.classList.contains("calander")) {

            StopTimerPage();
            showCalanderPage(); // ui.js
            
        } else if (icon.classList.contains("setting")) { // icon.classList.contains("setting")

            StopTimerPage();  
            showSettingPage();   // ui.js

        }
    });
});












let intervalId;
export function initTimerPage() {

    /* ============ Timer + Circle + infoLecture + NextLecture ============ */ 
    const circle = document.querySelector("circle");

    // نأخذ radius مباشرة من SVG
    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;  // نحسب المحيط
    // نضبط الدائرة
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = 0;
    

    function updateCircle(remaining, duration) {
        const progress = remaining / duration; // من 1 إلى 0

        const offset = circumference * (1 - progress);

        circle.style.strokeDashoffset = offset;
    }







    function timeNow() {
        /// How to get currently date is JS ?
        const now = new Date();  // Date() is Class in JS as defulte

        return {
            currDay: now.getDay(),

            currHour: now.getHours(),
            currMinute: now.getMinutes(),
        }

    }

    function filterDays(day, sched) {
        const daysMap = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
        return sched.filter(item => item.day === daysMap[day]);  // sched[0].day = daysMap[0]
    }



    function updateTime(remTime) {

        const hour = Math.floor(remTime / 60);
        const minute = remTime % 60;

        const h = hour.toString().padStart(2, '0');
        const m = minute.toString().padStart(2, '0');
        
        document.getElementById("time").textContent = `${h}:${m}`;
        
    }

    

    function updateInfoLecture(InfoLecture) {
        
        document.getElementById("lectureStartEnd").textContent = InfoLecture.start + " → " + InfoLecture.end;
        document.getElementById("lectureTypeModule").textContent = InfoLecture.type + ": " + InfoLecture.module;
        document.getElementById("lectureClass").textContent = "Class: " + InfoLecture.className;

    }

    function updateNextLecture(NextLecture) {

        document.getElementById("nextStartEnd").textContent = NextLecture.start + " → " + NextLecture.end;
        document.getElementById("nextTypeModule").textContent = NextLecture.type + ": " + NextLecture.module;
        document.getElementById("nextClass").textContent = "Class: " + NextLecture.className;
    }

    const text1 = "/ClassTimer/assets/stickers/finishlecture.gif";
    const text1_1 = "/ClassTimer/assets/stickers/itsover.gif";
    const text2 = "/ClassTimer/assets/stickers/weekend.gif";
    const text3 = "Before Starting.";
    const text4 = "/ClassTimer/assets/stickers/freetime.gif";
    const text4_1 = "/ClassTimer/assets/stickers/lunchtime.gif";
    
    /*  this for liveservice
    const text1 = "../../assets/stickers/finishlecture.gif";
    const text1_1 = "../../assets/stickers/itsover.gif";

    const text2 = "../../assets/stickers/weekend.gif";

    const text3 = "Before Starting.";

    const text4 = "../../assets/stickers/freetime.gif";
    const text4_1 = "../../assets/stickers/lunchtime.gif"
    */

    // When I load data from LocalStorage
    let schedule;
    
    intervalId = setInterval(() => {

        const now = timeNow();
        const currDay = now.currDay;  // 0-6 (الأحد = 0)

        schedule = loadSchedule();
        const scheduleCurrDay = filterDays(currDay, schedule);
        scheduleCurrDay.sort((a, b) => a.startMinutes - b.startMinutes);

        // console.log(scheduleCurrDay);

        const length = scheduleCurrDay.length;
        
        
        if (length > 0) {  // you have lectures to day
            
            const currTimeInMin = now.currHour * 60 + now.currMinute;
            // const currTimeInMin = 9 * 60 + 49;

            let remaining_time = 0;
            for (let i = 0; i < length; i++) {

                if (scheduleCurrDay[i].startMinutes <= currTimeInMin && 
                currTimeInMin < scheduleCurrDay[i].endMinutes)
                
                { // you are inside the lecture [i]
                    
                    // (endMinutes - currTimeInMin) transfer to [h, m] every minute
                    // every minute change the var {hour},{minute} to show it to html file

                    const remaining_time = scheduleCurrDay[i].endMinutes - currTimeInMin;
                    updateTime(remaining_time);

                    
                    updateCircle(remaining_time, scheduleCurrDay[i].duration);

                    document.getElementById("otherInfo").textContent = "";
                    updateInfoLecture(scheduleCurrDay[i]);


                    if (i < length - 1) {
                        updateNextLecture(scheduleCurrDay[i+1]);
                    } else {
                        document.getElementById("nextStartEnd").textContent = "";
                        document.getElementById("nextTypeModule").textContent = "";
                        document.getElementById("nextClass").textContent = "";
                    }
                    
                    

                    // console.log(scheduleCurrDay[i]);
                    break;

                } else {  

                    document.getElementById("lectureStartEnd").textContent = "";
                    document.getElementById("lectureTypeModule").textContent = "";
                    document.getElementById("lectureClass").textContent = "";
                    
                    if (i < length - 1 && 
                    scheduleCurrDay[i].endMinutes <= currTimeInMin &&
                    currTimeInMin < scheduleCurrDay[i + 1].startMinutes) {

                        // if the currentlytime is between lectures (void time +10min)

                        const remaining_time = scheduleCurrDay[i + 1].startMinutes - currTimeInMin;
                        updateTime(remaining_time);

                        const duration_time = scheduleCurrDay[i + 1].startMinutes - scheduleCurrDay[i].endMinutes;
                        updateCircle(remaining_time, duration_time);

                        if (currTimeInMin > (12*60) && currTimeInMin < (13*60)) { // btw 12h and 13h
                            document.getElementById("otherInfo").innerHTML =`<img class="sticker-small" src="${text4_1}">`;
                        } else {
                            document.getElementById("otherInfo").innerHTML =`<img class="sticker-small" src="${text4}">`;
                        }
                        // document.getElementById("otherInfo").textContent = text4;

                        updateNextLecture(scheduleCurrDay[i + 1]);


                        break;
                        
                    } else if (currTimeInMin < scheduleCurrDay[0].startMinutes) {

                        // if you currentlytime are before the begin Lecture

                        const remaining_time = scheduleCurrDay[0].startMinutes - currTimeInMin;
                        updateTime(remaining_time);

                        const duration_time = scheduleCurrDay[0].startMinutes;

                        
                        updateCircle(remaining_time, duration_time);

                        
                        document.getElementById("otherInfo").textContent = text3;
                        
                        updateNextLecture(scheduleCurrDay[0]);

                    
                        break;

                    } else if (currTimeInMin >= scheduleCurrDay[length - 1].endMinutes) {

                        // if you currentlytime are after the last Lecture
                        
                        document.getElementById("time").textContent = "";
                    


                        updateCircle(1, 1);


                        // document.getElementById("otherInfo").textContent = text1;
                        if (currTimeInMin < scheduleCurrDay[length - 1].endMinutes + 5) { // after 5 min
                            document.getElementById("otherInfo").innerHTML =`<img class="sticker" src="${text1_1}">`;
                        } else {
                            document.getElementById("otherInfo").innerHTML =`<img class="sticker" src="${text1}">`;
                        }
                        

                        document.getElementById("nextStartEnd").textContent = "";
                        document.getElementById("nextTypeModule").textContent = "";
                        document.getElementById("nextClass").textContent = "";

                        break;
                    }
                }
            }

        } else { // you don't have lectures to day

            document.getElementById("time").textContent = "";


            updateCircle(1, 1);

            
            document.getElementById("lectureStartEnd").textContent = "";
            document.getElementById("lectureTypeModule").textContent = "";
            document.getElementById("lectureClass").textContent = "";
            

            
            document.getElementById("otherInfo").innerHTML =`<img class="sticker" src="${text2}">`;

            document.getElementById("nextStartEnd").textContent = "";
            document.getElementById("nextTypeModule").textContent = "";
            document.getElementById("nextClass").textContent = "";

        }

        
    }, 1); // 1 ms = 0.001 second

}

export function StopTimerPage() {
    clearInterval(intervalId);
}