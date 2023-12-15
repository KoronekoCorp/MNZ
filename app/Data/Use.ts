import { API } from "./Ciweimao";
import { unstable_cache } from "next/cache";

export async function UseAPI() {
    const a = new API()
    var r = await unstable_cache(async () => a.auto_reg(),
        ["auto_reg_v2"], { revalidate: 86400, tags: ["auto_reg_v2"] })()
    try {
        a.account = r.data.reader_info.account
        a.login_token = r.data.login_token
    } catch { }
    return a
}