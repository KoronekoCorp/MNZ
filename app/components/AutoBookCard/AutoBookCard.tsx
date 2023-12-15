"use client"

import { Button, Stack, Typography } from "@mui/material"
import { BookCard } from "../BookCard"
import Link from "next/link"
import { useEffect, useState } from "react"
import type { UserchapInfo } from "@/Data/DataType"
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import Battery5BarIcon from '@mui/icons-material/Battery5Bar';
import Battery2BarIcon from '@mui/icons-material/Battery2Bar';
import { bookChap } from "./server"

export function AutoBookCard({ book, userchap, free, error }:
    {
        book: { book_id: string, cover: string, author_name: string, book_name: string }, userchap?: UserchapInfo[],
        free?: boolean, error?: boolean
    }) {

    const [Userchap, setUserchap] = useState(userchap)
    useEffect(() => {
        if (error) bookChap(book.book_id).then(e => setUserchap(e))
    }, [book.book_id, error])
    const icons: (JSX.Element | string)[] = []
    if (free) icons.push(<span className='console-line'>FREE</span>)
    else if (error) icons.push(<span className="console-error">数据库错误</span>)
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

    return <BookCard
        url={`/book/${book.book_id}`}
        img={{ url: book.cover }}
        cardActions={<Button LinkComponent={Link} href={`/search/${book.author_name}`}>
            {book.author_name}
        </Button>}>
        <Typography gutterBottom variant="subtitle2" component="h6">
            {book.book_name}
        </Typography>
        <Stack direction="row" justifyContent="center" sx={{ "& > svg": { color: "#6C00FF" } }}>
            {icons}
        </Stack>
    </BookCard>
}