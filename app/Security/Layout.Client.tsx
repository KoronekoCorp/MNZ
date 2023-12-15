"use client"
import { useEffect, useState } from "react"
import { Host } from "./Layout.Server"
import { R } from "@/components/push"

export function Security() {
    const [unsafe, setunsafe] = useState(false)
    const [url, seturl] = useState("")

    useEffect(() => {
        const id = setTimeout(() => setunsafe(true), 10000)
        Host().then((e) => {
            setunsafe(e)
            clearTimeout(id)
        })
        const u = new URL("https://n.koroneko.co")
        u.pathname = document.location.pathname
        seturl(u.href)
    }, [])
    return <>
        {unsafe && <R url={url} />}
    </>
}