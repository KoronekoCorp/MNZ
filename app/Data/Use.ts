import { unstable_cache } from "next/cache";
import { API } from "./Ciweimao";
import { cookies } from "next/headers";
// import { redirect } from "next/navigation";

export async function UseAPI() {
    const cookie = cookies()
    const ci_login_token = cookie.get("ci_login_token")?.value
    const ci_account = cookie.get("ci_account")?.value
    if (ci_login_token && ci_account) {
        return new API(ci_login_token, ci_account, cookie.get("cwm_mirror")?.value)
    } else {
        // redirect("/login")

        const a = new API(undefined, undefined, cookie.get("cwm_mirror")?.value)
        const r = await unstable_cache(async () => a.auto_reg(),
            ["auto_reg_v2"], { revalidate: 86400, tags: ["auto_reg_v2"] })()
        try {
            a.account = r.data.reader_info.account
            a.login_token = r.data.login_token
        } catch { }
        console.log(a.account, a.login_token)
        return a
    }
}