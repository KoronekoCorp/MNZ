'use client'
import { H2 } from "@/components/H2";
import { Accordions } from "@/components/Modals";
import KeyIcon from '@mui/icons-material/Key';
import LoginIcon from '@mui/icons-material/Login';
import { Button, Container, Grid, Link, Stack, TextField } from "@mui/material";
import Cookies from "js-cookie";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { geetest, login, sign } from "./server";

export default function Login() {
    const [ci_login_token, setci_login_token] = useState<string>()
    const [ci_account, setci_account] = useState<string>()
    const [phone, setphone] = useState("")
    const [pwd, setpwd] = useState("")

    useEffect(() => {
        setci_account(Cookies.get("ci_account"))
        setci_login_token(Cookies.get("ci_login_token"))
    }, []);

    const putCookie = async () => {
        if (ci_login_token && ci_account && ci_login_token.length > 4 && ci_account?.length > 4) {
            const domain = document.location.hostname.replace(/.*?\./, ".")
            document.cookie = `ci_login_token=${ci_login_token}; max-age=604800; path=/; domain=${domain}`;
            document.cookie = `ci_account=${encodeURI(ci_account)}; max-age=604800; path=/; domain=${domain}`;
            enqueueSnackbar('登录成功', { variant: 'success' });
            return false
        } else {
            enqueueSnackbar('不为空', { variant: "warning" });
            return false;
        }
    };

    const removeCookie = () => {
        Cookies.remove("ci_account");
        Cookies.remove("ci_login_token");
        setci_account(undefined)
        setci_login_token(undefined)
        enqueueSnackbar('已退出登录', { variant: 'error' });
        return false
    };

    const extralogin = () => {
        enqueueSnackbar("正在获取人机验证信息", { variant: "info" })
        geetest().then((bot) => {
            if (bot.data.need_use_geetest === "0") {
                enqueueSnackbar("无需人机验证信息，正在登录", { variant: "info" })
                login(phone, pwd).then((r) => {
                    console.log(r)
                    if (r?.data?.login_token && r?.data?.reader_info?.account) {
                        setci_account(r.data.reader_info.account)
                        setci_login_token(r.data.login_token)
                        document.cookie = `ci_login_token=${r.data.login_token}; max-age=604800; path=/`;
                        document.cookie = `ci_account=${encodeURI(r.data.reader_info.account)}; max-age=604800; path=/`;
                        enqueueSnackbar('登录成功', { variant: 'success' })
                        enqueueSnackbar(`账户信息:${r.data.reader_info.reader_name}\t剩余猫饼干${r.data.prop_info.rest_hlb}`, { variant: 'success' })
                    } else {
                        enqueueSnackbar('登录失败' + JSON.stringify(r), { variant: 'error' })
                    }
                })
            } else {
                enqueueSnackbar("需要人机验证信息，放弃登录，相关功能尚未完成", { variant: "error" })
            }
        })
    }
    return <Container>
        <Grid container sx={{ textAlign: 'center', color: 'text.primary' }}>
            <Grid item sm={12}>
                <H2>
                    <LoginIcon /> Login
                </H2>
                <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
                    <KeyIcon />
                    <p>登录状态: </p>
                    {ci_account !== undefined && ci_login_token !== undefined && Cookies.get("ci_account") !== undefined && Cookies.get("ci_login_token") !== undefined
                        ? <>
                            <Button variant="contained" onClick={removeCookie} color="error">
                                已登录，点此注销
                            </Button>
                            <Button variant="contained" onClick={async () => {
                                const r = await sign()
                                enqueueSnackbar(r.tip ?? "签到成功" + r.data?.bonus.hlb, { variant: 'success' })
                            }} color="success">
                                签到
                            </Button>
                        </> :
                        <Button variant="contained" disabled={true}>
                            未登录
                        </Button>}
                </Stack>

                <Accordions title={<p style={{ textAlign: "center", width: "100%", margin: 0 }}>说明</p>}
                    sx={{ margin: 1 }}>
                    <p style={{ wordBreak: 'break-word', margin: 0 }}>
                        <small>
                            <p>您可以将此站点视为中间人。您可以在 Nhimmeo 使用您的 Ciweimeo 帐户来阅读购买的章节和购买新章节。</p>
                            <br />
                            <b>获取内容：</b>
                            <br />
                            <p>Ciweimao android app → Nhimmeo (User chap, 如果能) → 你</p>
                            <br />
                            <b>购买关于 Nhimmeo 的章节：</b>
                            <br />
                            <p>你 → 购买章节 → Nhimmeo → Ciweimao app android</p>
                            <br />
                            <b>分享关于 Nhimmeo 的章节(自选)：</b>
                            <br />
                            <p>您 → 购买的章节 → 分享 → Nhimmeo（User chap）</p>
                        </small>
                    </p>
                </Accordions>
            </Grid>
            <Grid item sm={12} md={6}>
                <H2>
                    token登录
                </H2>
                <Grid container>
                    <Grid item sm={12} md={6} sx={{ "& > div": { m: 1 } }}>
                        <TextField label="ci_account" variant="outlined"
                            value={ci_account}
                            onChange={(e) => { setci_account(e.target.value.trim()) }} />
                        <TextField label="ci_login_token" variant="outlined"
                            value={ci_login_token}
                            onChange={(e) => { setci_login_token(e.target.value.trim()) }} />
                    </Grid>
                    <Grid item sm={12} md={6} sx={{ "& > div": { m: 1 } }}>
                        <TextField label="示例ci_account" variant="outlined" disabled value="书客644333222111" />
                        <TextField label="示例ci_login_token" variant="outlined" disabled value="d8c5e9f227ec11fda1ee023ea1ea5337" />

                    </Grid>
                </Grid>
                <Button variant="contained" onClick={putCookie}>
                    登录
                </Button>
                <p><Link href="https://github.com/KoronekoCorp/Report/discussions/11">教程</Link></p>
            </Grid>
            <Grid item sm={12} md={6}>
                <H2>
                    手机号登录
                </H2>
                <Grid container>
                    <Grid item sm={12} md={6} sx={{ "& > div": { m: 1 } }}>
                        <TextField label="phone" variant="outlined"
                            value={phone}
                            onChange={(e) => { setphone(e.target.value.trim()) }} />
                        <TextField label="password" variant="outlined" type="password"
                            value={pwd}
                            onChange={(e) => { setpwd(e.target.value.trim()) }} />
                    </Grid>
                    <Grid item sm={12} md={6} sx={{ "& > div": { m: 1 } }}>
                        <p>可能存在的问题：在此处登录之后会导致其他登录全部失效</p>
                    </Grid>
                </Grid>
                <Button variant="contained" onClick={extralogin}>
                    登录(实验性)
                </Button>
            </Grid>
        </Grid>
    </Container>
};

