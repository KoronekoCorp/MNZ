"use server"

import { API } from "@/Data/Ciweimao"

export async function geetest() {
    const a = new API()
    return a.geetest()
}

export async function login(phone: string, password: string) {
    const a = new API()
    return a.login(phone, password)
}