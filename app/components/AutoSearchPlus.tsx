"use client"

import { AutoSearch } from "./AutoSearch"
import { Top } from "./push";
import { Checkbox, Container, FormControl, FormControlLabel, Grid, MenuItem, Select, Stack, TextField, ToggleButton, IconButton } from "@mui/material"
import { useRouter } from "next/navigation";
import { useState } from "react"
import SearchIcon from '@mui/icons-material/Search';

declare module '@mui/material/ToggleButton' {
    interface ToggleButtonPropsColorOverrides {
        Doujinshi: true;
        Manga: true;
        ArtistCG: true;
        GameCG: true;
        NonH: true;
        ImageSet: true;
        Western: true;
        Cosplay: true;
        AsianPorn: true;
        Miscellaneous: true;
    }
}

export function FullSearch() {
    const [word, setword] = useState("")
    const [values, setvalue] = useState<number[]>([1, 2, 4, 8, 16, 32, 64, 128, 256, 512])
    const [option, setoption] = useState<boolean[]>(new Array(5).fill(false))
    const [startpage, setsp] = useState("")
    const [endpage, setep] = useState("")
    const [low, setl] = useState("0")

    const router = useRouter()
    const change = (v: number) => {
        const t = values.slice()
        if (t[v] == 0) {
            t[v] = 2 ** v
        } else {
            t[v] = 0
        }
        setvalue(t)
    }

    const changeoption = (v: number) => {
        const t = option.slice()
        t[v] = !t[v]
        setoption(t)
    }

    const GetCat = (v: number[] = values) => {
        let cat = 1023
        for (const i of v) {
            cat -= i
        }
        return cat
    }

    const Search = () => {
        const u = new URL(location.origin + "/i")
        if (word != "") u.searchParams.set("f_search", word)
        const cat = GetCat()
        if (cat != 0) u.searchParams.set("f_cats", cat.toString())
        if (option[0]) u.searchParams.set("f_sh", "on")
        if (option[1]) u.searchParams.set("f_sto", "on")
        if (option[2]) u.searchParams.set("f_sfl", "on")
        if (option[3]) u.searchParams.set("f_sfu", "on")
        if (option[4]) u.searchParams.set("f_sft", "on")
        if (startpage != "" && startpage != "NaN") u.searchParams.set("f_spf", startpage)
        if (endpage != "" && endpage != "NaN") u.searchParams.set("f_spt", endpage)
        if (low != "0") u.searchParams.set("f_srdd", low)
        router.push(u.href)
    }

    return <Container sx={{ "& > div": { pt: 2 } }}>
        <AutoSearch onClick={Search} onChange={(v) => setword(v)} />
        <Grid container spacing={2} sx={{ p: 1 }} alignItems="center" justifyContent="center">
            <Grid item xs="auto">
                <ToggleButton value={2} selected={values.includes(2)} onChange={() => change(1)} color='Doujinshi' >
                    同人志
                </ToggleButton>
            </Grid>
            <Grid item xs="auto">
                <ToggleButton value={4} selected={values.includes(4)} onChange={() => change(2)} color='Manga' >
                    漫画
                </ToggleButton>
            </Grid>
            <Grid item xs="auto">
                <ToggleButton value={8} selected={values.includes(8)} onChange={() => change(3)} color='ArtistCG'>
                    画师CG
                </ToggleButton>
            </Grid>
            <Grid item xs="auto">
                <ToggleButton value={16} selected={values.includes(16)} onChange={() => change(4)} color='GameCG'>
                    游戏CG
                </ToggleButton>
            </Grid>
            <Grid item xs="auto">
                <ToggleButton value={512} selected={values.includes(512)} onChange={() => change(9)} color='Western'>
                    西方
                </ToggleButton>
            </Grid>
            <Grid item xs="auto">
                <ToggleButton value={256} selected={values.includes(256)} onChange={() => change(8)} color='NonH'>
                    无H
                </ToggleButton>
            </Grid>
            <Grid item xs="auto">
                <ToggleButton value={32} selected={values.includes(32)} onChange={() => change(5)} color='ImageSet'>
                    图集
                </ToggleButton>
            </Grid>
            <Grid item xs="auto">
                <ToggleButton value={64} selected={values.includes(64)} onChange={() => change(6)} color='Cosplay'>
                    Cosplay
                </ToggleButton>
            </Grid>
            <Grid item xs="auto">
                <ToggleButton value={128} selected={values.includes(128)} onChange={() => change(7)} color='AsianPorn'>
                    亚洲色情
                </ToggleButton>
            </Grid>
            <Grid item xs="auto">
                <ToggleButton value={1} selected={values.includes(1)} onChange={() => change(0)} color='Miscellaneous'>
                    杂项
                </ToggleButton>
            </Grid>
        </Grid>
        <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" color="text.primary">
            <FormControlLabel control={<Checkbox checked={option[0]} onChange={() => changeoption(0)} />} label="只显示已删除的图库" />
            <FormControlLabel control={<Checkbox checked={option[1]} onChange={() => changeoption(1)} />} label="只显示有种子的图库" />
        </Stack>
        <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" color="text.primary">
            介于<TextField size="small" sx={{ pl: 1, pr: 1, width: 64 }} variant="standard" value={startpage} onChange={(e) => setsp(parseInt(e.target.value).toString())} />
            和<TextField size="small" sx={{ pl: 1, pr: 1, width: 64 }} variant="standard" value={endpage} onChange={(e) => setep(parseInt(e.target.value).toString())} />页
        </Stack>
        <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" color="text.primary">
            最低评分：
            <FormControl>
                <Select autoFocus value={low} onChange={(e) => setl(e.target.value)}>
                    <MenuItem value="0">无限制</MenuItem>
                    <MenuItem value="2">2星</MenuItem>
                    <MenuItem value="3">3星</MenuItem>
                    <MenuItem value="4">4星</MenuItem>
                    <MenuItem value="5">5星</MenuItem>
                </Select>
            </FormControl>
        </Stack>
        <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" color="text.primary">
            禁用自定义过滤器：
            <FormControlLabel control={<Checkbox checked={option[2]} onChange={() => changeoption(2)} />} label="语言" />
            <FormControlLabel control={<Checkbox checked={option[3]} onChange={() => changeoption(3)} />} label="上传者" />
            <FormControlLabel control={<Checkbox checked={option[4]} onChange={() => changeoption(4)} />} label="标签" />
        </Stack>
        <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" color="text.primary">
            温馨提示，点击放大镜执行搜索
        </Stack>
        <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" color="text.primary">
            <TextField label="自定义搜索" fullWidth
                value={word}
                onChange={(e) => setword(e.target.value)}
                InputProps={{
                    startAdornment: <IconButton onClick={Search}>
                        <SearchIcon sx={{ color: 'action.active' }} />
                    </IconButton>
                }}
            />
        </Stack>
        <Top index="search" />
    </Container>
}