"use client"

import Player from "@/components/player";
import { Container } from "@mui/material";
import Grid from '@mui/material/GridLegacy';
import Link from "next/link";
import style from './style.module.css';
import { useEffect, useState } from "react";

export default function Home() {
  const [v, setv] = useState<{ url: string, poster: string }>();
  useEffect(() => {
    const dark = document.cookie.match(/dark=true/)
    if (dark) {
      setv({
        url: "https://cos.elysia.rip/PRTS/index.m3u8",
        poster: "https://cos.elysia.rip/PRTS.jpg"
      })
    } else {
      setv({
        url: "https://cos.elysia.rip/exusiai/index.m3u8",
        poster: "https://cos.elysia.rip/PRTS_new_N.jpg"
      })
    }
  }, [typeof document !== "undefined" ? document.cookie : ""]);

  return (
    <Container sx={{ paddingTop: 10, textAlign: 'center' }}>
      <Grid container>
        <Grid item xs={12} md={6}>
          {!v ? <img
            loading="lazy"
            className={style.anime}
            src="https://cos.elysia.rip/0.png"
            style={{ maxWidth: "100%" }} />
            : <Player option={{
              ...v,
              type: "m3u8",
              container: "",
              autoplay: true,
              muted: false,
              loop: true,
              autoSize: true,
              pip: true,
              fullscreen: true,
              fullscreenWeb: true,
              miniProgressBar: true,
            }}
              callback={(art) => {
                const onclick = () => { art.play(); document.removeEventListener("click", onclick); }
                document.addEventListener("click", onclick);
              }}
              className={style.anime} style={{ maxWidth: "100%", width: "100%", aspectRatio: "16/9" }}
            />}
        </Grid>
        <Grid item xs={12} md={6} sx={{ height: '100vh', color: "text.primary", width: "100%" }} >
          <div style={{ height: "20%" }}> </div>
          <h1>Eexusiai</h1>
          <p>项目地址：<Link href='https://github.com/KoronekoCorp/MNZ'>https://github.com/KoronekoCorp/MNZ</Link></p>
          <iframe id="status" width="250" height="30" frameBorder="0" scrolling="no" />
        </Grid>
      </Grid>
    </Container>
  )
}
