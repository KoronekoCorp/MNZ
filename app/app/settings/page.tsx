"use client"

import { uuid } from "@/Data/Storge.Server"
import { Button, TextField, Grid, Stack } from "@mui/material"
import { enqueueSnackbar } from "notistack"
import { useEffect, useState } from "react"
import { H2 } from "@/components/H2"
import SyncIcon from '@mui/icons-material/Sync';
import StorageIcon from '@mui/icons-material/Storage';
import { DatabaseSetting } from "@/components/DatabaseSetting"

export default function Setting() {
    const [syncid, setsyncid] = useState("")


    useEffect(() => {
        const key = localStorage.getItem("SyncKey")
        if (key) {
            setsyncid(key)
        }
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
                <Stack sx={{ m: 1 }} direction="row" spacing={2} justifyContent="center">
                    <Button variant="contained"
                        onClick={() => {
                            uuid().then((e) => {
                                setsyncid(e)
                                localStorage.setItem("SyncKey", e);
                                enqueueSnackbar("同步ID已生成并保存", { variant: 'info' })
                            })
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
            </Grid>
            <Grid item xs={12} md={6}>
                <H2>
                    <StorageIcon />数据库设置
                </H2>
                <div style={{ paddingTop: 10 }}>
                    <DatabaseSetting />
                </div >
            </Grid>
        </Grid>
    </>
}