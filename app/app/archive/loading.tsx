
import PaginationTotalElement from "@/components/Pagination"
import { Box, Card, Container, Grid, Skeleton, Stack } from "@mui/material";
import { H2 } from "@/components/H2";
import ShareIcon from '@mui/icons-material/Share';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import Battery5BarIcon from '@mui/icons-material/Battery5Bar';
import Battery2BarIcon from '@mui/icons-material/Battery2Bar';
import BookIcon from '@mui/icons-material/Book';

export default function Loading({ page }: { page?: number }) {
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
        </Box>
        <H2>
            <BookIcon />有共同章节的小说
        </H2>
        <Grid container spacing={2} sx={{ p: 1 }} alignItems="center" justifyContent="center">
            {new Array(20).fill(1).map((i, j) => <Grid item xs={6} md={3} key={j}>
                <Card>
                    <Skeleton height="50vh" />
                </Card>
            </Grid>)}
        </Grid>
        {page && <PaginationTotalElement currentUri="/userchap" pageShow={page} totalSearch={9999} />}
    </Container>
}