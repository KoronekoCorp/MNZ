"use client"
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "./loading";

export default function R({ url }: { url: string }) {
    const router = useRouter()
    useEffect(() => {
        router.push(url)
    }, [])
    return <Loading />
}

export function Back({ time }: { time: number }) {
    const router = useRouter()
    useEffect(() => {
        const id = setTimeout(router.back, time)
        return () => clearTimeout(id)
    }, [])
    return <></>
}

/**
 * 预加载
 * @param url 预加载地址列
 * @param time 延迟时间 
 * @returns 
 */
export function Prefetch({ url, time }: { url: string[], time: number }) {
    const router = useRouter()
    const Pre = () => {
        url.forEach((e) => {
            // console.log(`预加载${e}`)
            router.prefetch(e)
        })
    }
    useEffect(() => {
        const id = setTimeout(Pre, time)
        return () => { clearTimeout(id) }
    }, [])
    return <></>
}

/**
 * 滚动到目标元素的位置
 * @param index 唯一ID
 * @param id 滚动到的元素ID 
 * @returns 
 */
export function S({ index, id }: { index: string, id: string }) {
    useEffect(() => {
        document.getElementById(id)?.scrollIntoView({
            behavior: 'smooth', // 可以设置为 'auto' 或 'smooth'，'smooth' 会有平滑滚动效果
            block: 'start',    // 滚动到目标元素的位置，可以设置为 'start'、'center'、'end'、'nearest'
            inline: 'nearest'
        })
    }, [index])

    return <></>
}