"use client"

import { Button, Grid, Input, Slider, Stack } from "@mui/material"
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles"
import { enqueueSnackbar } from "notistack"
import { useEffect, useState } from "react"
import ColorDemo from "./ColorDemo"


export default function ColorSetting() {
    const oritheme = useTheme()
    const [theme, settheme] = useState(oritheme)
    useEffect(() => {
        settheme(oritheme)
    }, [oritheme.palette.mode])

    const Tips = () => enqueueSnackbar("请点击旁边的调色控件，这个按钮并没有用", { variant: "warning" })


    return <ThemeProvider theme={theme}>
        <Grid container sx={{ color: "text.primary", textAlign: "center", p: 2 }}
            justifyContent="center"
            alignItems="stretch" spacing={2}>
            <Grid item xs={6} md={8}>
                <p>温馨提示</p>
                <p>日夜主题配色需要分别修改和保存</p>
                <p>如果配置没有成功载入，请手动点击重载</p>
                <p>右边是您主题配置的预览</p>
                <Stack sx={{ m: 1 }} direction="row" spacing={2} justifyContent="center" useFlexGap flexWrap="wrap">
                    <Button variant="contained" color="primary" onClick={Tips}>修改主色</Button>
                    <Input type="color" sx={{ minWidth: 64 }} value={theme.palette.primary.main} onChange={(e) => {
                        settheme(createTheme(theme, {
                            palette: {
                                primary: theme.palette.augmentColor({
                                    color: { main: e.target.value }
                                }),
                            }
                        }))
                    }} />
                    <Button variant="contained" color="secondary" onClick={Tips}>修改辅色</Button>
                    <Input type="color" sx={{ minWidth: 64 }} value={theme.palette.secondary.main} onChange={(e) => {
                        settheme(createTheme(theme, {
                            palette: {
                                secondary: theme.palette.augmentColor({
                                    color: { main: e.target.value }
                                }),
                            }
                        }))
                    }} />
                    <Button variant="outlined" sx={{ color: "text.primary", backgroundColor: "background.default" }} onClick={Tips}>修改文本主色</Button>
                    <Input type="color" sx={{ minWidth: 64 }} value={theme.palette.text.primary} onChange={(e) => {
                        settheme(createTheme(theme, {
                            palette: {
                                text: { primary: e.target.value },
                            }
                        }))
                    }} />
                    <Button variant="outlined" sx={{ color: "text.secondary", backgroundColor: "background.paper" }} onClick={Tips}>修改文本辅色</Button>
                    <Input type="color" sx={{ minWidth: 64 }} value={theme.palette.text.secondary} onChange={(e) => {
                        settheme(createTheme(theme, {
                            palette: {
                                text: { secondary: e.target.value },
                            }
                        }))
                    }} />
                    <Button variant="outlined" sx={{ color: "text.primary", backgroundColor: "background.default" }} onClick={Tips}>修改背景主色</Button>
                    <Input type="color" sx={{ minWidth: 64 }} value={theme.palette.background.default} onChange={(e) => {
                        settheme(createTheme(theme, {
                            palette: {
                                background: { default: e.target.value },
                            }
                        }))
                    }} />
                    <Button variant="outlined" sx={{ color: "text.secondary", backgroundColor: "background.paper" }} onClick={Tips}>修改背景辅色</Button>
                    <Input type="color" sx={{ minWidth: 64 }} value={theme.palette.background.paper} onChange={(e) => {
                        settheme(createTheme(theme, {
                            palette: {
                                background: { paper: e.target.value },
                            }
                        }))
                    }} />
                    {/* <Slider min={0.1} max={10} step={0.05} value={theme.typography.fontSize} onChange={(e, v) => {
                        if (typeof v === 'number') {
                            settheme(createTheme(theme, {
                                typography: {
                                    fontSize: v
                                }
                            }))
                        }
                    }} valueLabelDisplay="auto" valueLabelFormat={() => `fontSize ${theme.typography.fontSize}`} /> */}
                    <Slider min={0.1} max={2} step={0.05} value={parseFloat(theme.typography.body1.fontSize as string)} onChange={(e, v) => {
                        if (typeof v === 'number') {
                            settheme(createTheme(theme, {
                                typography: {
                                    body1: { fontSize: `${v}rem` },
                                }
                            }))
                        }
                    }} valueLabelDisplay="auto" valueLabelFormat={() => `body1 ${theme.typography.body1.fontSize}`} />
                    <Slider min={0.5} max={1.5} step={0.025} value={parseFloat(theme.typography.body2.fontSize as string)} onChange={(e, v) => {
                        if (typeof v === 'number') {
                            settheme(createTheme(theme, {
                                typography: {
                                    body2: { fontSize: `${v}rem` },
                                }
                            }))
                        }
                    }} valueLabelDisplay="auto" valueLabelFormat={() => `body2 ${theme.typography.body2.fontSize}`} />
                    <Button variant="contained" color="success" onClick={() => {
                        if (theme.palette.mode === "dark") {
                            localStorage.setItem("darkm", JSON.stringify(theme))
                        } else {
                            localStorage.setItem("lightm", JSON.stringify(theme))
                        }
                        enqueueSnackbar("保存成功，重新加载后生效", { variant: "success" })
                    }}>保存修改</Button>
                    <Button variant="contained" color="warning" onClick={() => {
                        settheme(oritheme)
                        enqueueSnackbar("重载完成", { variant: "success" })
                    }}>重载配置</Button>
                    <Button variant="contained" color="error" onClick={() => {
                        localStorage.removeItem("lightm")
                        localStorage.removeItem("darkm")
                        settheme(oritheme)
                        enqueueSnackbar("重置完成，重新加载后生效", { variant: "success" })
                    }}>重置</Button>
                </Stack>
            </Grid>
            <Grid item xs={6} md={4}>
                <ColorDemo theme={theme} />
            </Grid>
        </Grid>
    </ThemeProvider>
}