import { revalidateTag, unstable_cache } from "next/cache"
import { UseRedis } from "@/Security/Redis"

class MemoryStorge {
    data: {
        [key: string]: string | undefined
    }
    constructor() {
        this.data = {}
    }

    async get(key: string) {
        return this.data[key] ?? ""
    }

    async set(key: string, data: string) {
        this.data[key] = data
    }
}

class UnstableStorge {
    constructor() {

    }

    async get(key: string) {
        return await this.cache(key, "")
    }

    async set(key: string, data: string) {
        revalidateTag(`UnstableStorge_${key}`)
        return await this.cache(key, data)
    }
    async cache(key: string, data: string) {
        return await unstable_cache(async () => data,
            [`UnstableStorge_${key}`], { revalidate: 2592000, tags: [`UnstableStorge_${key}`] })()
    }
}

class RedisStorge {
    constructor() {

    }

    async get(key: string) {
        const redis = await UseRedis()
        return await redis.get(key) ?? ""
    }

    async set(key: string, data: string) {
        const redis = await UseRedis()
        return await redis.setEx(key, 172800, data)
    }
}

const Un = new RedisStorge()
console.log("cache")

export { MemoryStorge, UnstableStorge, Un }