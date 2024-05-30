"use client"
import { CacheCleanButton } from "@/components/CacheCleaner"
import { type Chaper } from "@/Data/CiweiType"
import BookmarkIcon from '@mui/icons-material/Bookmark'
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary'
import { Button } from "@mui/material"
import Link from "next/link"
import { enqueueSnackbar } from "notistack"
import { useEffect, useState } from "react"

interface book_mark {
    "name": string
    "id": string
    "cover": string
}

declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
        Miscellaneous: true;
    }
}

export function ClientButton({ book_name, book_id, book_cover }:
    { book_name: string, book_id: string, book_cover: string }) {
    const [history, sethistory] = useState<Chaper>()
    useEffect(() => {
        const d = localStorage.getItem(book_id)
        if (d) {
            try {
                sethistory(JSON.parse(d) as Chaper)
            } catch { }
        }
    }, [book_id])

    const bookmark = () => {
        let book_mark: book_mark[] = [];
        book_mark = JSON.parse(localStorage.getItem("book_mark") ?? "[]");

        if (!book_mark.find(item => item.id === book_id)) {
            book_mark.push({ name: book_name, id: book_id, cover: book_cover });
            localStorage.setItem("book_mark", JSON.stringify(book_mark))
        }
        enqueueSnackbar("添加完成~", { 'variant': 'success' })
    }

    return <>
        <Button onClick={bookmark} variant="contained" startIcon={<BookmarkIcon />}>
            放入书架
        </Button>
        {history && <><br />
            <Button LinkComponent={Link} variant="contained" startIcon={<LocalLibraryIcon />} color="Miscellaneous"
                href={`/chap/${history.data.chapter_info.chapter_id}`}>
                继续阅读
            </Button>
        </>}
        <br />
        <CacheCleanButton container={"#book"} />
        <br />
        <div id="book" style={{ display: "none" }}></div>
    </>
}