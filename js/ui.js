const pages = {
    begin: document.getElementById("begin"),
    timer: document.getElementById("timer"),
    setting: document.getElementById("setting"),
    calander: document.getElementById("calander"),
    university: document.getElementById("university"),
};


function hideAllPages() {
    Object.values(pages).forEach(page => {
        page.classList.remove("active");
    });
}

export function showBeginPage() {
    hideAllPages();
    pages.begin.classList.add("active");
}

export function showTimerPage() {
    hideAllPages();
    pages.timer.classList.add("active");
}

export function showSettingPage() {
    hideAllPages();
    pages.setting.classList.add("active");
}

export function showCalanderPage() {
    hideAllPages();
    pages.calander.classList.add("active");
}

export function showUnivPage() {
    hideAllPages();
    pages.university.classList.add("active");
}

