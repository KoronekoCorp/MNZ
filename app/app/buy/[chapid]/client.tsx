"use client"
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/Share';
import { Button } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from 'react';

interface Data {
    success: boolean
}

export default function Share({ chap, auto }: { chap: number | string, auto: boolean }) {
    const [success, setSuccess] = useState(false);
    const [loading, setloading] = useState(false)

    const handleButtonClick = () => {
        setloading(true)
        fetch(`/api/share/${chap}`)
            .then((res) => res.json())
            .then((e: Data) => {
                setloading(false)
                setSuccess(e.success)
                enqueueSnackbar("分享成功", { variant: "success" })
            })
            .catch(() => { handleButtonClick() })
    };

    useEffect(() => {
        if (auto) { handleButtonClick() }
    }, [chap])

    return <>
        <Button variant="contained" sx={{ m: 2 }}
            startIcon={<ShareIcon />}
            onClick={handleButtonClick} disabled={success || loading} color='secondary'>
            {success ? "已分享成功" : "分享此内容"}
        </Button>
        <Button variant="contained" sx={{ m: 2 }}
            startIcon={<ContentCopyIcon />}
            onClick={(e) => {
                navigator.clipboard.writeText(document.title + "\n" + document.getElementsByTagName("article")[0].innerText)
                enqueueSnackbar("复制成功", { variant: "success" })
            }}>
            复制文字
        </Button>
    </>
}