import { cookies } from "next/headers";
import { DDB, PDB } from "./Database";

const filess = new DDB({
    host: process.env.DB_HOST_U,
    user: process.env.DB_USER_U,
    password: process.env.DB_SECRET_U,
    database: process.env.DB_DB_U,
    charset: process.env.DB_CHARSET_U,
    port: parseInt(process.env.DB_POOT_U ?? "3306"),
    connectTimeout: 2000,
    connectionLimit: 10,
    queueLimit: 10,
})

const newest = new DDB({
    host: process.env.DB_HOST_New,
    user: process.env.DB_USER_New,
    password: process.env.DB_SECRET_New,
    database: process.env.DB_DB_New,
    charset: process.env.DB_CHARSET_New,
    port: parseInt(process.env.DB_POOT_New ?? "3306"),
    connectTimeout: 2000,
    connectionLimit: 10,
    queueLimit: 10,
})

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
    const c = cookies()
    const t = c.get("db")?.value ?? "stable"
    console.log(t)
    switch (t) {
        case "filess": return [filess, "filess"]
        case "stable": return [stable, "stable"]
        case "newest": return [newest, "newest"]
        case "a": return [a, "newest"]
        default: return [newest, "newest"]
    }
}