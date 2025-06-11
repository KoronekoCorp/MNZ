import { buy } from "@/Security/Chap.server"
import { ChapSecurityClient } from "@/Security/Chap.client"

export default async function Sec(
    props:
        { params: Promise<{ chapid: string }>, searchParams: Promise<{ [key: string]: string | undefined }> }
) {
    const searchParams = await props.searchParams;
    const params = await props.params;

    const {
        chapid
    } = params;

    if (searchParams.tsukkomis) {
        return null
    }
    const uuid = await buy(chapid)
    return uuid ? <ChapSecurityClient uuid={uuid} chapid={chapid} /> : <></>
}