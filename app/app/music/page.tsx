"use client"

import { H2 } from "@/components/H2";
import { audiolist } from "@/Music/default";
import { Info, Playlist } from "@/Music/NeteaseType";
import DeleteForever from '@mui/icons-material/DeleteForever';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import QueueMusic from '@mui/icons-material/QueueMusic';
import Save from '@mui/icons-material/Save';
import { Button, FormControl, FormControlLabel, FormLabel, IconButton, Radio, RadioGroup, Stack, TextField } from "@mui/material";
import Grid from '@mui/material/GridLegacy';
import { AudioInfo } from "aplayer-react";
import Cookies from "js-cookie";
import { closeSnackbar, enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";

export default function Music() {
    const [value, setValue] = useState("on")
    const [audio, setaudio] = useState(audiolist)
    const [playid, setplayid] = useState("")

    useEffect(() => {
        setValue(Cookies.get("music") ?? "on")
        const c = JSON.parse(localStorage.getItem("audiolist") ?? "[]") as AudioInfo[]
        if (c.length !== 0) setaudio(c)
    }, [])

    const remove = (i: number) => {
        const d = audio[i]
        setaudio(audio.filter((e, j) => { if (i !== j) return e }))
        enqueueSnackbar(`已移除歌曲${d.name ?? "未知歌曲"}`, {
            autoHideDuration: 5000,
            action: (id) => <Button onClick={() => { Recover(d); closeSnackbar(id) }} color="inherit" variant="outlined">撤销</Button>,
            variant: 'error'
        })
    }

    const Recover = (d: AudioInfo) => {
        const h = audio.slice()
        if (!h.find(i => i.url === d.url)) h.push(d)
        setaudio(h)
        enqueueSnackbar('已恢复', { variant: "success" })
    }


    const InputAsync = async () => {
        try {
            const all = await (await fetch(`https://w.elysia.rip/playlist/detail?id=${playid}&s=0`)).json() as Playlist
            if (all.code === 200) {
                const l = all.playlist.trackIds.length
                const data = audio.slice()
                enqueueSnackbar(`总计${l}首歌，开始导入`, { variant: "info" })
                for (let offset = 0; offset <= l; offset += 50) {
                    const r = await (await fetch(`https://w.elysia.rip/playlist/track/all?id=${playid}&limit=50&offset=${offset}`)).json() as Info
                    if (r.code === 200) {
                        r.songs.forEach((one) => {
                            if (!data.find(i => i.url === `https://elysia.rip/mirror/zapi.elysia.rip/music/url/${one.id}`)) {
                                data.push({
                                    name: one.name,
                                    cover: one.al.picUrl,
                                    url: `https://elysia.rip/mirror/zapi.elysia.rip/music/url/${one.id}`,
                                    artist: one.ar[0].name
                                })
                            }
                        })
                    }
                }
                enqueueSnackbar("歌单导入成功", { variant: "success" })
                setaudio(data)
            } else {
                enqueueSnackbar("歌单存在问题", { variant: "error" })
            }
        } catch {
            enqueueSnackbar("发生错误，请重试", { variant: "error" })
        }
    }

    return <>
        <title>音乐控制器</title>
        <Grid container sx={{ color: "text.primary", textAlign: "center", }}
            justifyContent="center"
            alignItems="stretch" spacing={2}>
            <Grid item xs={12} md={6}>
                <H2>
                    <MusicNoteIcon /> 音乐控制器
                </H2>
                <p>此设置需刷新页面之后才会生效</p>
                <div style={{ paddingTop: 10 }}>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">是否显示音乐播放器</FormLabel>
                        <RadioGroup aria-label="db" name="db" onChange={(e) => {
                            setValue(e.target.value);
                            document.cookie = `music=${e.target.value}; max-age=604800; path=/`;
                            enqueueSnackbar("音乐设置已保存", { variant: 'info' })
                        }} value={value}>
                            <FormControlLabel value="on" control={<Radio />} label="ON" />
                            <FormControlLabel value="off" control={<Radio />} label="OFF" />
                        </RadioGroup>
                    </FormControl>
                </div>
            </Grid>
            <Grid item xs={12} md={6}>
                <H2>
                    <QueueMusic />音乐列表
                </H2>
                <Stack sx={{ pt: 1 }} direction="row" spacing={2} justifyContent="center">
                    <TextField id="outlined-basic" label="歌单ID" variant="outlined" style={{ boxSizing: 'unset' }} type="uid"
                        value={playid}
                        onChange={(e) => { setplayid(e.target.value) }} />
                    <Button variant="contained"
                        onClick={InputAsync}>
                        导入歌单
                    </Button>
                </Stack>
                <p>请注意，点击保存之后才会保存已进行的修改</p>
                <Stack spacing={2} sx={{ pt: 1, "& > div": { m: 1 } }}>
                    {audio.map((i, j) => <Stack direction="row" spacing={2} key={i.url} justifyContent="space-evenly" alignItems="center">
                        <img
                            id="pic_cover"
                            loading="lazy"
                            src={i.cover}
                            className="lazyload blur-up"
                            data-src={i.cover}
                            style={{ height: "10vh", width: "10vh" }}
                        />
                        <p>{i.name ?? "未知歌曲"}</p>
                        <p>{(typeof i.artist === "string" ? i.artist : i?.artist?.name) ?? "未知歌者"}</p>
                        <IconButton color="error"
                            onClick={() => { remove(j) }}>
                            <DeleteForever />
                        </IconButton>
                    </Stack>)}
                </Stack>
                <Button variant="contained" color="error" onClick={() => {
                    localStorage.setItem("audiolist", JSON.stringify(audio))
                    enqueueSnackbar('已保存', { variant: "success" })
                }} startIcon={<Save />}>
                    保存修改
                </Button>
            </Grid>
        </Grid>
    </>
}