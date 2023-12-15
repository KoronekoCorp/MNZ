"use server"
import { randomUUID } from "crypto"
import { Un } from "./Storge"

const get = (key: string) => Un.get(key)
const set = (key: string, data: string) => Un.set(key, data)

const uuid = async () => randomUUID()
export { get, set, uuid }