"use client"

import { Autocomplete, Button, FormControl, FormLabel, Link as LinkC, TextField } from "@mui/material"
import Cookies from "js-cookie"
import Link from "next/link"
import { enqueueSnackbar } from "notistack"
import { useEffect, useState } from "react"

const option = [
    "https://app.happybooker.cn",
    "https://app.hbooker.com",
    "https://sk.hbooker.com",
    "https://ciweimao.b-cdn.net"
]

export function MirrorSetting() {
    const [value, setValue] = useState<string | null>(null);
    useEffect(() => {
        setValue(Cookies.get("cwm_mirror") ?? null)
    }, [])

    return <div style={{ paddingTop: 10 }}>
        <FormControl fullWidth sx={{ mt: 1 }}>
            <FormLabel component="legend">如要填写自定义镜像，请严格参照原始设定填写</FormLabel>
            <FormLabel component="legend"><LinkC href="https://github.com/KoronekoCorp/M">自定义镜像一键部署点此访问</LinkC></FormLabel>
            <FormLabel component="legend"><LinkC component={Link} href="/server">修改完点此测试网络状态</LinkC></FormLabel>
            <Autocomplete
                freeSolo
                value={value}
                inputValue={value ?? ""}
                onChange={(e, v) => setValue(v)}
                onInputChange={(e, v) => setValue(v)}
                options={option}
                sx={{ m: 0, p: 2 }}
                renderInput={(params) => <TextField {...params} label="镜像设置" />}
            />
        </FormControl>
        <Button variant="contained" color="primary"
            onClick={() => {
                const domain = document.location.hostname.replace(/.*?\./, ".")
                if (value) {
                    document.cookie = `cwm_mirror=${value}; max-age=2592000; path=/; domain=${domain}`;
                    enqueueSnackbar("镜像设置已修改为" + value, { variant: 'success' })
                } else {
                    Cookies.remove("cwm_mirror", { path: '/', domain: domain });
                    enqueueSnackbar("镜像设置已移除", { variant: 'success' })
                }
            }}>
            保存修改
        </Button>
    </div>
}