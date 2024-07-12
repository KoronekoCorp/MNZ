"use server"

import { UseAPI } from "@/Data/Use"

export async function geetest() {
    const a = await UseAPI()
    return a.geetest()
}

export async function login(phone: string, password: string) {
    const a = await UseAPI()
    return a.login(phone, password)
}

export async function sign() {
    const a = await UseAPI()
    return a.bonus()
}

export async function info() {
    const a = await UseAPI()
    return a.prop_info()
}