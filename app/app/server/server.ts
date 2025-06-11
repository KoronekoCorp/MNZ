"use server"

import { UseAPI } from "@/Data/Use"
import { revalidateTag } from "next/cache"
import { cookies, type UnsafeUnwrappedCookies } from "next/headers";

export interface IP {
    "status": "success",
    "continent": string
    "continentCode": string
    "country": string
    "countryCode": string
    "region": string
    "regionName": string
    "city": string
    "district": string
    "zip": string
    "lat": number
    "lon": number
    "timezone": string
    "offset": number,
    "currency": string
    "isp": string
    "org": string
    "as": string
    "asname": string
    "reverse": string
    "mobile": boolean
    "proxy": boolean
    "hosting": boolean
    "query": string
    [key: string]: string | number | boolean
}

export async function Get_ip() {
    if (process.env.secrets !== undefined && (await cookies()).get("secrets")?.value !== process.env.secrets) {
        return {
            "status": "error",
            "message": "Invalid secret key"
        } as unknown as IP
    }
    return (await fetch("http://ip-api.com/json/?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,offset,currency,isp,org,as,asname,reverse,mobile,proxy,hosting,query")).json() as Promise<IP>
}

export async function Link() {
    const start = Date.now()
    const DATA = new Promise<number>((r) => {
        fetch(`${process.env.DB_PROXY}/userchap/1`)
            .then(() => r(Date.now() - start))
            .catch((e: Error) => { r(e.stack ?? e.message as any) })
    })
    const CWM = new Promise<number>((r) => {
        fetch((cookies() as unknown as UnsafeUnwrappedCookies).get("cwm_mirror")?.value ?? "https://app.hbooker.com", { cache: 'no-cache' })
            .then(() => r(Date.now() - start))
            .catch((e: Error) => { r(e.stack ?? e.message as any) })
    })
    return Promise.all([CWM, DATA])
}

export async function clearReg() {
    if (process.env.secrets !== undefined && (await cookies()).get("secrets")?.value !== process.env.secrets) {
        return null
    }
    revalidateTag("auto_reg_v2")
    return null
}

export async function Reg() {
    if (process.env.secrets !== undefined && (await cookies()).get("secrets")?.value !== process.env.secrets) {
        return ["", ""]
    }
    const a = await UseAPI()
    return [a.account, a.login_token]
}