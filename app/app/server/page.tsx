"use client"

import { H2 } from "@/components/H2";
import StorageIcon from '@mui/icons-material/Storage';
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import Grid from '@mui/material/GridLegacy';
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { clearReg, Get_ip, IP, Link, Reg } from "./server";


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
            <Grid item xs={12} md={6}>
                <H2>
                    <StorageIcon />控制工具
                </H2>
                <Button variant="contained" onClick={() => {
                    clearReg().then(e => {
                        enqueueSnackbar("已清空注册", { variant: "success" })
                    })
                }} sx={{ m: 3 }}>
                    清空注册
                </Button>
                <Button variant="contained" onClick={() => {
                    Reg().then(e => {
                        enqueueSnackbar(`注册完成 ${e[0]} ${e[1]}`, { variant: "success" })
                    })
                }} sx={{ m: 3 }}>
                    重新注册
                </Button>
            </Grid>
        </Grid>
    </>
}