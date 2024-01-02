"use client"
import { useEffect, useState, type BaseSyntheticEvent, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { List, CircularProgress, ListItem } from '@mui/material'
import { Dig } from '@/components/Modals'

export default function ModalS({ title, children, index }: { title: string, children: JSX.Element[] | JSX.Element, index: string }) {
    if (index == null) { return <></> }

    return <Dig index={index} actions={[]} title={title} sx={{ zIndex: 9999 }}
        closeAction={(r) => {
            const s = new URLSearchParams(location.search)
            s.delete("tsukkomis")
            const keys = Array.from(s.keys())
            let i = 1
            keys.forEach(k => {
                i += parseInt(s.get(k) ?? "1") - 1
            })
            for (let t = 0; t < i; t++) {
                r.back()
            }
        }}>
        {children}
    </Dig>
}

/**
 * 下拉列表
 * @param page 页数
 * @param end 是否为末页
 * @param name 用于获取页数的参数名
 * @param notop 是否为非顶部列表(控制Height)
 * @returns 
 */
export function Roll({ children, page, end, name, notop }:
    { children: JSX.Element[] | JSX.Element, page: number, end: boolean | undefined, name: string, notop?: boolean }) {
    const router = useRouter()
    const [lock, setlock] = useState(false)
    const ref = useRef<HTMLDivElement | null>(null)
    useEffect(() => {
        setlock(false)
        if (!end && notop) {
            return init()
        }
    }, [page, name])

    const Push = () => {
        setlock(true)
        const u = new URL(location.href)
        u.searchParams.set(name, (page + 1).toString())
        router.push(u.href)
    }

    const Scroll = (e: BaseSyntheticEvent) => {
        const r = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight
        if (r < 20 && lock != true && end != true) {
            Push()
        }
    }

    const init = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(item => {
                /*
                 * item.time发生相交到相应的时间，毫秒
                 * item.rootBounds：根元素矩形区域的信息，如果没有设置根元素则返回 null，图中蓝色部分区域。
                 * item.boundingClientRect：目标元素的矩形区域的信息，图中黑色边框的区域。
                 * item.intersectionRect：目标元素与视口（或根元素）的交叉区域的信息，图中蓝色方块和粉红色方块相交的区域。
                 * item.isIntersecting：目标元素与根元素是否相交
                 * item.intersectionRatio：目标元素与视口（或根元素）的相交比例。
                 * item.target：目标元素，图中黑色边框的部分。
                 */
                if (item.isIntersecting) {
                    Push()
                }
            })
        });
        if (ref.current) {
            observer.observe(ref.current)
        }
        return () => observer.disconnect()
    }

    return <List sx={{
        width: '100%',
        position: 'relative',
        overflow: 'auto',
        height: !notop ? '75%' : '100%',
        maxHeight: !notop ? '80%' : '100%',
        borderRadius: '20px',
        color: "text.primary",
        bgcolor: "background.paper",
        '& ul': { padding: 0 },
    }}
        subheader={<li />}
        onScroll={Scroll}
    >
        {children}
        {!end && <ListItem alignItems="flex-start">
            <CircularProgress ref={ref} />
        </ListItem>}
    </List>
}