"use client"
import { useEffect } from "react"
import { check } from './Chap.server'

export function ChapSecurityClient({ uuid, chapid }: { uuid: string, chapid: string }) {
    useEffect(() => {
        const id = setTimeout(() => {
            check(uuid, chapid)
        }, 10000);
        return () => clearTimeout(id)
    }, [uuid])
    return <></>
}