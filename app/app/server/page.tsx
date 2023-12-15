"use client"

import { enqueueSnackbar } from "notistack";
import { Get_ip, IP, Link } from "./server";
import { Table, TableHead, TableCell, TableRow, TableBody, Button, Grid } from "@mui/material";
import { useState } from "react";
import StorageIcon from '@mui/icons-material/Storage';
import { H2 } from "@/components/H2";


export default function Setting() {
    const [ip, setip] = useState<IP>()
    const [link, setlink] = useState<[number, number]>()

    const IP = () => {
        Get_ip()
            .then((e) => {
                setip(e)
                enqueueSnackbar("IP信息获取成功", { variant: "success" })
            })
            .catch((e) => {
                enqueueSnackbar(`IP信息获取失败:${e}`, { variant: "error" })
            })
    }

    const getlink = () => {
        Link()
            .then((e) => {
                setlink(e)
                enqueueSnackbar("连接信息获取成功", { variant: "success" })
            })
            .catch((e) => {
                enqueueSnackbar(`连接信息获取失败:${e}`, { variant: "error" })
            })
    }


    return <>
        <title>服务器信息</title>
        <Grid container
            justifyContent="center"
            alignItems="stretch"
            sx={{
                textAlign: "center",
                color: "text.primary",
                paddingTop: 10,
            }}
            spacing={2}>
            <Grid item xs={12} md={6}>
                <H2>
                    <StorageIcon />IP地址
                </H2>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Key</TableCell>
                            <TableCell>Value</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ip && Object.keys(ip).map((row) => (
                            <TableRow
                                key={row}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row}
                                </TableCell>
                                <TableCell>{ip[row].toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Button variant="contained" onClick={IP} sx={{ m: 3 }}>
                    获取服务器IP信息
                </Button>
            </Grid>
            <Grid item xs={12} md={6}>
                <H2>
                    <StorageIcon />连接
                </H2>
                <Grid container justifyContent="center"
                    alignItems="stretch"
                    sx={{
                        textAlign: "center",
                        color: "text.primary",
                        paddingTop: 10,
                    }}
                    spacing={2}>
                    <Grid item sm={6}>
                        <p>刺猬猫延迟</p>
                    </Grid>
                    <Grid item sm={6}>
                        <p>{link ? link[0] : "未测试"}</p>
                    </Grid>
                    <Grid item sm={6}>
                        <p>稳定数据库延迟</p>
                    </Grid>
                    <Grid item sm={6}>
                        <p>{link ? link[1] : "未测试"}</p>
                    </Grid>
                </Grid>
                <Button variant="contained" onClick={getlink} sx={{ m: 3 }}>
                    获取连接信息
                </Button>
            </Grid>
        </Grid>
    </>
}