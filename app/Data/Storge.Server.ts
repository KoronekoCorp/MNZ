"use server"
import { randomUUID } from "crypto"
import { UseRedis } from "@/Security/Redis"

const get = async (key: string) => {
    const r = await UseRedis()
    return await r.get(key) ?? ""
}
const set = async (key: string, data: string) => {
    const r = await UseRedis()
    return r.setEx(key, 172800, data)
}

const uuid = async () => randomUUID()
export { get, set, uuid }