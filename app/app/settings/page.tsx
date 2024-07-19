"use client"

import { DatabaseSetting } from "@/components/DatabaseSetting"
import { H2 } from "@/components/H2"
import { MirrorSetting } from "@/components/MirrorSetting"
import CachedIcon from '@mui/icons-material/Cached'
import ColorLensIcon from '@mui/icons-material/ColorLens'
import StorageIcon from '@mui/icons-material/Storage'
import SyncIcon from '@mui/icons-material/Sync'
import { Button, Grid, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@mui/material"
import { enqueueSnackbar } from "notistack"
import { useEffect, useState } from "react"
import ColorSetting from "./Color"

export default function Setting() {
    const [syncid, setsyncid] = useState("")
    const [CacheStatus, setCS] = useState(false)
    const [data, setdata] = useState<{ key: string; length: number; }[]>([])

    async function cache() {
        const r = await navigator.serviceWorker.getRegistrations()
        if (r.length > 0) {
            setCS(true)
        } else {
            setCS(false)
        }
        const keys = await caches.keys()
        setdata(await Promise.all(keys.map(async i => {
            const t = await caches.open(i)
            return {
                key: i,
                length: (await t.keys()).length
            }
        })))
    }

    function key(k: string) {
        switch (k) {
            case "cross-origin":
                return k + "(引用文件)"
            case "pages-rsc":
                return k + "(动态数据)"
            case "pages-rsc-prefetch":
                return k + "(预加载)"
            case "next-static-css-assets":
                return k + "(静态文件)"
            case "next-static-js-assets":
                return k + "(静态文件)"
            case "static-data-assets":
                return k + "(静态数据)"
            case "static-image-assets":
                return k + "(图片缓存)"
            case "pages":
                return k + "(页面缓存)"
            default:
                return k
        }
    }

    useEffect(() => {
        const key = localStorage.getItem("SyncKey")
        if (key) {
            setsyncid(key)
        }
        cache()
    }, [])

    return <>
        <title>设置</title>
        <Grid container sx={{ color: "text.primary", textAlign: "center", }}
            justifyContent="center"
            alignItems="stretch" spacing={2}>
            <Grid item xs={12} md={6}>
                <H2>
                    <SyncIcon />同步系统
                </H2>
                <Stack sx={{ pt: 1 }} direction="row" spacing={2} justifyContent="center">
                    <TextField id="outlined-basic" label="同步ID" variant="outlined" style={{ boxSizing: 'unset' }} type="uid"
                        value={syncid}
                        onChange={(e) => { setsyncid(e.target.value) }} />
                </Stack>
                <Stack sx={{ m: 1 }} direction="row" spacing={2} justifyContent="center" useFlexGap flexWrap="wrap">
                    <Button variant="contained"
                        onClick={() => {
                            const e = crypto.randomUUID()
                            setsyncid(e)
                            localStorage.setItem("SyncKey", e);
                            enqueueSnackbar("同步ID已生成并保存", { variant: 'info' })
                        }}>
                        自动生成同步ID
                    </Button>
                    <Button variant="contained"
                        onClick={() => { navigator.clipboard.writeText(syncid); enqueueSnackbar("同步ID已复制", { variant: 'info' }) }}>
                        复制同步ID
                    </Button>
                    <Button variant="contained" style={{ color: "#fff", backgroundColor: "#2196f3" }}
                        onClick={() => { localStorage.setItem("SyncKey", syncid); enqueueSnackbar("同步ID已保存", { variant: 'info' }) }}>
                        保存同步ID
                    </Button>
                    <Button variant="contained" style={{ color: "#fff", backgroundColor: "#f50057" }}
                        onClick={() => { setsyncid(""); localStorage.removeItem("SyncKey"); enqueueSnackbar("同步已终止", { variant: 'error' }) }}>
                        关闭同步
                    </Button>
                </Stack>
                <p>同步数据在云端将保存48小时，每次同步会自动续期数据</p>
                <H2>
                    <CachedIcon /> 缓存控制
                </H2>
                <Stack direction="row" spacing={2} justifyContent="center" useFlexGap flexWrap="wrap">
                    <p>当前缓存服务</p>
                    <Button variant="outlined" color={CacheStatus ? "success" : "error"} onClick={async () => {
                        if (CacheStatus) {
                            localStorage.setItem("noSw", "true")
                            const r = await navigator.serviceWorker.getRegistrations()
                            await Promise.all(r.map(i => i.unregister()))
                            enqueueSnackbar(`已尝试注销服务进程`, { variant: 'info' })
                        } else {
                            localStorage.setItem("noSw", "false")
                            await navigator.serviceWorker.register("/sw.js")
                            enqueueSnackbar(`已尝试注册服务进程`, { variant: 'info' })
                        }
                        cache()
                    }}>
                        {CacheStatus ? "已启用" : "未启用"}
                    </Button>
                </Stack>

                <div style={{ padding: 10 }}>
                    <Table sx={{ "th": { textAlign: 'center' }, "td": { textAlign: 'center' } }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>储存桶</TableCell>
                                <TableCell>总数</TableCell>
                                <TableCell>管理</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row) => (
                                <TableRow
                                    key={row.key}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">
                                        {key(row.key)}
                                    </TableCell>
                                    <TableCell>{row.length}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="warning" onClick={async () => {
                                            const status = await caches.delete(row.key)
                                            cache()
                                            if (status) {
                                                enqueueSnackbar(`${row.key}清除成功`, { variant: 'success' })
                                            } else {
                                                enqueueSnackbar(`${row.key}清除失败`, { variant: 'error' })
                                            }
                                        }}>
                                            清空
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Button variant="contained" sx={{ m: 3 }} color="error" onClick={async () => {
                        await Promise.all(data.map(async i => caches.delete(i.key)))
                        cache()
                        enqueueSnackbar(`已清空`, { variant: 'info' })
                    }}>
                        全部清空
                    </Button>
                </div>
            </Grid>

            <Grid item xs={12} md={6}>
                <H2>
                    <StorageIcon />数据库设置
                </H2>
                <div style={{ paddingTop: 10 }}>
                    <DatabaseSetting />
                </div >
                <H2>
                    <StorageIcon />镜像设置
                </H2>
                <MirrorSetting />
            </Grid>
            <Grid item xs={12} md={12}>
                <H2>
                    <ColorLensIcon />主题配色
                </H2>
                <div style={{ paddingTop: 10 }}>
                    <ColorSetting />
                </div >
            </Grid>
        </Grid>
    </>
}