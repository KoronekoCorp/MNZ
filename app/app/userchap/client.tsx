"use client"
import { ImgCard } from "@/components/ImgCard"
import type { bookinfo } from "@/Data/CiweiType"
import type { Userchap } from "@/Data/DataType"
import Battery2BarIcon from '@mui/icons-material/Battery2Bar'
import Battery5BarIcon from '@mui/icons-material/Battery5Bar'
import BatteryFullIcon from '@mui/icons-material/BatteryFull'
import { Button, FormControlLabel, Stack, Switch, TextField, Typography } from "@mui/material"
import Grid from '@mui/material/GridLegacy'
import Cookies from "js-cookie"
import Link from "next/link"
import { enqueueSnackbar } from "notistack"
import { useEffect, useState } from "react"

export default function Fix() {
    const [username, setuser] = useState("Anonymous")
    const [state, setState] = useState([false, false, false])
    const cookies = ["auto_share_chapter_vip", "auto_use_chapter_vip", "auto_goumai"]
    useEffect(() => {
        const s = state.slice()
        cookies.forEach((e, i) => {
            s[i] = Cookies.get(e) == "on"
        })
        setState(s)
        setuser(Cookies.get("shareUser") ?? "Anonymous")
    }, [])

    const change = (i: number) => {
        const l = state.slice()
        l[i] = !l[i]
        let s = "off"
        if (l[i]) { s = "on" }
        Cookies.set(cookies[i], s, { expires: 300 })
        setState(l)
    }

    return <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid item sm="auto">
            <TextField label="章节分享人名" value={username} onChange={(e) => {
                //@ts-ignore
                setuser(e.target.value); Cookies.set("shareUser", e.target.value, { expires: 300 })
                enqueueSnackbar("已自动保存", { variant: "info" })
            }} />
        </Grid>
        <Grid item sm="auto">
            <FormControlLabel control={<Switch checked={state[0]} onChange={(e) => change(0)} />} label="自动分享章节vip" labelPlacement="start" />
        </Grid>
        <Grid item sm="auto">
            <FormControlLabel control={<Switch checked={state[1]} onChange={(e) => change(1)} />} label="自动使用章节vip" labelPlacement="start" />
        </Grid>
        <Grid item sm="auto">
            <FormControlLabel control={<Switch checked={state[2]} onChange={(e) => change(2)} color="error" />} label="自动购买章节vip" labelPlacement="start" />
        </Grid>
    </Grid>

}

export function BookSingle({ book, req }: { book: Userchap, req: bookinfo }) {
    const [r, setr] = useState(req)

    const bookinfo = () => {
        fetch(`https://zapi.elysia.rip/cwm/book/get_info_by_id?book_id=${book.book_id}`)
            .then((res) => res.json())
            .then((r) => setr(r as bookinfo))
            .catch(() => bookinfo())
    }

    useEffect(() => {
        if (r.data.book_info.book_name === "刺猬猫请求失败") {
            bookinfo()
        }
    }, [book.book_id])

    if (r.code != "100000") {
        r.data = {
            //@ts-ignore 修复书籍不存在的问题
            "book_info": {
                "book_name": "书籍不存在",
                "cover": "https://cos.elysia.rip/off.gif",
                "author_name": "书籍不存在",
            }
        }
    }
    return <ImgCard
        url={`/book/${book.book_id}`}
        img={{ url: r.data.book_info.cover, alt: r.data.book_info.book_name }}
        cardActions={<Button LinkComponent={Link} href={`/search/${r.data.book_info.author_name}`}>
            {r.data.book_info.author_name}
        </Button>}
    >
        <Typography gutterBottom variant="subtitle2" component="h6">
            {r.data.book_info.book_name}
        </Typography>
        <Stack direction="row" justifyContent="center" sx={{ "& > svg": { color: "#6C00FF" } }}>
            {`${book.chapters} | `}
            {book.modes.includes("vip") && <BatteryFullIcon />}
            {book.modes.includes("marauder") && <Battery5BarIcon />}
            {book.modes.includes("post") && <Battery2BarIcon />}
        </Stack>
    </ImgCard>
}