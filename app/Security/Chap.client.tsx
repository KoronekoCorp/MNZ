"use client"
import { useEffect } from "react"

export function ChapSecurityClient({ uuid, chapid }: { uuid: string, chapid: string }) {
    useEffect(() => {
        const id = setTimeout(() => {
            fetch(`https://zapi.elysia.rip/SecV4/${uuid}`)
        }, 10000);
        return () => clearTimeout(id)
    }, [uuid])
    return <></>
}