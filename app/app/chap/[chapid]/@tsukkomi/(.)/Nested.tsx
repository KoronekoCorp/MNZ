"use client"
import { type JSX, useState } from "react"
import { ListItemButton, Collapse, List, Divider } from "@mui/material"
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

/**
 * 下拉式折叠列表
 * @param title 折叠之后显示的title
 * @param children 折叠的内容
 * @returns 
 */
export function Nested({ children, title }: { children: JSX.Element[] | JSX.Element, title: JSX.Element }) {
    const [open, setOpen] = useState(false)
    const handle = () => { setOpen(!open) }

    return <>
        <ListItemButton onClick={handle} sx={{ display: "flex", margin: "0px", bgcolor: "background.paper", padding: "0px" }}>
            {title}
            {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Divider variant="inset" component="li" />
        <Collapse in={open} timeout="auto" unmountOnExit>
            <List sx={{
                width: '100%',
                position: 'relative',
                overflow: 'auto',
                height: '100%',
                maxHeight: '100%',
                borderRadius: '20px',
                '& ul': { padding: 0 },
            }} >
                {children}
            </List>
        </Collapse>
    </>
}