"use client"

import { Container } from "@mui/material";
import Grid from '@mui/material/GridLegacy';
import style from './style.module.css';
import Player from "@/components/player";

export default function Home() {
  return (
    <Container sx={{ paddingTop: 10, textAlign: 'center' }}>
      <Grid container>
        <Grid item xs={12} md={6}>
          {/* <img
            loading="lazy"
            className={style.anime}
            src="https://cos.elysia.rip/0.png"
            style={{ maxWidth: "100%" }}
          /> */}
          <Player
            option={{
              url: "https://cos.elysia.rip/bb13933a8d406f041b05ab5ec7863754_1080p%2B.mp4",
              container: "",
              poster: "https://cos.elysia.rip/PRTS_new_N.jpg",
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
          />
        </Grid>
        <Grid item xs={12} md={6} sx={{ height: '100vh', color: "text.primary", width: "100%" }} >
          <div style={{ height: "20%" }}> </div>
          <h1>Nhimmeo X MUI</h1>
          <p>首页东西有点多，摸鱼ing</p>
        </Grid>
      </Grid>
    </Container>
  )
}
