import { unstable_cache } from "next/cache";
import { API } from "./Ciweimao";
import { cookies } from "next/headers";

export async function UseAPI() {
    const cookie = cookies()
    const a = new API(cookie.get("ci_login_token")?.value, cookie.get("ci_account")?.value)
    const r = await unstable_cache(async () => a.auto_reg(),
        ["auto_reg_v2"], { revalidate: 86400, tags: ["auto_reg_v2"] })()
    try {
        a.account = r.data.reader_info.account
        a.login_token = r.data.login_token
    } catch { }
    console.log(a.account, a.login_token)
    return a
}