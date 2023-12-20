import { UseAPI } from "@/Data/Use";
import { UseDB } from "@/Data/UseDB"
import type { Userchap } from "@/Data/DataType";
import PaginationTotalElement from "@/components/Pagination"
import { unstable_cache } from 'next/cache'
import Fix, { BookSingle } from "./client";
import type { bookinfo } from "@/Data/CiweiType";
import { Box, Container, Grid, Stack } from "@mui/material";
import { H2 } from "@/components/H2";
import ShareIcon from '@mui/icons-material/Share';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import Battery5BarIcon from '@mui/icons-material/Battery5Bar';
import Battery2BarIcon from '@mui/icons-material/Battery2Bar';
import BookIcon from '@mui/icons-material/Book';

export default async function userchap({ page }: { page: number }) {
    const [db, db_n] = UseDB()
    const _r = unstable_cache(async () => {
        const [users, books, all] = await Promise.all([db.UserchapUsers(), db.userchap(page), db.UserchapCount()])
        return { users, books, all }
    }, [`${db_n}_UserChap_${page}`], { revalidate: 7200, tags: [`${db_n}_UserChap_${page}`] })()
    const a = await UseAPI()
    const { users, books, all } = await _r
    const BOOK = async function ({ book }: { book: Userchap }) {
        // var bookinfo = await unstable_cache(async () => await db.bookid(book.book_id),
        //     [`bookid_${book.book_id}`], { revalidate: 7200, tags: [`bookid_${book.book_id}`] })()

        let r: bookinfo
        try {
            r = await a.bookinfo(book.book_id)
        } catch {
            r = {
                code: "100000",
                data: {
                    //@ts-ignore 
                    "book_info": {
                        "book_name": "刺猬猫请求失败",
                        "cover": "/assets/images/off.gif",
                        "author_name": "刺猬猫请求失败",
                    }
                }
            }
        }

        return <BookSingle book={book} req={r} />
    }

    return <Container sx={{ textAlign: 'center' }}>
        <H2>
            <ShareIcon />用户分享的Ciweimao VIP章节
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
            {books.map((book) => <Grid item xs={6} md={3} key={book.book_id}><BOOK book={book} key={book.book_id} /></Grid>)}
        </Grid>
        <PaginationTotalElement currentUri="/userchap" pageShow={page} totalSearch={all[0]["COUNT(DISTINCT book_id)"]} />
    </Container>
}