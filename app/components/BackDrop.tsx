"use client"
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from '@mui/material/CircularProgress';
import { createContext, useState } from "react";

export const SetBackDrop = createContext((state: boolean) => { })

export default function BackDropProvider({ children }: { children?: JSX.Element }) {
    const [open, setopen] = useState(false)

    return <SetBackDrop.Provider value={setopen}>
        {children}
        {open && <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
            <CircularProgress color="inherit" />
        </Backdrop>}
    </SetBackDrop.Provider>

}