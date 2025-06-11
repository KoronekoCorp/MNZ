import hkdf from "@panva/hkdf"
import { randomUUID } from "crypto"
import { EncryptJWT, jwtDecrypt } from "jose"
import { cookies } from "next/headers"

async function encode({ token = {}, secret = process.env.secrets, exp, maxAge = 3600 * 24 * 30 }: { token: any, secret?: string, exp?: number, maxAge?: number }) {
    // console.log("[encode]")
    // console.log({ token, secret, maxAge })
    const encryptionSecret = await getDerivedEncryptionKey(secret)
    const t = await new EncryptJWT(token)
        .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
        .setIssuedAt()
        .setExpirationTime(exp ?? (now() + maxAge))
        .setJti(randomUUID())
        .encrypt(encryptionSecret)
    // console.log(t)
    return t
}

async function decode<T>({ token, secret = process.env.secrets }: { token?: string, secret?: string }) {
    // console.log("[decode]")
    // console.log({ token, secret })
    if (!token) return undefined
    const encryptionSecret = await getDerivedEncryptionKey(secret)
    const { payload } = await jwtDecrypt<T>(token, encryptionSecret, {
        clockTolerance: 15,
    })
    // console.log(payload)
    return payload
}


const now = () => (Date.now() / 1000) | 0

async function getDerivedEncryptionKey(secret: string) {
    return hkdf(
        "sha256",
        secret,
        "",
        "Generated Encryption Key",
        32
    )
}


export async function GetOauth<T>() {
    const cookie = (await cookies()).get("oauth")
    if (!cookie) {
        return
    }
    try {
        return await decode<T>({ token: cookie.value })
    } catch {
        return
    }
}

export { decode, encode }