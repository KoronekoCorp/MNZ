import { unstable_cache } from "next/cache";
import { API } from "./Ciweimao";
import { cookies } from "next/headers";
// import { redirect } from "next/navigation";

export async function UseAPI() {
    const cookie = cookies()
    const ci_login_token = cookie.get("ci_login_token")?.value
    const ci_account = cookie.get("ci_account")?.value
    const UserAgent = cookie.get("ci_useragent")?.value
    const endpoint = cookie.get("cwm_mirror")?.value
    const official_endpoint = ["https://app.happybooker.cn", "https://app.hbooker.com", "https://sk.hbooker.com"].includes(endpoint ?? "")
    if (ci_login_token && ci_account && endpoint && official_endpoint === false) {
        return new API({
            login_token: ci_login_token,
            account: ci_account,
            UserAgent: UserAgent,
            endpoint: endpoint
        })
    } else {
        // redirect("/login")

        const a = new API({ endpoint: endpoint })
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