"use client"

import { enqueueSnackbar } from "notistack"
import { useEffect, useState } from "react"
import type { AnnouncementData } from "./Type"
import { Announcement } from "."

const prefix = "Announcement."

export function AnnouncementProvider({ endpoint }: { endpoint: string }) {
    const [ann, setann] = useState<AnnouncementData[]>([])

    useEffect(() => {
        console.log("?")
        fetch(new URL(`${endpoint}/api/${location.hostname}`))
            .then(r => r.json().then((f: AnnouncementData[]) => {
                setann(f);
                const all = f.map(i => i.key)
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i)
                    if (key && key.startsWith(prefix) && !all.includes(key.replace(prefix, ""))) {
                        localStorage.removeItem(key)
                    }
                }
            }))
            .catch(() => {
                enqueueSnackbar("公告信息获取失败，页面将在5秒后刷新", { variant: "error" })
                setTimeout(() => {
                    location.href = location.href
                }, 5000);
            })
    }, [])

    return <>
        {ann.length !== 0 && <Announcement data={ann[0]} onClose={() => {
            setann(ann.slice(1))
        }} />}
    </>
}