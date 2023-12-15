//此文件并未使用
import { BooKid, Userchap, UserchapUser, UserchapCount, UserchapInfo, Chaper, Shchap, Sh, UploadChap } from './DataType'
import { Chaper as chaper } from './CiweiType';
// import { cache } from 'react';
import { base64DecToArr, strToUTF8Arr, UTF8ArrToStr, base64EncArr } from './Base64'
import { get_key } from './telegra';
// export const revalidate = 3600

class DB {
    RemoteProxy: string
    constructor(url: string) {
        this.RemoteProxy = url
    }

    async fetch(url: string) {
        return fetch(url, {
            next: {
                revalidate: 3600
            }
        })
    }

    async userchap(page: number, perPage: number = 20): Promise<Userchap[]> {
        const r = await this.fetch(`${this.RemoteProxy}/userchap/${page}`)
        return await r.json() as Userchap[]
    }

    /**
     * @deprecated 已弃用
     * @param bookid 
     * @returns 
     */
    async bookid(bookid: number | string): Promise<BooKid[]> {
        const r = await this.fetch(`${this.RemoteProxy}/bookid/${bookid}`)
        return await r.json() as BooKid[]
    }

    async UserchapUsers(): Promise<UserchapUser[]> {
        const r = await this.fetch(`${this.RemoteProxy}/UserchapUsers`)
        return await r.json() as UserchapUser[]
    }

    async UserchapCount(): Promise<UserchapCount[]> {
        const r = await this.fetch(`${this.RemoteProxy}/UserchapCount`)
        return await r.json() as UserchapCount[]
    }

    async UserchapInfo(bookid: number | string): Promise<UserchapInfo[]> {
        const r = await this.fetch(`${this.RemoteProxy}/UserchapInfo/${bookid}`)
        return await r.json() as UserchapInfo[]
    }

    async Bookchaps(bookid: number | string): Promise<Chaper[]> {
        const r = await this.fetch(`${this.RemoteProxy}/Bookchaps/${bookid}`)
        return await r.json() as Chaper[]
    }

    async isChapterPurchased(chapid: number | string): Promise<boolean> {
        const r = await this.fetch(`${this.RemoteProxy}/isChapterPurchased/${chapid}`)
        return await r.text() == "true"
    }

    async shchap(chapid: number | string): Promise<Shchap[]> {
        const r = await this.fetch(`${this.RemoteProxy}/sh_chap/${chapid}`)
        return await r.json() as Shchap[]
    }

    async Shchap(chapid: number | string): Promise<Sh | null> {
        // const r = await this.fetch(`${this.RemoteProxy}/Shchap/${chapid}`)
        // return await r.json() as Sh
        const raw = await this.shchap(chapid)
        if (raw.length == 0) { return null }
        let url
        let txt_content
        if (raw[0].host === 'i') {
            url = `https://${raw[0].spath}.ipfs.nftstorage.link/`;
        } else {
            url = `https://api.telegra.ph/getPage/${raw[0].spath}?return_content=true`;
        }
        const req = await fetch(url)
        const t = await req.text()
        if (raw[0].host === 'i') {
            txt_content = atob(t);
        } else {
            const j = JSON.parse(t);
            txt_content = UTF8ArrToStr(base64DecToArr(j.result.content[0].children[0])).trim();
        }
        return {
            txt: txt_content,
            ...raw[0]
        }
    }

    async uploadchap(chaper: chaper, shareUser: string) {
        const key = get_key()
        const data = base64EncArr(strToUTF8Arr(chaper.data.chapter_info.txt_content))
        const r = await fetch('https://api.telegra.ph/createPage', {
            method: 'POST',
            body: new URLSearchParams({
                "access_token": key,
                "title": chaper.data.chapter_info.chapter_id,
                "author_name": shareUser,
                "content": `[{ "tag": "p", "children": ["${data}"] }]`,
                'return_content': "false"
            }),
            next: {
                revalidate: 3600
            }
        })
        return await r.json() as UploadChap
    }

    async addChap(UploadChap: UploadChap, chap: chaper, shareUser: string) {
        return await fetch(`${this.RemoteProxy}/addChap/`, {
            method: "POST",
            body: JSON.stringify({
                UploadChap: UploadChap,
                chap: chap,
                shareUser: shareUser
            })
        })
    }
}

const db = new DB(process.env.DB_PROXY)


export { db }
