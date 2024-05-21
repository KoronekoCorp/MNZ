"use client"

import { useEffect, useState } from 'react'
import { APlayer, type AudioInfo } from "aplayer-react";
import "aplayer/dist/APlayer.min.css";
import Cookies from "js-cookie"
import { audiolist } from './default';

export function Music({ dark }: { dark: boolean }) {
    const [audio, setaudio] = useState(audiolist)
    const [enable, setenable] = useState(false)


    useEffect(() => {
        const c = JSON.parse(localStorage.getItem("audiolist") ?? "[]") as AudioInfo[]
        if (c.length !== 0) setaudio(c)
        setenable((Cookies.get("music") ?? "on") === "on")
    }, [])

    return <>{(audio.length !== 0 && enable) && <APlayer audio={audio} appearance="fixed" theme={dark ? "black" : "white"} initialLoop="all" />}</>
}