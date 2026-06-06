import { showTimerPage} from './js/ui.js';
import {initTimerPage, StopTimerPage} from './js/pages/timer.js';
import {setThemeLogo} from './js/storage.js'


function isAppInstalled() {

    const nativeMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.matchMedia('(display-mode: fullscreen)').matches ||
        window.navigator.standalone === true;

    const userFlag = localStorage.getItem("app-installed") === "true";

    return nativeMode || userFlag;
}



window.addEventListener("appinstalled", () => {
    localStorage.setItem("app-installed", "true");
});



function startApp() {

    StopTimerPage();
    showTimerPage();
    initTimerPage();

    
    // Install / Link logic
    const installIcon = document.querySelector(".install");
    const linkIcon = document.querySelector(".link");

    if (isAppInstalled()) {
        installIcon.style.display = "none";
        linkIcon.style.display = "block";
    } else {
        installIcon.style.display = "block";
        linkIcon.style.display = "none";
    }


    // Themes + Logos
    
    const theme_logo = JSON.parse(localStorage.getItem("themes-logos"));

    if (!theme_logo) {
        const defaultThemes = [
            {
                primary: "#00c8ff",
                secondary: "#3450B4",
                logoUni: "assets/logos/USTHB.jpg"
            },
            {
                primary: "#5bff5d",
                secondary: "#1b6d1f",
                logoUni: "assets/logos/ALGER2.jpg"
            }
        ];

        localStorage.setItem("themes-logos", JSON.stringify(defaultThemes));
    }

    setThemeLogo();
}







// this for service-worker
if (navigator.serviceWorker) {
    navigator.serviceWorker.register('./service-worker.js').then((reg) => {

        console.log("file is Register");
    
    }).catch((err) => {

        console.log("ERROR", err);

    });
}



startApp();