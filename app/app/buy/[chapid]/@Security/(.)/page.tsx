import { buy } from "@/Security/Chap.server"
import { ChapSecurityClient } from "@/Security/Chap.client"

export default async function Sec({ params: { chapid }, searchParams }:
    { params: { chapid: string }, searchParams: { [key: string]: string | undefined } }) {

    if (searchParams.tsukkomis) {
        return null
    }
    const uuid = await buy(chapid)
    return uuid ? <ChapSecurityClient uuid={uuid} chapid={chapid} /> : <></>
}