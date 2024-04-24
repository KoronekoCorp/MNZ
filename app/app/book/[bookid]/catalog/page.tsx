import { H2 } from '@/components/H2'
import { Accordions } from '@/components/Modals'
import { Chaper } from '@/Data/DataType'
import { UseAPI } from '@/Data/Use'
import { UseDB } from "@/Data/UseDB"
import Battery2BarIcon from '@mui/icons-material/Battery2Bar'
import Battery5BarIcon from '@mui/icons-material/Battery5Bar'
import BatteryFullIcon from '@mui/icons-material/BatteryFull'
import BookIcon from '@mui/icons-material/Book'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import LockIcon from '@mui/icons-material/Lock'
import MoneyIcon from '@mui/icons-material/Money'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import { Button, Container, Grid, ListItem, ListItemButton, ListItemText, Stack } from '@mui/material'
import { Metadata } from 'next'
import { unstable_cache } from 'next/cache'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
    title: '目录',
}

export default async function Page({ params }: { params: { bookid: string } }) {
    const [db, db_n] = UseDB()
    const _b = unstable_cache(async () => db.Bookchaps(params.bookid),
        [`${db_n}_Catalog_${params.bookid}`], { revalidate: 7200, tags: [`${db_n}_Catalog_${params.bookid}`] })()
    const a = await UseAPI()
    const r = await a.catalog(params.bookid)
    if (r.code != "100000") { notFound() }

    let b: Chaper[]
    let error = false
    try {
        b = await _b
    } catch { b = []; error = true }

    return <Container>
        {error && <H2 sx={{ backgroundColor: "error.main", color: "error.contrastText" }}>
            <WarningAmberIcon />数据库连接失败
        </H2>}
        <div style={{ padding: 10, textAlign: 'center' }}>
            <Button LinkComponent={Link} href={`/book/${params.bookid}`}>
                <BookIcon />
            </Button>
        </div>

        {r.data.chapter_list.map((chaplist) => {
            return <Accordions key={chaplist.division_index}
                title={<>
                    # {chaplist.division_index}
                    <h4>{chaplist.division_name}</h4>
                </>}>
                <Grid container spacing={2}>
                    {chaplist.chapter_list.map((chap) => {
                        const searchMode = b.findIndex((mode) => mode.chapter_id.toString() === chap.chapter_id);
                        const access = chap.auth_access === '0' && searchMode === -1 ? 'error.main' : 'text.primary';
                        const modes = searchMode !== -1 ? b[searchMode].mode : '';
                        return <Grid xs={12} md={4} key={chap.chapter_index}>
                            <ListItem alignItems="flex-start" >
                                <ListItemButton LinkComponent={Link} href={`/chap/${chap.chapter_id}`}>
                                    <ListItemText
                                        primary={<Stack direction="row">
                                            # <span className="chapter_index">{chap.chapter_index}</span> /{' '}
                                            {chap.auth_access === '0' ? <HighlightOffIcon color='error' /> : <CheckCircleOutlineIcon color='success' />}
                                            {chap.is_paid === '1' && <LockIcon color='warning' />}
                                            {chap.auth_access === '0' && <MoneyIcon color='info' />}
                                            {searchMode !== -1 && (
                                                <>
                                                    /
                                                    {modes.includes('vip') && <BatteryFullIcon sx={{ color: '#6C00FF' }} />}
                                                    {modes.includes('marauder') && <Battery5BarIcon sx={{ color: '#6C00FF' }} />}
                                                    {modes.includes('post') && <Battery2BarIcon sx={{ color: '#6C00FF' }} />}
                                                </>
                                            )}
                                        </Stack>}
                                        secondary={chap.chapter_title}
                                        sx={{ "& > p": { color: access } }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        </Grid>
                    })}
                </Grid>
            </Accordions>
        })}
    </Container>
}