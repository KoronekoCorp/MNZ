import { cookies, type UnsafeUnwrappedCookies } from "next/headers";
import { DDB, PDB } from "./Database";


const a = new DDB({
    host: process.env.DB_HOST_1,
    user: process.env.DB_USER_1,
    password: process.env.DB_SECRET_1,
    database: process.env.DB_DB_1,
    charset: process.env.DB_CHARSET_1,
    port: 3306,
    connectTimeout: 2000,
    connectionLimit: 5,
    queueLimit: 10,
})

export const stable = new PDB(process.env.DB_PROXY)

export function UseDB(): [DDB | PDB, string] {
    const c = (cookies() as unknown as UnsafeUnwrappedCookies)
    const t = c.get("db")?.value ?? "stable"
    console.log(t)
    switch (t) {
        case "stable": return [stable, "stable"]
        case "a": return [a, "newest"]
        default: return [stable, "stable"]
    }
}