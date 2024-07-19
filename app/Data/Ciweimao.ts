import * as crypto from 'crypto';
import { revalidateTag, unstable_cache } from 'next/cache';
import { join } from 'path';
import type { Buy, Catalog, Chaper, Register, Search, Tags, bookinfo, booklistinfo, booklists, geetest, login, tsukkomi, tsukkomi_info, tsukkomi_reply, tsukkomis } from './CiweiType';

function decrypt(encrypted: string, key: string = 'zG2nSeEfSHfvTCHy5LCcqtBbQehKNLXn'): string {
    try {
        const aesKey = crypto.createHash('sha256').update(key).digest();
        const decipher = crypto.createDecipheriv('aes-256-cbc', aesKey, Buffer.alloc(16, 0));

        const decrypted = decipher.update(encrypted, 'base64', 'utf-8') + decipher.final('utf-8')
        return decrypted
    } catch (error) {
        console.error('Decryption error:', error);
        return JSON.stringify({ "error": "Decryption error" });
    }
}

// function decrypt2(data: string, key = "zG2nSeEfSHfvTCHy5LCcqtBbQehKNLXn") {
//     const aeskey = crypto.createHash('sha256').update(key).digest();
//     const decipher = crypto.createDecipheriv('aes-256-cbc', aeskey, Buffer.alloc(16, 0));
//     let decrypted = decipher.update(data, 'base64', 'utf8');
//     decrypted += decipher.final('utf8');
//     return decrypted;
// }

type params = "app_version" | "device_token" | "login_token" | "account"

/** 刺猬猫签名涉及Key */
const key = "a90f3731745f1c30ee77cb13fc00005a"
const signatures = "CkMxWNB666"

class API {
    BASEURL: string
    app_version = "2.9.328"
    device_token = "ciweimao_"
    UserAgent = `Android  com.kuangxiangciweimao.novel.c  ${this.app_version}, HONOR, TEL-AN10, 29, 10`
    login_token
    account
    constructor(login_token: string = "ed54a385889abfa30a3d3bc1fe76c989", account: string = "书客3547619", endpoint = "https://app.happybooker.cn") {
        this.login_token = login_token
        this.account = account
        this.BASEURL = endpoint
    }

    URL(path: string) {
        const params: params[] = ["app_version", "account", "device_token", "login_token"]
        const url = new URL(join(this.BASEURL, path))
        for (let i in params) {
            url.searchParams.set(params[i], this[params[i]])
        }
        const rand_str = crypto.randomBytes(16).toString("hex")
        const p = crypto.createHmac("sha256", key)
            .update(encodeURI(`account=${this.account}&app_version=${this.app_version}&rand_str=${rand_str}&signatures=${key + signatures}`))
            .digest("base64")
        url.searchParams.set("rand_str", rand_str)
        url.searchParams.set("p", p)
        return url
    }

    async fetch(input: URL | RequestInfo, init?: RequestInit | undefined): Promise<Response> {
        const controller = new AbortController();
        const promise = fetch(input, { ...init, signal: controller.signal })
        const timeout = setTimeout(() => controller.abort(Error("CWM")), 10000);
        return promise.finally(() => clearTimeout(timeout));
    }

    async get(url: URL, tags: string[] | undefined, revalidate: number | false | undefined = 7200) {
        return unstable_cache(async () => {
            const r = await this.fetch(url, {
                headers: {
                    "User-Agent": this.UserAgent,
                    "Accept-Encoding": "gzip"
                },
                // next: {
                //     revalidate: revalidate,
                //     tags: tags
                // },
            })
            return decrypt(await r.text())
        }, tags, { revalidate: revalidate, tags: tags })()
    }

    /**
     * 
     * @param url 
     * @param tags 
     * @param revalidate 应在多少秒后重新验证缓存。false无限期缓存，或者直到调用匹配revalidateTag()或revalidatePath()方法为止。
     * @returns 
     */
    async post(url: URL, tags: string[] | undefined, revalidate: number | false | undefined = 7200) {
        const data = url.search.slice(1)
        return unstable_cache(async () => {
            const r = await this.fetch(url.origin + url.pathname, {
                method: "POST",
                headers: {
                    "user-agent": this.UserAgent,
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Content-Length": data.length.toString(),
                    "Accept-Encoding": "*/*",
                    "charsets": "utf-8"
                },
                body: data,
            })
            return decrypt(await r.text())
        }, tags, { revalidate: revalidate, tags: tags })()
    }

    /**
     * 获取一个游客账户
     * @param mode 请求模式,默认POST
     * @returns 
     */
    async auto_reg(mode: "get" | "post" = "post"): Promise<Register> {
        const u = this.URL(
            `/signup/auto_reg_v2?oauth_union_id=&gender=1&app_version=${this.app_version}&oauth_open_id=&device_token=ciweimao_&channel=Common&oauth_type=&uuid=android${crypto.randomUUID()}`,
        )
        u.searchParams.delete("login_token")
        // u.searchParams.delete("account")
        const r = await this[mode](u, ['auto_reg_v2'], undefined)
        return JSON.parse(r) as Register
    }

    /**
     * 获取是否需要人机验证geetest
     * @param mode 
     * @returns 
     */
    async geetest(mode: "get" | "post" = "post") {
        const u = new URL(`https://app.hbooker.com/signup/use_geetest?app_version=${this.app_version}device_token=ciweimao_`)
        const r = await this[mode](u, [`geetest`], false)
        return JSON.parse(r) as geetest
    }

    /**
     * 使用手机号以及密码进行登录
     * @param phone 
     * @param password 
     * @param mode 
     * @returns 
     */
    async login(phone: string, password: string, mode: "get" | "post" = "post") {
        const u = new URL(`https://app.hbooker.com/signup/login?login_name=${phone}&app_version=${this.app_version}&passwd=${password}&device_token=ciweimao_`)
        const r = await this[mode](u, [`login`, phone], false)
        return JSON.parse(r) as login
    }

    /**
     * 获取书籍信息
     * @param bookid 书籍ID
     * @param mode 请求模式,默认POST
     * @returns bookinfo
     */
    async bookinfo(bookid: number | string, mode: "get" | "post" = "post") {
        const u = this.URL(`/book/get_info_by_id?book_id=${bookid}`)
        const r = await this[mode](u, [`bookinfo_${bookid}`], 86400)
        return JSON.parse(r) as bookinfo
    }

    /**
     * 获取书籍目录
     * @param bookid 书籍ID
     * @param mode 请求模式,默认POST
     * @returns 
     */
    async catalog(bookid: number | string, mode: "get" | "post" = "post"): Promise<Catalog> {
        const u = this.URL(`/chapter/get_updated_chapter_by_division_new?book_id=${bookid}`)
        const r = await this[mode](u, [`catalog_${bookid}`])
        return JSON.parse(r) as Catalog
    }

    /**
     * 获取章节信息
     * @param chapid 章节ID
     * @param mode 请求模式,默认POST
     * @deprecated
     * @returns 
     */
    async chaper(chapid: number | string, mode: "get" | "post" = "post"): Promise<Chaper> {
        const u = this.URL(`/chapter/get_chapter_info?chapter_id=${chapid}`)
        const r = await this[mode](u, [`chaper_${chapid}`], 86400)
        return JSON.parse(r) as Chaper
    }

    async chapter_new(chapid: number | string, mode: "get" | "post" = "post"): Promise<Chaper> {
        const u = this.URL(`/chapter/get_chapter_cmd?chapter_id=${chapid}`)
        const r = JSON.parse(await this[mode](u, [`chaper_${chapid}_cmd`], 86400)) as { "code": "100000", "data": { "command": string }, "scroll_chests": [] }
        if (r.code !== "100000") return r as any
        const u2 = this.URL(`/chapter/get_cpt_ifm?chapter_id=${chapid}&chapter_command=${r.data.command}`)
        const r2 = JSON.parse(await this[mode](u2, [`chaper_${chapid}_ifm`], 86400)) as Chaper
        if (r2.code !== "100000") return r2
        r2.data.chapter_info.txt_content = decrypt(r2.data.chapter_info.txt_content, r.data.command)
        return r2
    }

    /**
     * 获取章节的上下文
     * @param chaperid 章节ID
     * @param book_id 书籍ID
     * @param mode 请求模式,默认POST
     * @returns 
     */
    async find(chaperid: number | string, book_id: number | string, mode: "get" | "post" = "post") {
        const chaps = await this.catalog(book_id, mode)
        const Index = () => {
            for (const chap in chaps.data.chapter_list) {
                const r = chaps.data.chapter_list[chap].chapter_list.findIndex(C => C.chapter_id == chaperid)
                if (r != -1) { return { r, chap } }
            }
            return {}
        }
        const { r, chap } = Index()
        let last
        let newest
        if (r != undefined && chap !== undefined) {
            try {
                last = chaps.data.chapter_list[parseInt(chap)].chapter_list[r - 1].chapter_id
            } catch {
                try {
                    //存在上一卷，但上一卷为空
                    last = chaps.data.chapter_list[parseInt(chap) - 1]?.chapter_list.pop()?.chapter_id
                } catch {

                }
            }
            try {
                newest = chaps.data.chapter_list[parseInt(chap)].chapter_list[r + 1].chapter_id
            } catch {
                try {
                    //存在下一卷，但下一卷为空
                    newest = chaps.data.chapter_list[parseInt(chap) + 1]?.chapter_list[0].chapter_id
                } catch {

                }
            }
        }
        return { last, newest }
    }

    /**
     * 搜索关键词
     * @param word 搜索词
     * @param page 页数
     * @param mode 请求模式,默认POST 
     */
    async search(word: string, page: number = 1, mode: "get" | "post" = "post"): Promise<Search> {
        const u = this.URL(`/bookcity/get_filter_search_book_list?count=10&page=${page - 1}&category_index=0&key=${word}`)
        const r = await this[mode](u, [`search_${word}_${page}`])
        return JSON.parse(r) as Search
    }

    /**
     * 搜索tag
     * @param tag tag
     * @param page 页数
     * @param mode 请求模式,默认POST 
     * @returns 
     */
    async tag(tag: string, page: number = 1, mode: "get" | "post" = "post"): Promise<Tags> {
        const u = this.URL(`/bookcity/get_tag_book_list?type=0&page=${page - 1}&tag=${tag}`)
        const r = await this[mode](u, [`tag_${tag}_${page}`])
        return JSON.parse(r) as Tags
    }

    /**
     * 按排行类型获取书单
     * @param type 类型
     * @param page 页数
     * @param mode 请求模式,默认POST 
     * @returns 
     */
    async booklists(type: "hot" | "new" | "top", page: number = 1, mode: "get" | "post" = "post"): Promise<booklists> {
        const tr = { "hot": 1, "new": 2, "top": 3 }
        const u = this.URL(`/bookcity/get_book_lists?type=${tr[type]}&page=${page - 1}`)
        const r = await this[mode](u, [`booklists_${type}_${page}`], 86400)
        return JSON.parse(r) as booklists
    }

    /**
     * 根据ID获取书单内容
     * @param id 书单ID
     * @param page 页数
     * @param mode 请求模式,默认POST 
     * @returns 
     */
    async booklist(id: string | number, page: number = 1, mode: "get" | "post" = "post"): Promise<booklistinfo> {
        const u = this.URL(`/bookcity/get_booklist_detail?count=20&&recommend=module_list&list_id=${id}&page=${page - 1}`)
        const r = await this[mode](u, [`booklist_${id}_${page}`], 604800)
        return JSON.parse(r) as booklistinfo
    }

    /**
     * 获取书城列表
     * @param order 排序
     * @param count 单页计数
     * @param page 页数
     * @param mode 请求模式,默认POST 
     * @returns 
     */
    async bookcity(order: "newtime" | "uptime" = "newtime", count: string = "100", page: number = 1, mode: "get" | "post" = "post"): Promise<Tags> {
        const u = this.URL(`/bookcity/get_filter_book_list?tab_type=200&count=${count}&page=${page - 1}&order=${order}`)
        const r = await this[mode](u, [`bookcity_${order}_${count}_${page}`], 604800)
        return JSON.parse(r) as Tags
    }

    /**
     * 购买章节
     * @param chapid 章节ID
     * @param mode 请求模式,默认POST 
     * @returns 
     */
    async buy(chapid: string | number, mode: "get" | "post" = "post"): Promise<Buy> {
        const u = this.URL(`/chapter/buy?chapter_id=${chapid}`)
        const r = await this[mode](u, [`Buy_${chapid}_${this.account}_${this.login_token}`], 604800)
        return JSON.parse(r) as Buy
    }

    /**
     * 获取章节间贴列表
     * @param chapid 章节ID
     * @param mode 请求模式,默认POST 
     * @returns 
     */
    async tsukkomi(chapid: string | number, mode: "get" | "post" = "post"): Promise<tsukkomi> {
        const u = this.URL(`/chapter/get_tsukkomi_num?chapter_id=${chapid}`)
        const r = await this[mode](u, [`tsukkomi_${chapid}`], 43200)
        return JSON.parse(r) as tsukkomi
    }

    /**
     * 获取章节间贴列表
     * @param chapid 章节ID
     * @param mode 请求模式,默认POST 
     * @returns 
     */
    async tsukkomis(chapid: string | number, mode: "get" | "post" = "post"): Promise<tsukkomis> {
        const r = await this.tsukkomi(chapid, mode)
        const f: tsukkomis = {}
        r.data.tsukkomi_num_info.forEach((e) => {
            f[e.paragraph_index] = e
        })
        return f
    }

    /**
     * 获取章节某段落的间贴
     * @param chapid 章节ID
     * @param index 段落号
     * @param page 页数
     * @param mode 请求模式,默认POST  
     * @returns 
     */
    async tsukkomiinfo(chapid: string | number, index: string, page: number = 1, mode: "get" | "post" = "post"): Promise<tsukkomi_info> {
        const u = this.URL(`/chapter/get_paragraph_tsukkomi_list_new?count=12&chapter_id=${chapid}&paragraph_index=${index}&page=${page - 1}`)
        const r = await this[mode](u, [`tsukkomiinfo_${chapid}_${index}_${page}`], 43200)
        return JSON.parse(r) as tsukkomi_info
    }

    /**
     * 获取对应间贴ID的回复列表
     * @param index 间贴ID
     * @param page 页数
     * @param mode 请求模式,默认POST  
     * @returns 
     */
    async tsukkomireply(index: string, page: number = 1, mode: "get" | "post" = "post"): Promise<tsukkomi_reply> {
        const u = this.URL(`/chapter/get_paragraph_tsukkomi_reply_list?count=12&page=${page - 1}&tsukkomi_id=${index}`)
        const r = await this[mode](u, [`tsukkomi_reply_${index}_${page}`], 43200)
        return JSON.parse(r) as tsukkomi_reply
    }

    /**
     * 购买并获取购买信息以及章节详细内容
     * @param chapid 
     * @param mode 
     * @returns 
     */
    async buy_and_get_chaper(chapid: string, mode: "get" | "post" = "post"): Promise<[Chaper, Buy?]> {
        // return unstable_cache(async (): Promise<[Chaper, Buy?]> => {
        const pre = await this.chapter_new(chapid, mode)
        if (pre.code !== "100000") return [pre]
        if (pre.data.chapter_info.auth_access == "1") {
            return [pre]
        } else {
            revalidateTag(`chaper_${chapid}_cmd`)
            revalidateTag(`chaper_${chapid}_ifm`)
            const buy = await this.buy(chapid, mode)
            if (buy.tip) {
                return [pre, buy]
            }
            const r = await this.chapter_new(chapid, mode)
            return [r, buy]
        }
        // }, [`buy_and_get_chaper_${chapid}`], { revalidate: 86400, tags: [`buy_and_get_chaper_${chapid}`] })()
    }

    /**
    * 获取排行榜
    * @param order 排序
    * @param time_type 时间类型
    * @param page 页数
    * @param category_index 分类ID
    * @param mode 请求模式,默认POST
    * @returns 
    */
    async rank(order: string, time_type: "week" | "month" | "total", page: number = 1, category_index: number = 0, mode: "get" | "post" = "post") {
        const u = this.URL(`/bookcity/get_rank_book_list?time_type=${time_type}&page=${page - 1}&count=12&category_index=${category_index}&order=${order}`)
        const r = await this[mode](u, [`get_rank_book_list_${order}_${time_type}_${category_index}_${page}`], 86400)
        return JSON.parse(r) as Tags
    }

    /**
     * 签到
     * 
     * 类型大致如此，未补全
     * @param mode 请求模式,默认POST
     */
    async bonus(mode: "get" | "post" = "post") {
        const u = this.URL(`/reader/get_task_bonus_with_sign_recommend?task_type=1`)
        const r = await this[mode](u, [`${this.account}_bonus`], 10)
        return JSON.parse(r) as { "code": "100000", "tip"?: string, "data"?: { "bonus": { "exp": "5", "hlb": "5", "recommend": "6" } } }
    }


    /**
     * 获取剩余代币数量，**类型data中仅存在prop_info**
     * @param mode 请求模式,默认POST
     */
    async prop_info(mode: "get" | "post" = "post") {
        const u = this.URL(`/reader/get_prop_info`)
        const r = await this[mode](u, [`${this.account}_get_prop_info`], 3600)
        return JSON.parse(r) as login
    }
}

export { API };

