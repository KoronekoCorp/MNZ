"use server"
import { randomUUID } from 'crypto'
import { headers } from 'next/headers'
import { UseRedis } from './Redis'
import { CacheEveryThing } from '@/cache'
import cf from './cloudflare'
import { encode } from '@/Data/JWE'


const prefix = "V4."

/**
 * 生成唯一安全校验UUID
 * @param chapid 
 * @returns 
 */
async function Pre(chapid: string) {
    if (!process.env.SECURITY_REDIS_host || !process.env.SECURITY_REDIS_port || !process.env.SECURITY_REDIS_password) {
        console.warn("Security Redis not configured, skipping security checks.")
        return undefined
    }

    const ip = (await headers()).get("cf-connecting-ip") ?? (await headers()).get("x-forwarded-for")
    if (ip) {
        const redis = await UseRedis()
        const uuid = randomUUID()
        const d = await redis.sendCommand(["FCALL", "SecurityV4_count", "0", ip, uuid]) as "ok" | "challenge" | "ban"
        console.log(ip, d)
        switch (d) {
            case "ban":
                await CacheEveryThing(() => cf.postWAF(ip, "block"), [`CF-postWAF-${ip}-block`], 3600 * 24 * 365)()
                break
            case "challenge":
                await CacheEveryThing(() => cf.postWAF(ip, "challenge"), [`CF-postWAF-${ip}-challenge`], 3600 * 24 * 365)()
                break
            case 'ok':
                break
        }
        return encode({ token: { ip: ip, uuid: uuid } })
    }
}

/**
 * 为购买页特别设计的安全逻辑
 * @returns 
 */
async function buy(chapid: string) {
    const ip = (await headers()).get("cf-connecting-ip") ?? (await headers()).get("x-forwarded-for")
    if (ip) {
        const redis = await UseRedis()
        const d = await redis.json.GET(prefix + ip, { path: ".uuid" }) as string | null
        if (d) {
            return encode({ token: { ip: ip, uuid: d } })
        }
    }
}

/** 
 * 客户端上报安全接口
 * @deprecated
 */
async function check(uuid: string, chapid: string) {
    const ip = (await headers()).get("cf-connecting-ip") ?? (await headers()).get("x-forwarded-for")
    if (ip) {
        const redis = await UseRedis()
        const d = await redis.sendCommand(["TFCALL", "SecurityV2.success", "0", ip, uuid])
        console.log(d)
        return ip
    }
}


/** 
 * 查询是否为黑名单IP
 * @deprecated
 */
async function Baned(): Promise<[true, number] | [false, undefined]> {
    const ip = (await headers()).get("cf-connecting-ip") ?? (await headers()).get("x-forwarded-for")
    const redis = await UseRedis()
    if (ip) {
        return CacheEveryThing(async (): Promise<[true, number] | [false, undefined]> => {
            try {
                const ban = await redis.json.get(prefix + ip, { path: ".ban" }) as number
                const now = (Date.now() / 1000) | 0
                if (ban >= now) {
                    return [true, ban]
                }
                return [false, undefined]
            } catch { return [false, undefined] }
        }, [`s_chap_baned_${ip}`], 60, (e) => !e[0])()
    }
    return [false, undefined]
}

export { Pre, buy } 