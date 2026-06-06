
const cacheName = "ClassTimer-cache-V1";

const BASE = self.location.pathname.replace('/service-worker.js', '').replace(/\/$/, '');

const assets = [
    `${BASE}/`,
    `${BASE}/index.html`,

    `${BASE}/assets/icons/Home.svg`,
    `${BASE}/assets/icons/Calander.svg`,
    `${BASE}/assets/icons/Settings.svg`,
    `${BASE}/assets/icons/delete.svg`,
    `${BASE}/assets/icons/Install.svg`,
    `${BASE}/assets/icons/Link.svg`,
    `${BASE}/assets/icons/addschedule.svg`,

    `${BASE}/assets/logos/USTHB.jpg`,
    `${BASE}/assets/logos/ALGER2.jpg`,

    `${BASE}/assets/stickers/finishlecture.gif`,
    `${BASE}/assets/stickers/freetime.gif`,
    `${BASE}/assets/stickers/itsover.gif`,
    `${BASE}/assets/stickers/lunchtime.gif`,
    `${BASE}/assets/stickers/weekend.gif`,
    

    `${BASE}/fonts/ComicSansMS.ttf`,

    `${BASE}/style.css`,
    `${BASE}/style/begin.css`,
    `${BASE}/style/timer.css`,
    `${BASE}/style/setting.css`,
    `${BASE}/style/university.css`,
    `${BASE}/style/calander.css`,

    `${BASE}/app.js`,
    `${BASE}/js/storage.js`,
    `${BASE}/js/ui.js`,
    `${BASE}/js/pages/begin.js`,
    `${BASE}/js/pages/timer.js`,
    `${BASE}/js/pages/setting.js`,
    `${BASE}/js/pages/university.js`,
    `${BASE}/js/pages/calander.js`,

    `${BASE}/manifest.json`,
    
    `${BASE}/AppIcons/icons/32.png`,
    `${BASE}/AppIcons/icons/48.png`,
    `${BASE}/AppIcons/icons/58.png`,
    `${BASE}/AppIcons/icons/72.png`,
    `${BASE}/AppIcons/icons/92.png`,
    `${BASE}/AppIcons/icons/128.png`,
    `${BASE}/AppIcons/icons/152.png`,
    `${BASE}/AppIcons/icons/172.png`,
    `${BASE}/AppIcons/icons/196.png`,
    `${BASE}/AppIcons/icons/256.png`,
    `${BASE}/AppIcons/icons/512.png`,
    `${BASE}/AppIcons/icons/1024.png`,
    `${BASE}/AppIcons/icons/favtab.png`
];


self.addEventListener('install', (installEvent) => {

    installEvent.waitUntil(
        
        caches.open(cacheName).then(async (cache) => {
            for (const asset of assets) {
                try {
                    await cache.add(asset);
                } catch (err) {
                    console.error("❌ Failed to cache:", asset, err);
                }
            }
        })
    )
    
    
    // console.log("service-worker is installed !!", installEvent);
});

self.addEventListener('activate', (activateEvent) => {

    activateEvent.waitUntil(

        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key != cacheName)
                .map((key) => caches.delete(key))
            )
        })

    )


    // console.log("service-worker is activated !", activateEvent);
});

self.addEventListener('fetch', (fetchEvent) => {

    fetchEvent.respondWith(

        caches.match(fetchEvent.request).then((res) => {
            return res || fetch(fetchEvent.request);
        })

    )
    
    
    // console.log("service-worker is fetched !", fetchEvent);
});

