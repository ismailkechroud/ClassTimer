// ==========================
// Schedule Storage + ColorBackground Storage
// ==========================


// جلب البيانات
export function loadSchedule() {
  return JSON.parse(localStorage.getItem("schedule")) || [];
}

// حفظ البيانات
export function saveSchedule(data) {
  localStorage.setItem("schedule", JSON.stringify(data));
}

// حذف البيانات
export function clearSchedule() {
  localStorage.removeItem("schedule");
}





export function setThemeLogo() {
  
  const theme_logo = JSON.parse(localStorage.getItem("themes-logos"));

  if (theme_logo && theme_logo.length > 0) {
    const first_index = theme_logo[0];

    document.documentElement.style.setProperty(
      "--primary",
      first_index.primary
    );

    document.documentElement.style.setProperty(
      "--scondary",
      first_index.secondary
    );

    const logo = document.querySelector(".univ");
    if (logo) {
      logo.src = first_index.logoUni;
    }
  }
}


export function changeOrder(primary) {

  let theme_logo = JSON.parse(localStorage.getItem("themes-logos"));

  if (!theme_logo) return;

  const index = theme_logo.findIndex((element) => element.primary === primary);

  if (index === -1 || index === 0) return;

  // swap with first element
  [theme_logo[0], theme_logo[index]] = [theme_logo[index], theme_logo[0]];

  localStorage.setItem("themes-logos", JSON.stringify(theme_logo));

  // إعادة تطبيق 
  setThemeLogo();
}



