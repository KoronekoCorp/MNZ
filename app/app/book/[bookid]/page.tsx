import { UseAPI } from "@/Data/Use"
import Link from "next/link"
import { ClientButton } from "./Button"
import { unstable_cache } from 'next/cache'
import { UseDB } from "@/Data/UseDB"
import { notFound } from "next/navigation"
import { UserchapInfo } from "@/Data/DataType"
import { Prefetch } from "@/app/push"
import { H2 } from "@/components/H2"
import { Container, Grid, Stack, Link as LinkC, Button } from "@mui/material"
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import PersonIcon from '@mui/icons-material/Person';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HistoryIcon from '@mui/icons-material/History';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import DehazeIcon from '@mui/icons-material/Dehaze';
import FolderIcon from '@mui/icons-material/Folder';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import Battery5BarIcon from '@mui/icons-material/Battery5Bar';
import Battery2BarIcon from '@mui/icons-material/Battery2Bar';
import TagIcon from '@mui/icons-material/Tag';
import DomainIcon from '@mui/icons-material/Domain';
import MenuBookIcon from '@mui/icons-material/MenuBook';

const categories = {
    '0': '所有分类',
    '8': '都市青春',
    '27': '玄幻奇幻',
    '1': ' 灵异未知',
    '30': '历史军事',
    '6': '科幻无限',
    '3': '游戏竞技',
    '5': '仙侠武侠',
    '24': '免费同人',
    '11': '女频',
}

export default async function Page({ params }: { params: { bookid: string } }) {
    const [db, db_n] = UseDB()
    const _Userchap = unstable_cache(async () => db.UserchapInfo(params.bookid),
        [`${db_n}_UserchapInfo_${params.bookid}`], { revalidate: 7200, tags: [`${db_n}_UserchapInfo_${params.bookid}`] })()
    const a = await UseAPI()
    const r = await a.bookinfo(params.bookid)
    if (r.code !== '100000') {
        notFound()
    }
    let Userchap: UserchapInfo[]
    let error = false
    if (r.data.book_info.is_paid === "0") {
        Userchap = [{ chapters: 0, modes: null }]
    } else {
        try {
            Userchap = await _Userchap
        } catch { Userchap = [{ chapters: 0, modes: null }]; error = true }
    }

    return <Container>
        <title>{`《${r.data.book_info.book_name}》 – ${r.data.book_info.author_name}`}</title>
        {error && <H2 sx={{ backgroundColor: "error.main", color: "error.contrastText" }}>
            <WarningAmberIcon />数据库连接失败
        </H2>}
        <Grid container spacing={2} sx={{ p: 1 }} alignItems="flex-start" justifyContent="center">
            <Grid item xs={12} md={4} sx={{ textAlign: "center", "& > a": { mt: 1 }, "& > button": { mt: 1 } }}>
                <img
                    style={{ width: "100%", height: "auto" }}
                    loading="lazy"
                    src="https://cos.koroneko.co/off.gif"
                    className="lazyload blur-up"
                    data-src={r.data.book_info.cover}
                />
                <Button LinkComponent={Link} href={`/book/${r.data.book_info.book_id}/catalog/`}
                    variant="contained" color="success"
                    startIcon={<MenuBookIcon />}>
                    章节目录
                </Button>
                <br />
                <ClientButton book_id={r.data.book_info.book_id} book_name={r.data.book_info.book_name} book_cover={r.data.book_info.cover} />
                <Prefetch url={[`/book/${r.data.book_info.book_id}/catalog/`]} time={1000} />
            </Grid>
            <Grid item xs={12} md={8} sx={{ color: "text.primary" }}>
                <H2>{r.data.book_info.book_name}</H2>
                <Stack direction="row" sx={{ p: 1 }} useFlexGap flexWrap="wrap" justifyContent="flex-start" alignItems="center" spacing={2}>
                    <PersonIcon /><b>作者:</b>
                    <LinkC component={Link} href={`/search/${r.data.book_info.author_name}`}>
                        {r.data.book_info.author_name}
                    </LinkC>
                </Stack>
                <Stack direction="row" sx={{ p: 1 }} useFlexGap flexWrap="wrap" justifyContent="flex-start" alignItems="center" spacing={2}>
                    <DataUsageIcon /><b>章节数:</b>
                    <span>{r.data.book_info.chapter_amount}</span>
                    <b>字数:</b>
                    <span>{r.data.book_info.total_word_count}</span>
                </Stack>
                <Stack direction="row" sx={{ p: 1 }} useFlexGap flexWrap="wrap" justifyContent="flex-start" alignItems="center" spacing={2}>
                    <EmojiEventsIcon />
                    <b>月票:</b>
                    <span>{r.data.book_info.total_yp}</span>
                    <b>推荐票:</b> <span>{r.data.book_info.total_recommend}</span>
                    <b>打赏:</b> <span>{r.data.book_info.reward_amount}</span>
                    <b>刀片:</b> <span>{r.data.book_info.total_blade}</span>
                </Stack>
                <Stack direction="row" sx={{ p: 1 }} useFlexGap flexWrap="wrap" justifyContent="flex-start" alignItems="center" spacing={2}>
                    <AccessTimeIcon />
                    <b>更新:</b>
                    <span >{r.data.book_info.uptime}</span>
                    <b>
                        <span>{r.data.book_info.up_status === '0' ? '连载中' : '已完结'}</span>
                    </b>
                    <b>
                        <span>{r.data.book_info.is_paid === '0' ? 'FREE' : 'VIP'}</span>
                    </b>
                </Stack>
                <Stack direction="row" sx={{ p: 1 }} useFlexGap flexWrap="wrap" justifyContent="flex-start" alignItems="center" spacing={2}>
                    <HistoryIcon />
                    <b>最后更新:</b>
                    <LinkC component={Link} href={`/chap/${r.data.book_info.last_chapter_info.chapter_id}`}>
                        {r.data.book_info.last_chapter_info.chapter_title}
                    </LinkC>
                </Stack>
                <Stack direction="row" sx={{ p: 1 }} useFlexGap flexWrap="wrap" justifyContent="flex-start" alignItems="center" spacing={2}>
                    <AirplanemodeActiveIcon />
                    <b>网站:</b>
                    <LinkC href={`https://n.koroneko.co/book/${r.data.book_info.book_id}`}>
                        NhimmeoNext
                    </LinkC>
                    <LinkC
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`http://mip.ciweimao.com/book/${r.data.book_info.book_id}`}
                    >
                        Ciweimao
                    </LinkC>
                    <LinkC
                        href={`https://www.bing.com/search?q=${r.data.book_info.book_name}&from=search`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Bing
                    </LinkC>
                    <LinkC
                        href={`https://www.google.com/search?q=${r.data.book_info.book_name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Google
                    </LinkC>
                </Stack>
                <Stack direction="row" sx={{ p: 1 }} useFlexGap flexWrap="wrap" justifyContent="flex-start" alignItems="center" spacing={2}>
                    <DehazeIcon />
                    <b>作品分类:</b>
                    <LinkC component={Link} href={`/rank?cate=${r.data.book_info.category_index}`}>
                        {categories[r.data.book_info.category_index] || 'Unknown Category'}
                    </LinkC>
                </Stack>
                <Stack direction="row" sx={{ p: 1 }} useFlexGap flexWrap="wrap" justifyContent="flex-start" alignItems="center" spacing={2}>
                    <FolderIcon />
                    <b>书单:</b>
                    <LinkC component={Link} prefetch={false} href={`/book/${r.data.book_info.book_id}/booklists/`}>
                        书单
                    </LinkC>
                </Stack>
                <Stack direction="row" sx={{ p: 1 }} useFlexGap flexWrap="wrap" justifyContent="flex-start" alignItems="center" spacing={2}>
                    <QuestionAnswerIcon />
                    <b>书评:</b>
                    <LinkC component={Link} prefetch={false} href={`/book/${r.data.book_info.book_id}/reviews/`}>
                        书评
                    </LinkC>
                </Stack>
                {Userchap[0].chapters != 0 && <Stack direction="row" sx={{ p: 1 }} useFlexGap flexWrap="wrap" justifyContent="flex-start" alignItems="center" spacing={2}>
                    <FolderZipIcon />
                    <b>User chap:</b>
                    <span>{Userchap[0].chapters}</span>
                    {Userchap[0].modes?.includes('vip') && <BatteryFullIcon sx={{ color: "#6C00FF" }} />}
                    {Userchap[0].modes?.includes('marauder') && <Battery5BarIcon sx={{ color: "#6C00FF" }} />}
                    {Userchap[0].modes?.includes('post') && <Battery2BarIcon sx={{ color: "#6C00FF" }} />}
                </Stack>}
                <Stack direction="row" sx={{ p: 1 }} useFlexGap flexWrap="wrap" justifyContent="flex-start" alignItems="center" spacing={2}>
                    <TagIcon />
                    <b>标签:</b>
                    <Grid container sx={{ "& > div": { m: 1 } }}>
                        {r.data.book_info.tag_list.map((tag) => (
                            <Grid key={tag.tag_name}>
                                <Button LinkComponent={Link} href={`/tag/${tag.tag_name}`}>
                                    {tag.tag_name}
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                </Stack>
                <Stack direction="row" sx={{ p: 1 }} justifyContent="flex-start" alignItems="center" spacing={2}>
                    <DomainIcon />
                    <b>作品简介:</b>
                </Stack>
                <Stack sx={{ p: 1, wordBreak: 'break-all', textAlign: 'start' }} color="text.secondary" justifyContent="flex-start" spacing={2}>
                    {
                        r.data.book_info.description.split("\n").map((l) => <p style={{ wordBreak: 'break-all' }} key={l.slice(0, 10)}>{l}<br /></p>)
                    }
                </Stack>
            </Grid>
        </Grid>
    </Container>
}
