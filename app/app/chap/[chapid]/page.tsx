import { H2 } from '@/components/H2';
import { Prefetch, R, S } from '@/components/push';
import { UseAPI } from "@/Data/Use";
import { UseDB } from "@/Data/UseDB";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BookIcon from '@mui/icons-material/Book';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import LockIcon from '@mui/icons-material/Lock';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import MoneyIcon from '@mui/icons-material/Money';
import ReviewsIcon from '@mui/icons-material/Reviews';
import SortIcon from '@mui/icons-material/Sort';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Badge, Button, Card, Container, Link as LinkC, Stack } from '@mui/material';
import { unstable_cache } from 'next/cache';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ClientButton, History } from './client';
// import { Baned } from '@/Security/Chap.server';

export default async function Page({ params, searchParams }: { params: { chapid: string }, searchParams: { [key: string]: string | undefined } }) {
    // const b = Baned()
    const [db, db_n] = UseDB()
    const a = await UseAPI()

    const r = await a.chaper(params.chapid)
    if (r.code != "100000") { notFound() }
    // 性能优先，增加数据库压力
    const _isChapterPurchased = unstable_cache(async () => db.isChapterPurchased(params.chapid, r.data.chapter_info.book_id),
        [`${db_n}_Chap_${params.chapid}`], { revalidate: 86400, tags: [`${db_n}_Chap_${params.chapid}`] })()
    const _jt = a.tsukkomis(params.chapid)
    const _ln = a.find(params.chapid, r.data.chapter_info.book_id)

    const cookie = cookies()

    let error = false
    let isChapterPurchased: boolean
    if (r.data.chapter_info.is_paid == "0" && r.data.chapter_info.auth_access == "1") {
        isChapterPurchased = false
    } else {
        try {
            isChapterPurchased = await _isChapterPurchased
        } catch {
            isChapterPurchased = false; error = true
        }
    }

    let auto_use_chapter_vip = false
    if (cookie.get("auto_use_chapter_vip")?.value == "on") {
        auto_use_chapter_vip = true
    }

    if (((r.data.chapter_info.is_paid == '1') && (r.data.chapter_info.auth_access == '0') || (r.data.chapter_info.chapter_title === '该章节未审核通过')) && (isChapterPurchased) && (auto_use_chapter_vip)) {
        return <R url={`/shchap/${params.chapid}`} />
    }
    if (cookie.get("auto_goumai")?.value == "on" && r.data.chapter_info.is_paid == "1") {
        return <R url={`/chap/${params.chapid}/buy`} />
    }

    const jt = await _jt
    const ln = await _ln

    // const [baned, X] = await b
    // if (baned) {
    //     return X
    // }
    return <Container sx={{
        textAlign: "center",
        color: "text.primary",
        "a": { textDecoration: 'none' },
        "article": { color: "text.secondary", bgcolor: 'background.paper', p: 1, "img": { width: "100%" } },
        "p": { wordBreak: 'break-word' }
    }}>
        <title>{r.data.chapter_info.chapter_title.split("#")[0]}</title>
        {error && <H2 sx={{ backgroundColor: "error.main", color: "error.contrastText" }}>
            <WarningAmberIcon />数据库连接失败
        </H2>}
        <div style={{ padding: 10, textAlign: 'center' }}>
            <Button LinkComponent={Link} href={`/book/${r.data.chapter_info.book_id}`}>
                <BookIcon />
            </Button>
            <Button LinkComponent={Link} href={`/book/${r.data.chapter_info.book_id}/catalog`}>
                <MenuBookIcon />
            </Button>
        </div>

        <div id="scrollIntoView">
            <Stack direction="row" useFlexGap flexWrap="wrap" justifyContent="center" alignItems="center" spacing={2}>
                <SortIcon />
                <b>章节位置:</b>
                <span>{r.data.chapter_info.chapter_index}</span>
                <MoneyIcon />
                <b>章节价格:</b>
                <span>{r.data.chapter_info.unit_hlb}</span>
                <GroupAddIcon />
                <b>订阅人数:</b>
                <span>{r.data.chapter_info?.buy_amount}</span>
                <DataUsageIcon />
                <b>字数:</b>
                <span>{r.data.chapter_info.word_count}</span>
                <AccessTimeIcon />
                <b>更新时间:</b>
                <span>{r.data.chapter_info.ctime}</span>
            </Stack>
            <ClientButton body={r.data.chapter_info.txt_content} />
            {r.data.chapter_info.auth_access == "0" && <Link prefetch={false} href={`/shchap/${params.chapid}/Cache`}>
                <Button variant='contained' color='error' startIcon={<DeleteIcon />}>
                    清除缓存
                </Button>
            </Link>}
            <Stack direction="row" useFlexGap flexWrap="wrap" justifyContent="center" alignItems="center" spacing={2}>
                {r.data.chapter_info.is_paid === '1' && <LockIcon color='warning' fontSize='large' />}
                {r.data.chapter_info.auth_access !== '0' && <CheckCircleOutlineIcon color='success' fontSize='large' />}
            </Stack>
            <div>
                {jt[0] ? <Badge component={Link} prefetch={false} href={`/chap/${params.chapid}?tsukkomis=0`} key={0} id="0" sx={{ width: "100%" }}
                    badgeContent={jt["0"].tsukkomi_num} anchorOrigin={{ vertical: 'top', horizontal: 'left' }} color="secondary">
                    <H2 sx={{ width: "100%" }}>
                        {r.data.chapter_info.chapter_title.split("#")[0]}
                    </H2>
                </Badge> : <H2>
                    {r.data.chapter_info.chapter_title.split("#")[0]}
                </H2>}
                <article
                    itemScope={true}
                    itemType="http://schema.org/BlogPosting"
                    style={{
                        fontSize: 20,
                        fontFamily: "Bookerly",
                        textAlign: 'start',
                        borderRadius: 12
                    }}
                >
                    {r.data.chapter_info.txt_content.split("\n").map((l, i, length) => {
                        const id = i + 1
                        if (jt[id.toString()]) {
                            if (l.includes("<img")) {
                                return <div key={id} id={id.toString()}>
                                    <Badge
                                        component={Link} prefetch={false} href={`/chap/${params.chapid}?tsukkomis=${id}`}
                                        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                                        badgeContent={jt[id.toString()].tsukkomi_num}
                                        color="secondary">
                                        <div dangerouslySetInnerHTML={{ __html: l }} />
                                    </Badge>{id != length.length && <br />}
                                </div>
                            } else {
                                return <div key={id} id={id.toString()}>
                                    <Badge
                                        component={Link} prefetch={false} href={`/chap/${params.chapid}?tsukkomis=${id}`}
                                        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                                        badgeContent={jt[id.toString()].tsukkomi_num}
                                        color="secondary" sx={{ "div": { color: "text.secondary" } }}>
                                        <div style={{ fontSize: "20px" }}>{l}</div>
                                    </Badge>{id != length.length && <><br /><br /></>}
                                </div>
                            }
                        }
                        if (l.includes("<img")) {
                            return <div dangerouslySetInnerHTML={{ __html: l }} key={id} id={id.toString()} />
                        } else {
                            return <div style={{ fontSize: "20px" }} key={id} id={id.toString()}>{l}{id != length.length && <><br /><br /></>}</div>
                        }
                    })}
                </article>
            </div>
            {r.data.chapter_info.author_say == "" ? <></> : <div className="detail_des" id="author_say_div" style={{ marginTop: 20 }}>
                <Stack sx={{ fontSize: "20px" }} direction="row" spacing={1} justifyContent="center" alignItems="center">
                    <ReviewsIcon />
                    <b>作者留言</b>
                </Stack>
                <div>{r.data.chapter_info.author_say.split("\n").map((l, i) => <p style={{ fontSize: "20px" }} key={i}>{l}<br /></p>)}</div>
            </div>}
            <Stack useFlexGap flexWrap="wrap" justifyContent="center" alignItems="center" spacing={2}
                sx={{ mt: 1, "div": { mt: 1 } }}>
                {isChapterPurchased && <Card raised sx={{ width: 'max-content', p: 2, maxWidth: "100%" }}>
                    <div>
                        有道友分享了这一章
                        <div>
                            <Button variant='contained' LinkComponent={Link} href={`/shchap/${params.chapid}/`} color="info">
                                读
                            </Button>
                        </div>
                        <p>
                            <small>
                                <i className="fa fa-lightbulb-o" aria-hidden="true" /> 转到
                                <b>
                                    <LinkC component={Link} prefetch={false} href="/userchap/1">User chap</LinkC>
                                </b>
                                <p>然后打开<u>自动使用章节vip</u>更快阅读共享章节。</p>
                            </small>
                        </p>
                    </div>
                </Card>}
                {r.data.chapter_info.auth_access === "0" && <Card raised sx={{ width: 'fit-content', p: 2, maxWidth: "100%" }}>
                    <p style={{ margin: 8 }}>本章为VIP章节，请先订阅！</p>
                    <Button variant='contained' LinkComponent={Link} href={`/buy/${params.chapid}`} color="error" sx={{ m: 1 }}>
                        购买章节 <b>({r.data.chapter_info.unit_hlb}币)</b>
                    </Button>
                </Card>}
                <Card raised sx={{ p: 2, m: 2 }}>
                    {ln.last && <Button LinkComponent={Link} href={`/chap/${ln.last}`}
                        startIcon={<KeyboardArrowLeftIcon />}>上一章</Button>}
                    {ln.newest && <Button LinkComponent={Link} href={`/chap/${ln.newest}`}
                        endIcon={<KeyboardArrowRightIcon />}>下一章
                        <Prefetch url={[`/chap/${ln.newest}`]} time={5000} />
                    </Button>}
                </Card>
            </Stack>
        </div>
        <S index={params.chapid} id={searchParams.tsukkomis ? searchParams.tsukkomis : "scrollIntoView"} />
        <History chap={r} />
    </Container>
}
