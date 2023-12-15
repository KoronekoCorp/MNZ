'use client'
import { Chaper } from '@/Data/CiweiType'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { convertTimestamp } from './convertTimestamp'
import { closeSnackbar, enqueueSnackbar } from 'notistack'
import { Button, Container, Grid, IconButton, Tooltip, Typography } from '@mui/material'
import { H2 } from '@/components/H2'
import { BookCard } from '@/components/BookCard'
import MenuBookIcon from '@mui/icons-material/MenuBook';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';

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
            action: (id) => <Button onClick={() => { recoverbl(b); closeSnackbar(id) }} color='info'>撤销</Button>,
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
        } catch {
            //@ts-ignore
            document.querySelector(`#${key}`)?.click();
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
            {bookmark.map(b => <Grid item xs={6} md={3}>
                <BookCard
                    url={`/book/${b.id}`}
                    img={{ url: b.cover }}
                    cardActions={<>
                        <IconButton onClick={() => { delBookmarks(b) }}>
                            <DeleteForeverIcon color='error' />
                        </IconButton>
                        <History id={b.id} />
                    </>}>
                    <Typography gutterBottom variant="subtitle2" component="h6">
                        {b.name}
                    </Typography>
                </BookCard>
            </Grid>)}
        </Grid>


        <div className="card fluid center div_color_yellow1">
            <h3>
                <i className="fa fa-folder" aria-hidden="true" /> 书单{" "}
                <b>
                    (<span id="total_booklist">{booklist.length}</span>)
                </b>
            </h3>
        </div>
        <div className="row center" id="search_result_booklist">
            {booklist.map((b) => <div className="col-sm-6 col-md-3" key={b.id}>
                <div className="card fluid">
                    <div className="section" id="booklist_${e.id}" style={{ height: 'auto' }}>
                        <Link prefetch={false} href={`/booklists/${b.id}`} title={b.name}>
                            <img style={{ border: "1px ridge black", height: "60%" }} src={b.cover} />
                        </Link>
                        <h5>
                            <Link className="book_title_search" href={`/booklists/${b.id}`} title={b.name}                            >
                                {b.name}
                            </Link>
                        </h5>
                        <p>
                            <button className="secondary" onClick={() => { delBooklist(b) }}>
                                <i className="fa fa-trash-o" aria-hidden="true" />
                            </button>
                        </p>
                    </div>
                </div>
            </div>
            )}
        </div>
        <div className="card fluid center div_color_yellow1">
            <h3>
                <i className="fa fa-hdd-o" aria-hidden="true" /> 备份与还原
            </h3>
        </div>
        <div className="row center">
            <div className="col-sm-12 col-md-12">
                <p>
                    注意此处的书架未链接到 Ciweimao
                    中的书架，因为并非此站点上的每个人都登录到 Ciweimao。
                </p>
            </div>
            <div className="col-sm-12 col-md-6">
                <div className="card fluid">
                    <div className="section dark">
                        <h3>小说</h3>
                        <p>
                            <button className="inverse" onClick={() => output(bookmark, "bookmarks")}>
                                <i className="fa fa-cloud-download" aria-hidden="true" /> 备份
                            </button>
                            |
                            <button className="inverse" onClick={() => { input(setbookmark, "book_mark") }}>
                                <i className="fa fa-cloud-upload" aria-hidden="true" /> 还原
                            </button>
                        </p>
                    </div>
                </div>
            </div>
            <div className="col-sm-12 col-md-6">
                <div className="card fluid">
                    <div className="section dark">
                        <h3>书单</h3>
                        <p>
                            <button className="inverse" onClick={() => { output(booklist, "booklists") }}>
                                <i className="fa fa-cloud-download" aria-hidden="true" /> Backup
                            </button>
                            |
                            <button className="inverse" onClick={() => { input(setbooklist, "booklist_mark") }}>
                                <i className="fa fa-cloud-upload" aria-hidden="true" /> Restore
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div >
        <input type="file" style={{ display: "none" }} id="book_mark" accept=".json"
            onInput={(e) => {
                //@ts-ignore
                e.target.files[0].text().then((t) => {
                    inputtext(t, setbookmark, "book_mark")
                })
            }} />
        <input type="file" style={{ display: "none" }} id="inputfile_booklist" accept=".json"
        />
    </Container>
}