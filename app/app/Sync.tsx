"use client"
import type { Chaper } from "@/Data/CiweiType"
import { get, set } from "@/Data/Storge.Server"
import { useEffect } from "react"
import { createHash } from "crypto"

interface data {
    'book_mark': { [key: string]: any },
    'booklist_mark': { [key: string]: any }
    history: { [key: string]: any }
    [key: string]: { [key: string]: any }
}

interface book_mark {
    "name": string
    "id": string
    "cover": string
}

export default function Sync() {
    const getDataLocal = () => {
        const data: data = { 'book_mark': {}, 'booklist_mark': {}, history: {} }
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            if (key && ['book_mark', 'booklist_mark'].includes(key)) {
                const r = JSON.parse(localStorage.getItem(key) ?? "") as book_mark[]
                r.forEach((d) => {
                    data[key][d.id] = d
                })
            } else if (key?.startsWith("1")) {
                const r = JSON.parse(localStorage.getItem(key) ?? "") as Chaper
                data.history[r.data.chapter_info.book_id] = r
            }
        }
        return data
    }

    const hash = (str: string) => {
        const hash = createHash('sha256')
        hash.update(JSON.stringify(str))
        return hash.digest('hex')
    }

    const sync = () => {
        const SyncKey = localStorage.getItem("SyncKey")
        if (SyncKey) {
            get(`${SyncKey}_info`).then((e) => {
                const Remote = JSON.parse(e == "" ? `{"t": 0,"hash": ""}` : e) as { 't': number, 'hash': string }
                const lastSynctime = parseInt(localStorage.getItem("lastSynctime") ?? "0")
                if (Remote.t > lastSynctime) {
                    //拉取云端更新
                    get(`${SyncKey}_DATA`).then((e) => {
                        const r = JSON.parse(e) as data
                        ['book_mark', 'booklist_mark'].forEach((i) => {
                            const pre = r[i]
                            const fin: Chaper[] = []
                            Object.keys(pre).forEach((j) => {
                                fin.push(pre[j])
                            })
                            localStorage.setItem(i, JSON.stringify(fin))
                        })
                        Object.keys(r.history).forEach((e) => {
                            localStorage.setItem(e, JSON.stringify(r.history[e]))
                        })
                        localStorage.setItem("lastSynctime", Remote.t.toString())
                    })
                } else {
                    //推送至云端
                    const d = JSON.stringify(getDataLocal())
                    const h = hash(d)
                    if (Remote.hash != h) {
                        const Synctime = new Date().getTime()
                        set(`${SyncKey}_DATA`, d)
                        set(`${SyncKey}_info`, JSON.stringify({ 't': Synctime, 'hash': h }))
                        localStorage.setItem("lastSynctime", Synctime.toString())
                    }
                }
            })
        } else {
            // uuid().then((e) => localStorage.setItem("SyncKey", e))
        }
    }

    /**
     * 检查Build版本，清空缓存
     */
    async function check() {
        const r: { buildid: string } = await (await fetch("/api/version")).json()
        if (localStorage.getItem("buildid") !== r.buildid) {
            const keys = await caches.keys()
            await Promise.all(keys.map(i => caches.delete(i)))
            localStorage.setItem("buildid", r.buildid)
        }
    }

    /**
     * 检查SW更新
     */
    async function update() {
        const r = await navigator.serviceWorker.getRegistrations()
        return Promise.all(r.map(i => i.update()))
    }

    useEffect(() => {
        sync()
        update()
        check()
        const id = setInterval(() => sync(), 60000)
        return () => { clearInterval(id) }
    }, [])

    return <></>
}