import { API } from "./Ciweimao";
import { unstable_cache } from "next/cache";

export async function UseAPI() {
    const a = new API("", "")
    const r = await unstable_cache(async () => a.auto_reg(),
        ["auto_reg_v2"], { revalidate: 86400, tags: ["auto_reg_v2"] })()
    try {
        a.account = r.data.reader_info.account
        a.login_token = r.data.login_token
    } catch {
        a.account = "3ac833a7ee4fdce2706006375cd8a438"
        a.login_token = "书客3203542"
    }
    return a
}