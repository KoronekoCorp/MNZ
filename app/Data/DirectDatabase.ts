//此文件并未使用
import mysql from 'mysql2/promise';
import { BooKid, Userchap, UserchapUser, UserchapCount, UserchapInfo, Chaper, Shchap, Sh, UploadChap } from './DataType'
import { Chaper as chaper } from './CiweiType';
// import { cache } from 'react';
import { base64DecToArr, strToUTF8Arr, UTF8ArrToStr, base64EncArr } from './Base64'
import { get_key } from './telegra';
// export const revalidate = 3600

class DB {
    connect?: mysql.Connection
    option: mysql.ConnectionOptions
    pool: mysql.Pool
    Timer?: NodeJS.Timeout
    constructor(option: mysql.ConnectionOptions) {
        this.option = option
        this.pool = mysql.createPool({
            connectionLimit: 7,
            queueLimit: 10,
            ...this.option
        })
        console.log("[POOL CREATED]")
    }

    async init() {
        // if (!this.connect) {
        //     this.connect = await this.pool.getConnection()
        //     console.log("[CONNECT GET]")
        // }
    }

    async exec(sql: string, values?: any[]): Promise<mysql.RowDataPacket[]> {
        // await this.init()
        // BUG.md.6
        const [rows, fields] = await this.pool.query(sql, values);
        // await this.prepareForRelease()
        return rows as mysql.RowDataPacket[];
    }

    async releaseConnection() {
        if (this.connect) {
            await this.connect.end(); // 释放数据库连接
            this.connect = undefined; // 将连接设置为 undefined 表示连接已释放
            console.log("[RELEASED]")
        }
    }

    async prepareForRelease() {
        if (this.Timer) { clearTimeout(this.Timer) }
        this.Timer = setTimeout(() => { this.releaseConnection() }, 10000)
    }

    // cache = cache(async (sql: string, values?: any[]) => {
    //     return await this.exec(sql, values);
    // })
    cache = this.exec

    async userchap(page: number, perPage: number = 20): Promise<Userchap[]> {
        const offset = (page - 1) * perPage;
        const r = await this.cache(
            "SELECT sub.book_id, COUNT(DISTINCT sharing.chapter_id) as chapters, GROUP_CONCAT(DISTINCT sharing.mode SEPARATOR ' ') as modes FROM sharing JOIN (SELECT book_id, MAX(stime) as latest_stime FROM sharing GROUP BY book_id ORDER BY latest_stime DESC LIMIT ?, ?) as sub ON sharing.book_id = sub.book_id GROUP BY sub.book_id ORDER BY sub.latest_stime DESC",
            [offset, perPage]
        )
        return r as Userchap[]
    }

    /**
     * @deprecated 已弃用
     * @param bookid 
     * @returns 
     */
    async bookid(bookid: number | string): Promise<BooKid[]> {
        const r = await this.cache(
            "SELECT bookID, bookName, authorName, cover FROM book WHERE bookID=?",
            [bookid]
        )
        return r as BooKid[]
    }

    async UserchapUsers(): Promise<UserchapUser[]> {
        return await this.cache("SELECT author_name, COUNT(author_name) AS count FROM sharing GROUP BY author_name ORDER BY count DESC, author_name ASC") as UserchapUser[]
    }

    async UserchapCount(): Promise<UserchapCount[]> {
        return await this.cache("SELECT COUNT(DISTINCT book_id) FROM sharing") as UserchapCount[]
    }

    async UserchapInfo(bookid: number | string): Promise<UserchapInfo[]> {
        return await this.cache("SELECT COUNT(DISTINCT chapter_id) as chapters, GROUP_CONCAT(DISTINCT mode SEPARATOR ' ') as modes FROM sharing WHERE book_id=?", [bookid]) as UserchapInfo[]
    }

    async Bookchaps(bookid: number | string): Promise<Chaper[]> {
        return await this.cache("SELECT chapter_id, mode FROM sharing WHERE book_id=?", [bookid]) as Chaper[]
    }

    async isChapterPurchased(chapid: number | string): Promise<boolean> {
        const r = await this.cache("SELECT chapter_id FROM sharing WHERE chapter_id=?", [chapid])
        if (r.length > 0) { return true } else { return false }
    }

    async shchap(chapid: number | string): Promise<Shchap[]> {
        return await this.cache("SELECT book_id, chapter_id, author_name, title, stime, spath, host, mode FROM sharing WHERE chapter_id=? ORDER BY CASE mode WHEN 'vip' THEN 1 WHEN 'marauder' THEN 2 WHEN 'post' THEN 3 ELSE 4 END;", [chapid]) as Shchap[]
    }

    async Shchap(chapid: number | string): Promise<Sh | null> {
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
            })
        })
        return await r.json() as UploadChap
    }

    async addChap(UploadChap: UploadChap, chap: chaper, shareUser: string) {
        return await this.cache(
            `INSERT INTO sharing (chapter_index, book_id, chapter_id, title, author_name, stime, spath, mode, host) VALUES (?, ?, ?, ?, ?, ?, ?, 'vip', 't')`,
            [
                chap.data.chapter_info.chapter_index,
                chap.data.chapter_info.book_id,
                chap.data.chapter_info.chapter_id,
                chap.data.chapter_info.chapter_title.split("#")[0],
                shareUser,
                Math.floor(new Date().getTime() / 1000),
                UploadChap.result?.path
            ])
    }
}

export { DB }
