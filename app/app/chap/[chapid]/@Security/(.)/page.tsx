// import { Pre } from "@/Security/Chap.server"
// import { ChapSecurityClient } from "@/Security/Chap.client"

export default async function Sec({ params: { chapid }, searchParams }:
    { params: { chapid: string }, searchParams: { [key: string]: string | undefined } }) {

    if (searchParams.tsukkomis) {
        return null
    }
    return null
    // const uuid = await Pre(chapid)
    // return uuid ? <ChapSecurityClient uuid={uuid} chapid={chapid} /> : <></>
}