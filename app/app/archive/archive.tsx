import { H2 } from "@/components/H2"
import PaginationTotalElement from "@/components/Pagination"
import { UseDB } from "@/Data/UseDB"
import Battery2BarIcon from '@mui/icons-material/Battery2Bar'
import Battery5BarIcon from '@mui/icons-material/Battery5Bar'
import BatteryFullIcon from '@mui/icons-material/BatteryFull'
import BookIcon from '@mui/icons-material/Book'
import ShareIcon from '@mui/icons-material/Share'
import { Box, Card, CardActionArea, CardContent, Container, Stack } from "@mui/material"
import Grid from '@mui/material/GridLegacy'
import { unstable_cache } from "next/cache"
import Link from "next/link"
import Fix from "../userchap/client"


export default async function Archive({ page }: { page: number }) {
    const [db, db_n] = UseDB()
    const _r = unstable_cache(async () => {
        const [users, books, all] = await Promise.all([db.UserchapUsers(), db.userchap(page), db.UserchapCount()])
        return { users, books, all }
    }, [`${db_n}_UserChap_${page}`], { revalidate: 7200, tags: [`${db_n}_UserChap_${page}`] })()

    const { users, books, all } = await _r

    return <Container sx={{ textAlign: 'center' }}>
        <H2>
            <ShareIcon />存档库
        </H2>
        <Box sx={{ textAlign: 'start', color: 'text.secondary' }}>
            <p>
                Nhimmeo是一个支持一起购物的网站-&gt;你购买Ciweimao
                vip章节-&gt;分享到Nhimmeo-&gt;其他人可以阅读。
                <br />
                我使用“User chapter”而不是将其翻译成中文为了“highlight”。
                <br />
                Userchap 这里列出了刺猬猫中的vip章节，其中：
            </p>
            <Stack direction="row" sx={{ "& > svg": { color: "#6C00FF" } }}>
                <BatteryFullIcon />: 由购买它的 Ciweimao 用户共享。
            </Stack>
            <Stack direction="row" sx={{ "& > svg": { color: "#6C00FF" } }}>
                <Battery5BarIcon />: 摘自 STV (Sangtacviet),每月更新一次，最后更新于 我不知道，因为这不是官方站点。
            </Stack>
            <Stack direction="row" sx={{ "& > svg": { color: "#6C00FF" } }}>
                <Battery2BarIcon />: 收集于盗版网站，管理员手动发布。
            </Stack>
            <p>在自愿的基础上使用和分享。</p>
            <p>贡献者: {users.map((r) => <>
                {r.author_name} <small>({r.count})</small>,
            </>)}</p>
            <Fix />
        </Box>
        <H2>
            <BookIcon />有共同章节的小说
        </H2>
        <Grid container spacing={2} sx={{ p: 1 }} alignItems="center" justifyContent="center">
            {books.map((book) => <Grid item xs={6} md={3} key={book.book_id}>
                <Card>
                    <CardActionArea LinkComponent={Link} href={`/archive/book/${book.book_id}`}>
                        <CardContent>
                            {book.book_id}
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>)}
        </Grid>
        <PaginationTotalElement currentUri="/archive" pageShow={page} totalSearch={all[0]["COUNT(DISTINCT book_id)"]} />
    </Container>
}