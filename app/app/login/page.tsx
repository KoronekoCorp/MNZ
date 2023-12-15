'use client'
import { useState, useEffect } from "react"
import { lang } from "../lang.zh";
import { enqueueSnackbar } from "notistack";
import Cookies from "js-cookie";
import { geetest, login } from "./server";
import { Button, Container, Grid, Link, Stack, TextField } from "@mui/material";
import { H2 } from "@/components/H2";
import LoginIcon from '@mui/icons-material/Login';
import KeyIcon from '@mui/icons-material/Key';
import { Accordions } from "@/components/Modals";

export default function Login() {
    const [account, setaccount] = useState<{ account?: string, login_token?: string }>({})
    const [ci_login_token, setci_login_token] = useState("")
    const [ci_account, setci_account] = useState("")
    const [phone, setphone] = useState("")
    const [pwd, setpwd] = useState("")

    useEffect(() => {
        if (document.cookie.includes('ci_login_token') && document.cookie.includes('ci_account')) {
            setaccount({ account: Cookies.get("ci_account"), login_token: Cookies.get("ci_login_token") })
        }
    }, []);

    const putCookie = () => {
        if (ci_login_token.length < 4 || ci_account.length < 4) {
            enqueueSnackbar('不为空', { variant: "warning" });
            return false;
        }
        document.cookie = `ci_login_token=${ci_login_token}; max-age=604800; path=/`;
        document.cookie = `ci_account=${encodeURI(ci_account)}; max-age=604800; path=/`;
        setaccount({ account: ci_account, login_token: ci_login_token })
        enqueueSnackbar('登录成功', { variant: 'success' });
        return false
    };

    const removeCookie = () => {
        Cookies.remove("ci_account");
        Cookies.remove("ci_login_token");
        setaccount({ account: undefined, login_token: undefined })
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
                        setaccount({ account: r.data.reader_info.account, login_token: r.data.login_token })
                        document.cookie = `ci_login_token=${r.data.login_token}; max-age=604800; path=/`;
                        document.cookie = `ci_account=${encodeURI(r.data.reader_info.account)}; max-age=604800; path=/`;
                        enqueueSnackbar('登录成功', { variant: 'success' })
                        enqueueSnackbar(`账户信息:${r.data.reader_info.reader_name}\t剩余猫饼干${r.data.prop_info.rest_hlb}`, { variant: 'success' })
                    } else {
                        enqueueSnackbar('登录失败', { variant: 'error' })
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
                    <p>Account: </p><b>{account.account ?? lang["default_account_by_admin"]}</b>
                </Stack>
                <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
                    <KeyIcon />
                    <p>Token: </p><b>{account.login_token ?? lang["default_account_by_admin"]}</b>
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
                <p><Link href="https://forum.nhimmeo.cf/d/26-faq">FAQ(English)</Link></p>
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

    return (
        <div className="row">
            <div className="col-sm-12 col-md-6">
                <div className="card fluid">
                    <div className="section">
                        <h2>
                            <i className="fa fa-sign-in" aria-hidden="true"></i> 登录
                        </h2>
                    </div>
                    <div className="row">
                        <div className="col-sm-12 col-md-6">
                            <form action="" method="post" id="form_token">
                                <b>Account:</b>
                                <br />
                                <input className="form-control" id="ci_account" type="text" name="ci_account" maxLength={100}
                                    onChange={(e) => { setci_account(e.target.value.trim()) }} />
                                <br />
                                <b>Login token:</b>
                                <br />
                                <input className="form-control" id="ci_login_token" type="text" name="ci_login_token" maxLength={100}
                                    onChange={(e) => { setci_login_token(e.target.value.trim()) }} />
                                <br />
                                <button type="button" className="primary" onClick={putCookie}>
                                    登录
                                </button>
                            </form>
                        </div>
                        <div className="col-sm-12 col-md-6">
                            <div className="section ">
                                <p>
                                    <a href="https://forum.nhimmeo.cf/d/25-instructions-to-get-ciweimao-token">指引(English)</a>
                                </p>
                                <p>
                                    <a href="https://forum.nhimmeo.cf/d/26-faq">FAQ(English)</a>
                                </p>
                                <p>
                                    示例
                                    <ul>
                                        <li>
                                            account - <b>书客644333222111</b>
                                        </li>
                                        <li>
                                            token - <b>d8c5e9f227ec11fda1ee023ea1ea5337</b>
                                        </li>
                                    </ul>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-sm-12 col-md-6">
                <div className="card fluid">
                    <div className="section">
                        <h2>
                            <i className="fa fa-sign-in" aria-hidden="true"></i> 登录(实验性)
                        </h2>
                    </div>
                    <div className="section">
                        <form action="" method="post">
                            <b>手机号:</b>
                            <br />
                            <input className="form-control" id="phone" type="text" maxLength={100}
                                onChange={(e) => { setphone(e.target.value.trim()) }} />
                            <br />
                            <b>密码:</b>
                            <br />
                            <input className="form-control" id="pwd" type="password" maxLength={100}
                                onChange={(e) => { setpwd(e.target.value.trim()) }} />
                            <br />
                            <button type="button" className="primary" onClick={extralogin}>
                                登录
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

