"use client"
import { useEffect, useState, BaseSyntheticEvent, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Modal, Backdrop, Fade, Box, List, CircularProgress, ListItem } from '@mui/material'

/**
 * 模态
 * @param index 序列号，唯一
 * @returns 
 */
export default function ModalS({ children, index }: { children: JSX.Element[] | JSX.Element, index: string }) {
    const [open, setOpen] = useState(true)
    const router = useRouter()
    useEffect(() => {
        setOpen(true)
    }, [index])


    if (index == null) { return <></> }

    return (
        <Modal open={open}
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            onClose={() => { setOpen(false); setTimeout(router.push, 500, document.location.origin + document.location.pathname) }}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
            <Fade in={open}>
                <Box sx={{
                    position: 'absolute' as 'absolute',
                    top: '55%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80%',
                    height: '75%',
                    color: "text.primary",
                    bgcolor: 'background.paper',
                    // border: '2px solid #000',
                    boxShadow: 24,
                    borderRadius: '20px',
                    p: 4,
                    zIndex: 10000
                }}>
                    {children}
                </Box>
            </Fade>
        </Modal>)
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
        var observer = new IntersectionObserver((entries) => {
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
        '& ul': { padding: 10 },
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