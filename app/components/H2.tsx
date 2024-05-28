"use client"

import { styled } from "@mui/material";
import style from './H2.module.css';

export const H2 = styled("h2")(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#e5dfdf',
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.mode === 'dark' ? '#ffffff' : 'black',
    borderRadius: 12,
    margin: theme.spacing(1)
}));


export function H1({ text }: { text: string }) {
    return <h1 className={style.error} style={{ fontSize: `calc(100vw/${text.length})` }} data-text={text}>{text}</h1>
}