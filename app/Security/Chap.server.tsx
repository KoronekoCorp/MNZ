"use server"
import { randomUUID } from 'crypto'
import { headers } from 'next/headers'
import { UseRedis } from './Redis'
import { unstable_cache } from 'next/cache'

/**
 * 生成唯一安全校验UUID
 * @param chapid 
 * @returns 
 */
async function Pre(chapid: string) {
    const ip = headers().get("x-forwarded-for")
    if (ip) {
        return await unstable_cache(async () => {
            const redis = await UseRedis()
            const uuid = randomUUID()
            try {
                await redis.json.set(ip, '.uuid', uuid)
            } catch {
                await redis.json.set(ip, ".", {})
                await redis.json.set(ip, '.uuid', uuid)
            }
            try {
                await redis.json.numIncrBy(ip, '.all', 1)
            } catch {
                await redis.json.set(ip, '.all', 1)
            }
            redis.EXPIRE(ip, 43200)
            analysis(ip)
            return uuid
        }, [`s_chap_Pre_${ip}_${chapid}`], { revalidate: 3600 })()
    }
}

/** 客户端上报安全接口 */
async function check(uuid: string, chapid: string) {
    const ip = headers().get("x-forwarded-for")
    if (ip) {
        return await unstable_cache(async () => {
            const redis = await UseRedis()
            const inuuid = await redis.json.get(ip, { path: ".uuid" })
            if (uuid == inuuid) {
                try {
                    await redis.json.numIncrBy(ip, '.success', 1)
                } catch {
                    await redis.json.set(ip, '.success', 1)
                }
            }
            redis.EXPIRE(ip, 43200)
            return ""
        }, [`s_chap_check_${ip}_${chapid}`], { revalidate: 3600 })()

    }
}

/** 分析是否需要禁止IP */
async function analysis(ip: string) {
    const redis = await UseRedis()
    const success = await redis.json.get(ip, { path: ".success" }) as number
    const all = await redis.json.get(ip, { path: ".all" }) as number
    if (all >= 50 && success < all / 10) {
        await redis.json.set(ip, ".all", 0)
        await redis.json.set(ip, ".success", 0)
        await redis.json.set(ip, ".ban", new Date().getTime() / 1000 + 43200)
    }
}

/** 查询是否为黑名单IP */
async function Baned(): Promise<[boolean, JSX.Element | undefined]> {
    const ip = headers().get("x-forwarded-for")
    const redis = await UseRedis()
    if (ip) {
        return await unstable_cache(async () => {
            try {
                const ban = await redis.json.get(ip, { path: ".ban" }) as number
                const now = new Date().getTime() / 1000
                if (ban >= now) {
                    return [true, <div className="card fluid center" style={{ backgroundColor: "rgb(255 180 180)" }}>
                        <h3>
                            <i className="fa fa-warning" aria-hidden="true" />{" "}
                            IP {ip}已被封禁，请勿频繁访问招致二次封禁
                        </h3>
                        <h3>剩余封禁时间{Math.floor((ban - now) / 3600)}小时</h3>
                    </div>]
                }
            } catch { return [false, undefined] }
        }, [`s_chap_baned_${ip}`], { revalidate: 60 })() as [boolean, JSX.Element | undefined]
    }
    return [false, undefined]
}

export { Pre, check, Baned } 