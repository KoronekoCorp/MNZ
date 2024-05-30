'use client' // Error components must be Client Components

import { DatabaseSetting } from '@/components/DatabaseSetting';
import { H2 } from '@/components/H2';
import { Top } from '@/components/push';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Button, Container } from "@mui/material";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
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
            onClick={async () => {
                // reset()
                const keys = await caches.keys()
                const c = await Promise.all(keys.map(i => caches.open(i)))
                await Promise.all(c.map(j => j.delete(document.location.href, { ignoreVary: true })))
                document.location.href = document.location.href
            }}>重新加载</Button>
        <br />
        <img src='https://cos.koroneko.co/憧憬成為魔法少女-50-3.png' />
        <Top index={crypto.randomUUID()} />
    </Container>
}
