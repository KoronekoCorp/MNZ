import * as crypto from 'crypto';
import { eapi, weapi } from "./cry";
import { CacheEveryThing } from '@/cache';
import { Error, Info, SongUrl, lyric as Lyric } from './NeteaseType';

const ID_XOR_KEY_1 = Buffer.from('3go8&$833h0k(2)2')

function cloudmusic_dll_encode_id(some_id: string) {
    const xored = Buffer.from(
        [...some_id].map(
            (c, idx) => c.charCodeAt(0) ^ ID_XOR_KEY_1[idx % ID_XOR_KEY_1.length],
        ),
    )
    const digest = crypto.createHash('md5').update(xored).digest()
    return digest.toString('base64')
}

async function Register() {
    const cry_data = new URLSearchParams(weapi({
        username: Buffer.from(`NMUSIC ${cloudmusic_dll_encode_id("NMUSIC")}`).toString('base64')
    })).toString()

    const r = await fetch(
        "https://music.163.com/weapi/register/anonimous",
        {
            method: "POST",
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/13.10586",
                "Content-Type": "application/x-www-form-urlencoded",
                "Referer": "https://music.163.com"
            },
            body: cry_data
        }
    )
    const c = r.headers.getSetCookie().map((i) => i.split(";")[0])
    const cd: { [key: string]: string } = {}
    for (let i in c) {
        const [k, v] = c[i].split("=")
        cd[k] = v
    }
    return cd
}

const Reg_c = () => CacheEveryThing(() => Register(), [`musicRegister`], 86400)()


async function SongInfo(ids: number[]) {
    const cookie = await Reg_c()
    const c = Object.keys(cookie)
        .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(cookie[key]))
        .join('; ')
    const cry_data = new URLSearchParams(weapi({ c: '[' + ids.map((id) => '{"id":' + id + '}').join(',') + ']', })).toString()
    const r = await fetch(
        "https://music.163.com/weapi/v3/song/detail",
        {
            method: "POST",
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/13.10586",
                "Content-Type": "application/x-www-form-urlencoded",
                "Referer": "https://music.163.com",
                "Cookie": c
            },
            body: cry_data
        }
    )
    return r.json() as Promise<Info>
}

async function SongURL(id: number) {
    const cookie = await Reg_c()
    const ncookie: { [k: string]: string } = {
        osver: cookie.osver, //系统版本
        deviceId: cookie.deviceId, //encrypt.base64.encode(imei + '\t02:00:00:00:00:00\t5106025eb79a5247\t70ffbaac7')
        appver: cookie.appver || '8.9.70', // app版本
        versioncode: cookie.versioncode || '140', //版本号
        mobilename: cookie.mobilename, //设备model
        buildver: cookie.buildver || Date.now().toString().substr(0, 10),
        resolution: cookie.resolution || '1920x1080', //设备分辨率
        os: cookie.os || 'android',
        channel: cookie.channel,
        requestId: `${Date.now()}_${Math.floor(Math.random() * 1000)
            .toString()
            .padStart(4, '0')}`,
        ...cookie
    }

    const c = Object.keys(ncookie)
        .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(ncookie[key]))
        .join('; ')
    const cry_data = new URLSearchParams(eapi('/api/song/enhance/player/url', { ids: `["${id}"]`, br: 999000 })).toString()
    const r = await fetch(
        "https://interface3.music.163.com/eapi/song/enhance/player/url",
        {
            method: "POST",
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/13.10586",
                "Content-Type": "application/x-www-form-urlencoded",
                "Referer": "https://music.163.com",
                "Cookie": c
            },
            body: cry_data
        }
    )
    return r.json() as Promise<SongUrl | Error>
}


async function lyric(id: number) {
    const cookie = await Reg_c()
    const c = Object.keys(cookie)
        .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(cookie[key]))
        .join('; ')
    const cry_data = new URLSearchParams({
        id: id.toString(),
        tv: "-1",
        lv: "-1",
        rv: "-1",
        kv: "-1",
    }).toString()
    const r = await fetch(
        "https://music.163.com/api/song/lyric?_nmclfl=1",
        {
            method: "POST",
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/13.10586",
                "Content-Type": "application/x-www-form-urlencoded",
                "Referer": "https://music.163.com",
                "Cookie": c
            },
            body: cry_data
        }
    )
    return r.json() as Promise<Lyric>
}

// /**
//  * 
//  * @see https://docs.neteasecloudmusicapi.binaryify.com/#/?id=%e8%8e%b7%e5%8f%96%e6%ad%8c%e5%8d%95%e8%af%a6%e6%83%85
//  * @param id 
//  * @param limit 
//  * @param offset 
//  * @returns 
//  */
// async function playlist(id: number) {
//     const cookie = await Reg_c()
//     const c = Object.keys(cookie)
//         .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(cookie[key]))
//         .join('; ')

//     const cry_data1 = new URLSearchParams({
//         id: id.toString(),
//         n: "100000",
//         s: "8",
//     }).toString()
//     const r = await fetch(
//         "https://music.163.com/api/v6/playlist/detail",
//         {
//             method: "POST",
//             headers: {
//                 "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/13.10586",
//                 "Content-Type": "application/x-www-form-urlencoded",
//                 "Referer": "https://music.163.com",
//                 "Cookie": c
//             },
//             body: cry_data1
//         }
//     )
//     return await r.json() as Promise<Playlist>
// }

// async function playlist_songs(d1: Playlist, limit: number = Infinity, offset: number = 0) {
//     const cookie = await Reg_c()
//     const c = Object.keys(cookie)
//         .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(cookie[key]))
//         .join('; ')
//     const trackIds = d1.playlist.trackIds
//     let idsData = {
//         c:
//             '[' +
//             trackIds
//                 .slice(offset, offset + limit)
//                 .map((item) => '{"id":' + item.id + '}')
//                 .join(',') +
//             ']',
//     }
//     const cry_d2 = new URLSearchParams(weapi(idsData)).toString()
//     const r2 = await fetch(
//         "https://music.163.com/weapi/v3/song/detail",
//         {
//             method: "POST",
//             headers: {
//                 "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/13.10586",
//                 "Content-Type": "application/x-www-form-urlencoded",
//                 "Referer": "https://music.163.com",
//                 "Cookie": c
//             },
//             body: cry_d2
//         }
//     )
//     return r2.json() as Promise<Info | Error>
// }

const SongInfo_c = (id: number) => CacheEveryThing(() => SongInfo([id]), [`Music_SongInfo_${id}`], 86400, (r) => r.code !== 200)()
const SongURL_c = (id: number) => CacheEveryThing(() => SongURL(id), [`Music_SongURL_${id}`], 600, (r) => r.code !== 200)()
const lyric_c = (id: number) => CacheEveryThing(() => lyric(id), [`Music_lyric_${id}`], 2592000, (r) => r.code !== 200)()
// const playlist_c = (id: number) => CacheEveryThing(() => playlist(id), [`Music_playlist_${id}`], 86400, (r) => r.code !== 200)()


export { SongInfo_c as SongInfo, SongURL_c as SongURL, lyric_c as lyric }