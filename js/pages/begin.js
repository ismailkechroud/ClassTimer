import {loadSchedule, saveSchedule} from '../storage.js';
import {showTimerPage} from '../ui.js';

import { initTimerPage } from "./timer.js";





/* ===== Days ===== */
const days = document.querySelectorAll(".day");
// days it like an array = [SunButton, MonButton, TueButton, WedButton...]

days.forEach(day => {   // "day => {}" Arrow Function its same as "function(day){}"
    day.addEventListener("click",() => { // when I click on any day do ... 
        
        
        // day.classList.toggle("active"); // this just toggle switch but not usefull
        
        if (day.classList.contains("active")) { // if the day have class="active" do ...

            day.classList.remove("active"); // remove the class="active"
            
        } else { // if the day don't have class="active" do ...

            days.forEach(d => d.classList.remove("active")); // delete any class="avtive" from all days

            day.classList.add("active"); // add the class="active"

        }
        
        // Just for showing the day is selected or not
        // By using "dataset.day" to get the data from (data-day="") and Show it in console
        const selectedDay = day.dataset.select;
        if (day.classList.contains("active")) {
            console.log("select : " + selectedDay);
        } else {
            console.log("remove select : " + selectedDay);
        }
        
    });
});

// دالة جلب البيانات
function getDayData() {
    const activeDay = document.querySelector(".day.active");

    if (activeDay) {
        return {
            day: activeDay.dataset.select
        };
        /* الناتج
            day: Monday
        */ 
    } else {
        return null; // ما كاين حتى يوم مختار
    }
}











/* ===== Start-End ===== */
const start = document.getElementById("start");
const end = document.getElementById("end");

//  function : تنسيق الوقت تلقائيًا
function formatTime(input) {   // " /[^0-9]/g " this is REGEX
    let value = input.value.replace(/[^0-9]/g, "").slice(0,4); // منع الكتابة الزائدة (4 ارقام فقط)
    
    if (value.length >= 3) {
        value = value.slice(0,2) + ":" + value.slice(2);
        /* example : value = "0800"
            value.slice(0,2)  → "08"
            value.slice(2)    → "00"
            "08" + ":" + "00" → "08:00"
            1er4
        */
    }

    input.value = value; // تغيير قيمة المدخل كل ما المستخدم يكتب شيء (تغيير لحظي)

    /*
        a|k|$ → (void)
        jf7e5 → 75

        0    → 0
        08   → 08
        080  → 08:0
        0800 → 08:00
    */
}

// function : تحويل الوقت إلى دقائق للمقارنة
function toMinutes(time) {
    const [h, m] = time.split(":").map(Number);
    //".. [h, m] =" this call Destructuring

    /*
        "08:30".split(":")    → ["08", "30"]  String
    ["08", "30"].map(Number) → [8, 30]  Numbers
        [h, m] = [8, 30]      → h = 8 , m = 30
    */

    return h * 60 + m; // to minutes (8 x 60 + 30)
}

// function : تحقق من صحة الوقت
function isValidTime(time) {
    return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);

    /*
        /^([01]\d|2[0-3]):([0-5]\d)$/
        ^ → بداية النص
        $ → نهاية النص
        [01] →  اما 0 او 1
        \d → [0-9]
        | → او
        2[0-3] → [0-3] تبدا بالعدد 2 ثم اي عدد من هذا المجال
        : → رمز ثابت 
        [0-5]\d → تبدا بعدد من الجال [5-0] ثم اي عدد من الجال [9-0]

        0     8 :  3     0   
        [01] \d : [0-5] \d

        /../.test(time)  → True or false
        /^abc$/.test("abc") → true
        /^abc$/.test("ab") → false
    */

}

// البداية + الانتقال التلقائي للحقل الثاني 
start.addEventListener("input", () => {  // اي مدخل يدخله المستخدم تنفذ هذه الدالة
    formatTime(start);
    
    if (isValidTime(start.value)) { // عندما يدخل المستخدم وقت صحيح تنتقل الى الحقل الثاني
        
        end.focus(); // !!لا تعني انتهاء التركيز على الحقل الاول بل تعني التركيز على الحقل الثاني 
        
        if (end.value) {
            end.blur(); // عمل عدم التركيز على الحقل الثاني
        }
        
    }
});

//  النهاية
end.addEventListener("input", () => {
    formatTime(end);
    
    
    if (isValidTime(end.value)) {
        
        if (!start.value) {
            start.focus();
        } else {
            end.blur();
        }
        
    }
    
});

//  عند الانتهاء من البداية
start.addEventListener("blur", () => { // "blur" → عندما لا اكون مركز على الحقل
    if (!isValidTime(start.value)) {
        // alert("وقت البداية غير صحيح");
        start.value = "";
        return;
    }

    /*
    //  نهاية تلقائية (+1.30 ساعة)
    if (!end.value) {
        let mins = toMinutes(start.value) + 90;

        let h = Math.floor(mins / 60);
        let m = mins % 60;

        if (h < 24) {
            end.value = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
        }
    }
    */

});

//  التحقق من النهاية
end.addEventListener("blur", () => {
    if (!isValidTime(end.value)) {
        // alert("وقت النهاية غير صحيح");
        end.value = "";
        return;
    }

    if (start.value && toMinutes(end.value) <= toMinutes(start.value)) {
        // alert("وقت النهاية يجب أن يكون بعد البداية");
        end.value = "";
        end.focus();
    }
});

// دالة جلب البيانات
function getTimeData() {
    const startValue = start.value;
    const endValue = end.value;

    if (!isValidTime(startValue) || !isValidTime(endValue)) {
        return null;
    }

    const startMin = toMinutes(startValue);
    const endMin = toMinutes(endValue);

    if (endMin <= startMin) {
        return null;
    }

    return {
        start: startValue,
        end: endValue,
        startMinutes: startMin,
        endMinutes: endMin,
        duration: endMin - startMin // مدة الحصة
    };
    /* الناتج
        {
            start: "08:00",
            end: "09:30",
            startMinutes: 480,
            endMinutes: 570,
            duration: 90
        }
    */
}










/* ===== Lecture-Madule-Class ===== */
// انشاء دالة لجلب البيانات
function getLectureData() {
    const type = document.getElementById("lectureType").value.trim();
    const module = document.getElementById("module").value.trim();
    const className = document.getElementById("class").value.trim();
    /*  trim() → دالة لحذف الفرغات في البداية و النهاية ان وجدت
        "   Math   ".trim()     → "Math"
        "Data   Science".trim() → "Data   Science"

        بدونها → " Math" !== "Math"
    */

    // منع الإدخال الفارغ أو الذي يحتوي فقط على فراغات
    if (!type || !module || !className) {
        // alert("Please fill all fields correctly");
        return null;
    }
    
    return {
        type: type, 
        module: module,
        className: className
    };
    /* الناتج
        {
            type: TD, 
            module: BDD,
            className: 209
        }
    */
}













/* ===== Back-Add-Finish ===== */
const backBtn = document.getElementById("backBtn");
const addBtn = document.getElementById("addBtn");
const finishBtn = document.getElementById("finishBtn");

let schedule = [];
backBtn.addEventListener("click", () => {    
    

    if (schedule.length == 0 ) {

        alert("You Cann't go back");
    
    } else {

        let backlecture = schedule.pop(); // حذف آخر عنصر بشكل صحيح

        // إعادة تفعيل اليوم
        days.forEach(checkDay => {  

            checkDay.classList.remove("active");
            if (checkDay.dataset.select == backlecture.day) {
                checkDay.classList.add("active");
            }
        });

        // إعادة القيم
        document.getElementById("start").value = backlecture.start;
        document.getElementById("end").value = backlecture.end;

        document.getElementById("lectureType").value = backlecture.type;
        document.getElementById("module").value = backlecture.module;
        document.getElementById("class").value = backlecture.className;

        alert("You Back !!");
        console.log(schedule);
        
    }
});

addBtn.addEventListener("click", () => {

    if (!getDayData() || !getTimeData() || !getLectureData()) {

        alert("Some Inputs is Empty !!");

    } else {

        let newLecture = {
            day: getDayData().day,

            start: getTimeData().start,
            end: getTimeData().end,
            startMinutes: getTimeData().startMinutes,
            endMinutes: getTimeData().endMinutes,
            duration: getTimeData().duration,

            type: getLectureData().type,
            module: getLectureData().module,
            className: getLectureData().className
        };

        // console.log(newLecture);

        schedule.push(newLecture); // save in array 
        console.log(schedule); // للتجربة


        // clear the inputs
        days.forEach(clearDay => clearDay.classList.remove("active"));

        document.getElementById("start").value = "";
        document.getElementById("end").value = "";

        document.getElementById("lectureType").value = "";
        document.getElementById("module").value = "";
        document.getElementById("class").value = "";

        // Show
        alert("Added");
    }
    
    
});

finishBtn.addEventListener("click", () => {

    if (!getDayData() && !getTimeData() && !getLectureData()) {

        // Save in the browser
        let oldSchedule = loadSchedule() || [];  // if schedule = []
        if (schedule.length > 0) {

            oldSchedule.push(...schedule); // دمج البيانات            clearSchedule();
            saveSchedule(oldSchedule);
            schedule = [];

            alert("We Save Your schedule in Local Storage");
        
        } 
        oldSchedule = [];

        
        initTimerPage();  // Load page timer.js
        showTimerPage();  // ui.js

    } else if (!getDayData() || !getTimeData() || !getLectureData()) {

        alert("Some Inputs is Empty !!");
    
    } else { // if (getDayData() && getTimeData() && getLectureData()) 
    
        alert("Click Add First");
    
    }

});




