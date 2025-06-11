"use server"

import { headers } from "next/headers"
const allowlist = ["localhost:3000", "nextjs.nhimmeo.ovh", "mnz.koroneko.co"]

export async function Host() {
    const host = (await headers()).get("host") ?? ""
    return !allowlist.includes(host)
}