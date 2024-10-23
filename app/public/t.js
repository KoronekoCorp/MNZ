(function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "jqrxytckjz");


/**
     * 检查Build版本，清空缓存
     */
async function check() {
    const r = await (await fetch("/api/version")).json()
    if (localStorage.getItem("buildid") !== r.buildid) {
        const keys = await caches.keys()
        await Promise.all(keys.map(i => caches.delete(i)))
        localStorage.setItem("buildid", r.buildid)
    }
}
check()

/**
     * 检查SW更新
     */
async function update() {
    const r = await navigator.serviceWorker.getRegistrations()
    return Promise.all(r.map(i => i.update()))
}

if (localStorage.getItem("noSw") !== "true") {
    navigator.serviceWorker.register("/sw.js", { 'scope': '/' })
}

update()

fetch("https://zapi.elysia.rip/auth/check", { credentials: "include" })