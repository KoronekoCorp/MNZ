"use client"

import type { UserchapInfo } from "@/Data/DataType"
import Battery2BarIcon from '@mui/icons-material/Battery2Bar'
import Battery5BarIcon from '@mui/icons-material/Battery5Bar'
import BatteryFullIcon from '@mui/icons-material/BatteryFull'
import { Button, Stack, Typography } from "@mui/material"
import Link from "next/link"
import { enqueueSnackbar } from "notistack"
import { useEffect, useState } from "react"
import { ImgCard } from "../ImgCard"

export function AutoBookCard({ book, userchap, free, error }:
    {
        book: { book_id: string, cover: string, author_name?: string, book_name: string }, userchap?: UserchapInfo[],
        free?: boolean, error?: boolean
    }) {

    const [Userchap, setUserchap] = useState(userchap)
    useEffect(() => {
        if (error) fetch(`https://capi.koroneko.co/UserchapInfo/${book.book_id}`, { referrer: "about:client", referrerPolicy: "origin" })
            .then(e => e.json())
            .then(e => setUserchap(e))
            .catch(() => { enqueueSnackbar(`${book.book_id}数据库重连失败`, { variant: "error" }) })
    }, [book.book_id])

    const icons: (JSX.Element | string)[] = []
    if (free) icons.push(<span className='console-line'>FREE</span>)
    else if (Userchap && Userchap[0].chapters) {
        icons.push(`${Userchap[0].chapters} | `)
        if (Userchap[0].modes?.includes('vip')) {
            icons.push(<BatteryFullIcon />);
        }
        if (Userchap[0].modes?.includes('marauder')) {
            icons.push(<Battery5BarIcon />);
        }
        if (Userchap[0].modes?.includes('post')) {
            icons.push(<Battery2BarIcon />);
        }
    }
    else if (error && Userchap === undefined) icons.push(<span className="console-error">数据库错误</span>)

    return <ImgCard
        url={`/book/${book.book_id}`}
        img={{ url: book.cover }}
        cardActions={book.author_name === undefined ? undefined : <Button LinkComponent={Link} href={`/search/${book.author_name}`}>
            {book.author_name}
        </Button>}>
        <Typography gutterBottom variant="subtitle2" component="h6">
            {book.book_name}
        </Typography>
        <Stack direction="row" justifyContent="center" sx={{ "& > svg": { color: "#6C00FF" } }}>
            {icons}
        </Stack>
    </ImgCard>
}