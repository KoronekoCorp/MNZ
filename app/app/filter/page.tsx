"use client"

import type { BookOwn } from "@/Data/CiweiType";
import { AutoBookCard } from "@/components/AutoBookCard/AutoBookCard";
import { H2 } from "@/components/H2";
import { PaginationElementCallBack } from '@/components/Pagination';
import SearchIcon from '@mui/icons-material/Search';
import { Container } from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/GridLegacy';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from 'react';


interface item {
    isTag: boolean
    name: string,
    score: number
}

export default function Page() {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<item[]>([]);
    const [data, setdata] = useState<item[]>([])
    const [defaultTags, setdefault] = useState<item[]>([])
    const [loading, setloading] = useState(false)
    const [books, setbooks] = useState<BookOwn[]>([])
    const [page, setpage] = useState(0)

    useEffect(() => {
        fetch("/api/cwm/book/get_official_tag_list")
            .then(e => e.json())
            .then(e => setdefault(e.data.official_tag_list.map((i: { tag_name: any; }) => { return { isTag: true, name: i.tag_name, score: 10 } })))
    }, [])


    const Getdata = (da: item[] = data): [string | undefined, { filter: "1"; tag: string; }[]] => {
        let key: string | undefined = undefined
        const tags: { "filter": "1", "tag": string }[] = []
        for (const i of da) {
            if (i.isTag) {
                tags.push({ filter: "1", tag: i.name })
            } else {
                key = i.name
            }
        }
        return [key, tags]
    }

    const Search = (p = 0, [key, tags] = Getdata()) => {
        setpage(p)
        if (key === undefined && tags?.length == 0) {
            return enqueueSnackbar("虚空搜索？", { variant: "info" })
        }
        setloading(true)
        fetch(`/api/cwm/bookcity/get_filter_search_book_list?category_index=0&count=10&filter_uptime=&filter_word=${key !== undefined ? key : ""}&is_paid=&key=&order=&page=${p}&tags=${JSON.stringify(tags)}&up_status=&use_daguan=0`)
            .then(e => e.json())
            .then(e => {
                setloading(false)
                setbooks(e.data.book_list)
            })
            .catch(e => { setloading(false); enqueueSnackbar("网络错误" + e, { variant: "error" }) })
    }

    useEffect(() => {
        const p = parseInt(sessionStorage.getItem("page") ?? "0")
        // setpage(p)
        const data = JSON.parse(sessionStorage.getItem("data") ?? "[]")
        setdata(data)
        if (data.length !== 0) Search(p, Getdata(data))
    }, [])

    return <Container sx={{ textAlign: "center", color: "text.primary" }}>
        <H2>聚合搜索</H2>
        <p>温馨提示</p>
        <p>Tag: 表示Tag；Search：表示搜索关键词，仅允许存在一个，如若存在多个，自动使用最后输入的</p>
        <p>显示数据库错误实际上并不存在问题，只是因为懒得去动旧的设计</p>
        <p>搜索结果不一定完全符合你的搜索标准</p>

        <Autocomplete
            multiple
            fullWidth
            autoComplete
            open={open}
            onOpen={() => {
                setOpen(true);
                setOptions(defaultTags)
            }}
            onClose={() => {
                setOpen(false);
                setOptions([])
            }}
            value={data}
            onChange={(e, v) => { setdata(v); sessionStorage.setItem("data", JSON.stringify(v)); sessionStorage.setItem("page", "0") }}
            onInputChange={async (e, v) => {
                if (v === "") return
                setOptions([{ isTag: false, name: v, score: 1 }, { isTag: true, name: v, score: 1 }])
            }}
            onKeyDown={(e) => { if (e.code === "Enter") Search() }}
            filterOptions={(option, state) => option}
            isOptionEqualToValue={(option, value) => option.name === value.name && option.isTag === value.isTag}
            getOptionLabel={(option) => `${option.isTag ? "Tag" : "Search"}: ${option.name}`}
            options={options.sort((i, j) => j.score - i.score)}
            loading={loading}
            renderInput={(params) => (
                <TextField
                    key={params.id}
                    {...params}
                    label="Search"
                    InputProps={{
                        ...params.InputProps,
                        startAdornment: <>
                            <IconButton onClick={() => Search(0)}>
                                <SearchIcon sx={{ color: 'action.active' }} />
                            </IconButton>
                            {params.InputProps.startAdornment}
                        </>,
                        endAdornment: (
                            <>
                                {loading && <CircularProgress color="inherit" />}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
            renderOption={(props, option) => {
                return <li {...props} key={props.id}>
                    <Typography variant="body2" color="text.secondary">
                        {option.isTag ? "Tag" : "Search"}: {option.name}
                    </Typography>
                </li>
            }}
            disabled={loading}
        />
        <Grid container spacing={2} sx={{ pt: 6 }} alignItems="center" justifyContent="center">
            {loading
                ? <CircularProgress color="inherit" size={80} />
                : books.map(book => <Grid item xs={6} md={3} key={book.book_id}>
                    <AutoBookCard book={book} free={book.is_paid === "0"} error />
                </Grid>)
            }
        </Grid>
        {books.length !== 0 && <PaginationElementCallBack pageShow={page + 1} callback={(p) => { Search(p - 1); sessionStorage.setItem("page", (p - 1).toString()); }} />}
    </Container>
}