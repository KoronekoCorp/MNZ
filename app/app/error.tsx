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
}
