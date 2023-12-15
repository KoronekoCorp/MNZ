"use client"
import { SnackbarProvider } from 'notistack'
import { ReactNode } from 'react'

export default function Snackbar({ children }: { children: ReactNode }) {
    return <SnackbarProvider transitionDuration={300} autoHideDuration={1000} >
        {children}
    </SnackbarProvider>
}