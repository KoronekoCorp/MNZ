"use client"

import style from './style.module.css'
import { Grid, Container } from "@mui/material";

export default function Home() {
  return (
    <Container sx={{ paddingTop: 10, textAlign: 'center' }}>
      <Grid container>
        <Grid item xs={12} md={6}>
          <img
            loading="lazy"
            className={style.anime}
            src="https://cos.koroneko.co/0.png"
            style={{ maxWidth: "100%" }}
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
