'use client'
import { H2 } from "@/components/H2"
import { ImgCard } from "@/components/ImgCard"
import { bookinfo, Chaper } from "@/Data/CiweiType"
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import HistoryIcon from '@mui/icons-material/History'
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary'
import { Button, Container, Grid, IconButton, Tooltip, Typography } from "@mui/material"
import Link from "next/link"
import { closeSnackbar, enqueueSnackbar } from "notistack"
import { useEffect, useState } from "react"
import { convertTimestamp } from '../bookmark/convertTimestamp'
import { BookServer } from "./server"

export default function History() {
    const [H, setH] = useState<Chaper[]>([])
    const [Bookinfo, setBookinfo] = useState<bookinfo[]>([])

    async function book(ids: number[] | string[]) {
        if (location.hostname === "localhost") {
            return Promise.all(ids.map(i => BookServer(i)))
        }
        return Promise.all(ids.map(i => new Promise<bookinfo>((resolve) => {
            fetch(`https://zapi.elysia.rip/cwm/book/get_info_by_id?book_id=${i}`)
                .then((res) => res.json())
                .then((r) => resolve(r as bookinfo))
                //@ts-ignore
                .catch(() => { resolve({ data: { book_info: { cover: "https://cos.elysia.rip/off.gif", book_name: "请求失败" } } }) })

        })))
    }

    useEffect(() => {
        let i = 0
        const _h = []
        const Ids = []
        while (i < localStorage.length) {
            const key = localStorage.key(i)
            if (key?.startsWith("1")) {
                //@ts-ignore
                const r = JSON.parse(localStorage.getItem(key)) as Chaper
                _h.push(r)
                Ids.push(key)
            }
            ++i
        }
        setH(_h)
        book(Ids).then((e) => setBookinfo(e.concat(Bookinfo)))
    }, [])

    function RemoveHis(index: number) {
        const chap = H[index]
        const id = chap.data.chapter_info.book_id
        const msg = Bookinfo.find(i => i.data?.book_info.book_id === id)?.data.book_info.book_name ?? id
        localStorage.removeItem(id)
        // console.log(H)
        setH(H.filter(i => i.data.chapter_info.book_id !== chap.data.chapter_info.book_id))
        enqueueSnackbar(`已删除${msg}的历史记录`, {
            action: (id) => <Button variant='contained' onClick={() => { Recover(chap); closeSnackbar(id) }} color='primary'>撤销</Button>,
            autoHideDuration: 5000, variant: "error"
        })
    }

    function Recover(chap: Chaper) {
        localStorage.setItem(chap.data.chapter_info.book_id, JSON.stringify(chap))
        // const _h = H.slice()
        // if (!_h.find(i => i.data.chapter_info.book_id == chap.data.chapter_info.book_id)) {
        //     _h.push(chap)
        // }
        // setH(_h)
        // console.log(H)
        setH(Array.from(new Set([...H, chap])))
        enqueueSnackbar('已恢复', { variant: "success" })
    }

    const Book = ({ r, index }: { r: Chaper, index: number }) => {
        const b = Bookinfo.find(i => i.data?.book_info.book_id === r.data.chapter_info.book_id) ?? { data: { book_info: { cover: "https://cos.elysia.rip/off.gif", book_name: "加载中" } } }
        const t = convertTimestamp(parseInt(r.data.chapter_info.txt_content))
        return <Grid item xs={6} md={3} key={r.data.chapter_info.book_id}>
            <ImgCard
                url={`/book/${r.data.chapter_info.book_id}`}
                img={{ url: b.data.book_info.cover }}
                cardActions={<>
                    <Tooltip title={t} arrow>
                        <Button LinkComponent={Link} href={`/chap/${r.data.chapter_info.chapter_id}`}
                            startIcon={<LocalLibraryIcon />}>
                            {r.data.chapter_info.chapter_title.split("#")[0]}
                        </Button>
                    </Tooltip>
                    <Typography gutterBottom variant="caption" sx={{ display: { sm: "none", xs: "unset" } }}>
                        {t}
                    </Typography>
                    <IconButton onClick={() => { RemoveHis(index) }}>
                        <DeleteForeverIcon color='error' />
                    </IconButton>
                </>}>
                <Typography gutterBottom variant="subtitle2" component="h6">
                    {b.data.book_info.book_name}
                </Typography>
            </ImgCard>
        </Grid >
    }

    return <Container sx={{ textAlign: 'center' }}>
        <title>历史</title>
        <H2>
            <HistoryIcon />最近读过的小说
        </H2>
        <Grid container spacing={2} sx={{ p: 1 }} alignItems="center" justifyContent="center">
            {H.sort((i, j) => parseInt(j.data.chapter_info.txt_content) - parseInt(i.data.chapter_info.txt_content)).map((r, i) => <Book r={r} index={i} key={r.data.chapter_info.book_id} />)}
        </Grid>
    </Container>
}