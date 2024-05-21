"use client"
import { Chaper } from "@/Data/CiweiType"
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { Button } from "@mui/material"
import { enqueueSnackbar } from "notistack"
import { useEffect } from "react"

export function History({ chap }: { chap: Chaper }) {
    const SetHistory = (chap: Chaper) => {
        try {
            localStorage.setItem(chap.data.chapter_info.book_id, JSON.stringify(chap))
            return true
        } catch {
            let min = ""
            let min_t = 9999999999999
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i)
                if (key?.startsWith("1")) {
                    const r = JSON.parse(localStorage.getItem(key) ?? "") as Chaper
                    if (parseInt(r.data.chapter_info.txt_content) < min_t) {
                        min_t = parseInt(r.data.chapter_info.txt_content)
                        min = key
                    }
                }
            }
            localStorage.removeItem(min)
            return false
        }
    }

    useEffect(() => {
        chap.data.chapter_info.author_say = ""
        chap.data.chapter_info.txt_content = Date.now().toString()
        let r = false
        do {
            r = SetHistory(chap)
        } while (!r)
    }, [chap.data.chapter_info.chapter_id])

    return <></>
}

export function ClientButton({ body }: { body: string }) {
    return <Button variant="contained" sx={{ m: 2 }}
        startIcon={<ContentCopyIcon />}
        onClick={(e) => {
            navigator.clipboard.writeText(document.title + "\n" + body)
            enqueueSnackbar("复制成功", { variant: "success" })
        }}>
        复制文字
    </Button>
}