"use client"
import { type CSSProperties, type JSX, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Modal, Backdrop, Fade, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Accordion, AccordionSummary, AccordionDetails } from '@mui/material'
import { type AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

/**
 * 模态
 * @param index 序列号，唯一
 * @returns 
 */
export function ModalS({ children, index, closeAction }:
    {
        children: JSX.Element[] | JSX.Element, index: string
        closeAction?: (router: AppRouterInstance) => void
    }) {
    const [open, setOpen] = useState(true)
    const router = useRouter()
    useEffect(() => {
        setOpen(true)
    }, [index])


    if (index == null) { return <></> }

    return (
        <Modal open={open}
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            onClose={() => {
                setOpen(false);
                closeAction ? setTimeout(closeAction, 0, router) : setTimeout(router.push, 500, document.location.origin + document.location.pathname)
            }}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
            <Fade in={open}>
                <Box sx={{
                    position: 'absolute' as 'absolute',
                    top: '55%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 'auto',
                    height: 'auto',
                    bgcolor: 'background.paper',
                    // border: '2px solid #000',
                    boxShadow: 24,
                    borderRadius: '20px',
                    p: 4,
                    zIndex: 10000
                }}>
                    {children}
                </Box>
            </Fade>
        </Modal>)
}

/**
 * 对话框
 * @param index 序列号，唯一
 * @returns 
 */
export function Dig({ title, children, index, actions, closeAction, sx }:
    {
        title: string | JSX.Element, children: JSX.Element[] | JSX.Element, index: string,
        actions: Array<{ name: string, func: (close: () => void) => any | Promise<any>, style?: CSSProperties }>
        closeAction?: (router: AppRouterInstance) => void,
        sx?: CSSProperties
    }) {
    const [open, setOpen] = useState(true)
    const router = useRouter()
    useEffect(() => {
        setOpen(true)
    }, [index])

    if (index == null) { return <></> }
    const handleClose = () => {
        setOpen(false);
        closeAction ? setTimeout(closeAction, 0, router) : setTimeout(router.back)
    }

    return <Dialog open={open} onClose={handleClose} sx={sx}>
        <DialogTitle>
            {title}
        </DialogTitle>
        <DialogContent sx={{ margin: "auto" }}>
            {children}
        </DialogContent>
        <DialogActions>
            {actions.map(i => <Button onClick={() => i.func(handleClose)} color="primary" key={i.name} style={i.style}>
                {i.name}
            </Button>)}
            <Button onClick={handleClose} color="primary">
                Close
            </Button>
        </DialogActions>
    </Dialog>
}


export function Accordions({ title, children, sx }: { title: string | JSX.Element, children: JSX.Element | JSX.Element[], sx?: CSSProperties }) {
    return <Accordion sx={sx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            {title}
        </AccordionSummary>
        <AccordionDetails>
            {children}
        </AccordionDetails>
    </Accordion>
}