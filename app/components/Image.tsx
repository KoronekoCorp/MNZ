"use client"

import { CSSProperties, useEffect, useState } from "react"
import './Image.css'

export function Image({ src, style }: { src: string, style?: CSSProperties }) {
    const [mir, setmir] = useState<string>()
    useEffect(() => {
        setmir(localStorage.getItem("mirror") ?? "aeiljuispo.cloudimg.io")
    }, [src])

    return <>
        {mir && <img
            loading="lazy"
            src="/assets/images/logo.png"
            className="lazyload blur-up"
            data-src={`https://${mir}/v7/${src}`}
            style={style}
        />}
    </>
}