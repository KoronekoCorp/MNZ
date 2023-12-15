"use client"

import { styled } from "@mui/material";

export const H2 = styled("h2")(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#e5dfdf',
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.mode === 'dark' ? '#ffffff' : 'black',
    borderRadius: 12,
    margin: theme.spacing(1)
}));