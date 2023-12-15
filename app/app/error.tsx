'use client' // Error components must be Client Components

import { useEffect, useState } from 'react'
import { RadioGroup, FormControl, FormLabel, FormControlLabel, Radio, Container, Button } from "@mui/material"
import { enqueueSnackbar } from 'notistack'
import Cookies from 'js-cookie'
import { H2 } from '@/components/H2'
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { DatabaseSetting } from '@/components/DatabaseSetting'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const [value, setValue] = useState('newest');
    useEffect(() => {
        // Log the error to an error reporting service
        // console.error(error)

        setValue(Cookies.get("db") ?? "newest")
    }, [error])

    return <Container sx={{ textAlign: "center", }}>
        <H2 sx={{ backgroundColor: "error.main", color: "error.contrastText" }}>
            <WarningAmberIcon />某些东西出了点毛病，也许换个数据库可以解决？
        </H2>
        <H2 sx={{ backgroundColor: "primary.main", color: "primary.contrastText" }}>
            <WarningAmberIcon />温馨提示：你也可以在设置中更改
        </H2>
        <div style={{ paddingTop: 10 }}>
            <DatabaseSetting />
        </div>
        <Button variant="contained" sx={{ m: 1 }}
            onClick={() => {
                // reset()
                document.location.href = document.location.href
            }}>重新加载</Button>
        <br />
        <img src='/assets/images/憧憬成為魔法少女-50-3.png' />
    </Container>

    return (
        <div style={{ textAlign: "center" }}>
            <div className="card fluid center" style={{ backgroundColor: "rgb(255 180 180)" }}>
                <h3>
                    <i className="fa fa-warning" aria-hidden="true" />{" "}
                    某些东西出了点毛病，也许换个数据库可以解决？
                </h3>
            </div>

            <div className="card fluid center" style={{ backgroundColor: "#ffefc8" }}>
                <h3>
                    <i className="fa fa-cogs" aria-hidden="true" /> 温馨提示：你也可以在设置中更改
                </h3>
            </div>

            <div className="container center" style={{ paddingTop: 10 }}>
                <FormControl component="fieldset">
                    <FormLabel component="legend">数据库设置</FormLabel>
                    <RadioGroup aria-label="db" name="db" onChange={(e) => {
                        setValue(e.target.value);
                        document.cookie = `db=${e.target.value}; max-age=604800; path=/`;
                        enqueueSnackbar("数据库设置已保存", { variant: 'info' })
                    }} value={value}>
                        <FormControlLabel value="filess" control={<Radio />} label="独立数据库(filess)" />
                        <FormControlLabel value="newest" control={<Radio />} label="中心数据库(alwaysdata)" />
                        <FormControlLabel value="stable" control={<Radio />} label="独立数据库(维护中)" />
                    </RadioGroup>
                </FormControl>
            </div >
            <div className="container center" style={{ paddingTop: 10 }}>
                <button onClick={() => {
                    // reset()
                    document.location.href = document.location.href
                }}>
                    重新加载
                </button>
            </div>
            <img src='/assets/images/憧憬成為魔法少女-50-3.png' />
        </div>
    )
}
