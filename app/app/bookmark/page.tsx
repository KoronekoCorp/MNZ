'use client'
import { H2 } from '@/components/H2'
import { ImgCard } from '@/components/ImgCard'
import { Chaper } from '@/Data/CiweiType'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import { Button, Container, Grid, IconButton, Tooltip, Typography } from '@mui/material'
import Link from 'next/link'
import { closeSnackbar, enqueueSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { convertTimestamp } from './convertTimestamp'

interface book_mark {
    "name": string
    "id": string
    "cover": string
}

export default function Bookmark() {
    const [bookmark, setbookmark] = useState<book_mark[]>([])
    const [booklist, setbooklist] = useState<book_mark[]>([])

    useEffect(() => {
        setbookmark(JSON.parse(localStorage.getItem("book_mark") ?? "[]"))
        setbooklist(JSON.parse(localStorage.getItem("booklist_mark") ?? "[]"))
    }, [])

    const delBookmarks = (b: book_mark) => {
        const bm = bookmark.filter((d) => {
            if (d.id != b.id) { return d }
        })
        setbookmark(bm)
        localStorage.setItem("book_mark", JSON.stringify(bm))
        enqueueSnackbar(`已删除${b.name}`, {
            action: (id) => <Button variant='contained' onClick={() => { recoverbm(b); closeSnackbar(id) }} color='primary'>撤销</Button>,
            autoHideDuration: 5000, variant: "error"
        })
    }

    const recoverbm = (b: book_mark) => {
        let bm = bookmark.slice()
        if (!bookmark.find(item => item.id == b.id)) {
            bm.push(b)
        }
        setbookmark(bm)
        localStorage.setItem("book_mark", JSON.stringify(bm))
        enqueueSnackbar('已恢复', { variant: "success" })
    }

    const delBooklist = (b: book_mark) => {
        const bm = booklist.filter((d) => {
            if (d.id != b.id) { return d }
        })
        setbooklist(bm)
        localStorage.setItem("booklist_mark", JSON.stringify(bm))
        enqueueSnackbar(`已删除${b.name}`, {
            action: (id) => <Button variant='contained' onClick={() => { recoverbl(b); closeSnackbar(id) }} color='primary'>撤销</Button>,
            autoHideDuration: 5000, variant: "error"
        })
    }

    const recoverbl = (b: book_mark) => {
        let bm = booklist.slice()
        if (!booklist.find(item => item.id == b.id)) {
            bm.push(b)
        }
        setbooklist(bm)
        localStorage.setItem("booklist_mark", JSON.stringify(bm))
        enqueueSnackbar('已恢复', { variant: "success" })
    }

    const output = (out: any, key: string) => {
        let link = document.createElement('a');
        link.download = `${key}.json`;
        let blob = new Blob([JSON.stringify(out)], { type: 'text/json' });
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
        enqueueSnackbar("已导出", { variant: "success" })
    }

    const input = async (input: (value: any) => void, key: string) => {
        try {//@ts-ignore
            const [file] = await window.showOpenFilePicker({
                types: [
                    {
                        description: "text",
                        accept: {
                            "text/*": [".txt", ".json"],
                        },
                    },
                ],
                excludeAcceptAllOption: true,
                multiple: false,
            })
            const f = await file.getFile()
            const d = await f.text()
            inputtext(d, input, key)
            enqueueSnackbar("已恢复", { variant: "success" })
        } catch {
            //@ts-ignore
            document.querySelector(`#${key}`)?.click();
            enqueueSnackbar("已尝试恢复", { variant: "info" })
        }
    }

    const inputtext = (i: string, input: (value: any) => void, key: string) => {
        input(JSON.parse(i))
        localStorage.setItem(key, i)
    }

    const History = ({ id }: { id: string }) => {
        const d = JSON.parse(localStorage.getItem(id) ?? `{"error":"true"}`) as Chaper | { error: true }
        return <>
            {d.error == undefined &&
                <Tooltip title={convertTimestamp(parseInt(d.data.chapter_info.txt_content))}>
                    <Button LinkComponent={Link} href={`/chap/${d.data.chapter_info.chapter_id}`}
                        startIcon={<LocalLibraryIcon />}>
                        {d.data.chapter_info.chapter_title.split("#")[0]}
                    </Button>
                </Tooltip>
            }
        </>
    }


    return <Container sx={{ textAlign: 'center' }}>
        <title>书架</title>
        <H2>
            <MenuBookIcon />小说<b>(<span id="total_book">{bookmark.length}</span>)</b>
        </H2>
        <Grid container spacing={2} sx={{ p: 1 }} alignItems="center" justifyContent="center">
            {bookmark.map(b => <Grid item xs={6} md={3} key={b.id}>
                <ImgCard
                    url={`/book/${b.id}`}
                    img={{ url: b.cover }}
                    cardActions={<>
                        <History id={b.id} />
                        <IconButton onClick={() => { delBookmarks(b) }}>
                            <DeleteForeverIcon color='error' />
                        </IconButton>
                    </>}>
                    <Typography gutterBottom variant="subtitle2" component="h6">
                        {b.name}
                    </Typography>
                </ImgCard>
            </Grid>)}
        </Grid>


        <H2>
            <MenuBookIcon />书单<b>(<span id="total_book">{booklist.length}</span>)</b>
        </H2>
        <Grid container spacing={2} sx={{ p: 1 }} alignItems="center" justifyContent="center">
            {booklist.map((b) => <Grid item xs={6} md={3} key={b.id}>
                <ImgCard
                    url={`/booklists/${b.id}`}
                    img={{ url: b.cover }}
                    cardActions={<>
                        <IconButton onClick={() => { delBooklist(b) }}>
                            <DeleteForeverIcon color='error' />
                        </IconButton>
                    </>}>
                    <Typography gutterBottom variant="subtitle2" component="h6">
                        {b.name}
                    </Typography>
                </ImgCard>
            </Grid>)}
        </Grid>
        <H2>
            <SettingsBackupRestoreIcon />备份与还原
        </H2>
        <Grid container spacing={2} sx={{ p: 1, "button": { m: 2 } }} alignItems="center" justifyContent="center" color="text.primary">
            <Grid item xs={12}>
                注意此处的书架未链接到 Ciweimao 中的书架，因为并非此站点上的每个人都登录到 Ciweimao。
                <H2 sx={{ backgroundColor: "error.main", color: "error.contrastText" }}>
                    <WarningAmberIcon />
                    如果导入了错误的备份会导致应用崩溃
                </H2>
            </Grid>
            <Grid item xs={6}>
                <h3>小说</h3>
                <Button variant='contained' onClick={() => output(bookmark, "bookmarks")} startIcon={<CloudDownloadIcon />}>备份</Button>
                <Button variant='contained' onClick={() => input(setbookmark, "book_mark")} startIcon={<CloudUploadIcon />}>还原</Button>
            </Grid>
            <Grid item xs={6}>
                <h3>书单</h3>
                <Button variant='contained' onClick={() => output(booklist, "booklists")} startIcon={<CloudDownloadIcon />}>备份</Button>
                <Button variant='contained' onClick={() => input(setbooklist, "booklist_mark")} startIcon={<CloudUploadIcon />}>还原</Button>
            </Grid>
        </Grid>
        <input type="file" style={{ display: "none" }} id="book_mark" accept=".json"
            onInput={(e) => {
                //@ts-ignore
                e.target.files[0].text().then((t) => {
                    inputtext(t, setbookmark, "book_mark")
                })
            }} />
        <input type="file" style={{ display: "none" }} id="booklist_mark" accept=".json"
            onInput={(e) => {
                //@ts-ignore
                e.target.files[0].text().then((t) => {
                    inputtext(t, setbooklist, "booklist_mark")
                })
            }} />
    </Container>
}