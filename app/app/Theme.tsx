"use client"

import { type Palette, createTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';


declare module '@mui/material/styles' {
    interface PaletteColor {
        Doujinshi: Palette['primary'];
        Manga: Palette['primary'];
        ArtistCG: Palette['primary'];
        GameCG: Palette['primary'];
        NonH: Palette['primary'];
        ImageSet: Palette['primary'];
        Western: Palette['primary'];
        Cosplay: Palette['primary'];
        AsianPorn: Palette['primary'];
        Miscellaneous: Palette['primary'];
    }
}


export function useTheme(mode: "dark" | "light") {
    const [theme, settheme] = useState((() => {
        let theme = createTheme({
            palette: {
                mode: mode,
                ...(
                    mode == "light"
                        ? {
                            text: {
                                primary: "#000000",
                            },
                        }
                        : {
                            text: {
                                primary: "#ffffff",
                                secondary: "#B0B8C4"
                            },
                            background: {
                                default: "#121212",
                                paper: "#1f1f1f"
                            }
                        }
                ),
            }
        })
        theme = createTheme(theme, {
            palette: {
                Doujinshi: theme.palette.augmentColor({
                    color: { main: '#9E2720' }
                }),
                Manga: theme.palette.augmentColor({
                    color: { main: '#DB6C24' }
                }),
                ArtistCG: theme.palette.augmentColor({
                    color: { main: '#D38F1D', },
                }),
                GameCG: theme.palette.augmentColor({
                    color: { main: '#6A936D', },
                }),
                NonH: theme.palette.augmentColor({
                    color: { main: '#5FA9CF', },
                }),
                ImageSet: theme.palette.augmentColor({
                    color: { main: '#325CA2', },
                }),
                Western: theme.palette.augmentColor({
                    color: { main: '#AB9F60', },
                }),
                Cosplay: theme.palette.augmentColor({
                    color: { main: '#6A32A2', },
                }),
                AsianPorn: theme.palette.augmentColor({
                    color: { main: '#A23282', },
                }),
                Miscellaneous: theme.palette.augmentColor({
                    color: { main: '#777777', },
                }),
            },
        })
        return theme
    })())

    const load = () => {
        const d = document.cookie.match(/dark=(true|false)/)
        if (d) {
            if (d[1] === "true") {
                const config = localStorage.getItem("darkm")
                if (config) {
                    settheme(createTheme(theme, JSON.parse(config)))
                } else {
                    settheme(createTheme({
                        palette: {
                            mode: "dark",
                            text: {
                                primary: "#ffffff",
                                secondary: "#B0B8C4"
                            },
                            background: {
                                default: "#121212",
                                paper: "#1f1f1f"
                            }
                        }
                    }))
                }
            } else {
                const config = localStorage.getItem("lightm")
                if (config) {
                    settheme(createTheme(theme, JSON.parse(config)))
                } else {
                    settheme(createTheme({
                        palette: {
                            mode: "light",
                            text: {
                                primary: "#000000",
                            },
                        }
                    }))
                }
            }
        }
    }

    useEffect(() => {
        load()
    }, [typeof document !== "undefined" ? document.cookie : ""])

    return theme
}