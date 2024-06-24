import { ClientButton, History } from '@/app/chap/[chapid]/client';
import { H2 } from '@/components/H2';
import { Prefetch, R, S } from '@/components/push';
import { UseAPI } from "@/Data/Use";
import { UseDB } from "@/Data/UseDB";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Battery2BarIcon from '@mui/icons-material/Battery2Bar';
import Battery5BarIcon from '@mui/icons-material/Battery5Bar';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import BookIcon from '@mui/icons-material/Book';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import LockIcon from '@mui/icons-material/Lock';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import MoneyIcon from '@mui/icons-material/Money';
import ReviewsIcon from '@mui/icons-material/Reviews';
import ShareIcon from '@mui/icons-material/Share';
import SortIcon from '@mui/icons-material/Sort';
import { Badge, Button, Card, Container, Stack } from '@mui/material';
import { unstable_cache } from 'next/cache';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function Page({ params, searchParams }: { params: { chapid: string }, searchParams: { [key: string]: string | undefined } }) {
    const [db, db_n] = UseDB()
    const a = await UseAPI()
    const r = await a.chapter_new(params.chapid)
    if (r.code != "100000") { notFound() }
    if (r.data.chapter_info.is_paid == "0" && r.data.chapter_info.auth_access == "1") {
        return <R url={`/chap/${params.chapid}`} />
    }
    const _shchp = unstable_cache(async () => db.Shchap(params.chapid, r.data.chapter_info.book_id),
        [`${db_n}_shChap_${params.chapid}`], { revalidate: 2592000, tags: [`${db_n}_shChap_${params.chapid}`] })()

    const _jt = a.tsukkomis(params.chapid)

    const _ln = a.find(params.chapid, r.data.chapter_info.book_id)

    const shchap = await _shchp
    if (shchap == null) {
        return <R url={`/chap/${params.chapid}`} />
    }

    const jt = await _jt
    const ln = await _ln

    const date = new Date((shchap.stime + 7 * 3600) * 1000).toLocaleString('zh-CN', { timeZone: 'GMT' });

    return <Container sx={{
        textAlign: "center",
        color: "text.primary",
        "a": { textDecoration: 'none' },
        "article": { color: "text.secondary", bgcolor: 'background.paper', p: 1, "img": { width: "100%" } },
        "p": { wordBreak: 'break-word' }
    }}>
        <title>{r.data.chapter_info.chapter_title.split("#")[0]}</title>
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
                <span>{r.data.chapter_info.chapter_index} </span>
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
            <ClientButton body={shchap.txt} />
            <Stack direction="row" useFlexGap flexWrap="wrap" justifyContent="center" alignItems="center" spacing={2}>
                {r.data.chapter_info.is_paid === '1' && <LockIcon color='warning' fontSize='large' />}
                {r.data.chapter_info.auth_access == '0'
                    ? <HighlightOffIcon color='error' fontSize='large' />
                    : <CheckCircleOutlineIcon color='success' fontSize='large' />}
                {shchap.mode.includes("vip") && <BatteryFullIcon sx={{ color: "#6C00FF" }} fontSize='large' />}
                {shchap.mode.includes("marauder") && <Battery5BarIcon sx={{ color: "#6C00FF" }} fontSize='large' />}
                {shchap.mode.includes("post") && <Battery2BarIcon sx={{ color: "#6C00FF" }} fontSize='large' />}
            </Stack>
            <p className="center" style={{ fontSize: '1.55em', color: '#ef1909' }}>
                {r.data.chapter_info.auth_access === '0' && (
                    <> <span style={{ color: '#FF1818', fontSize: '40px' }}>
                        <i className="fa fa-times-circle" aria-hidden="true"></i>
                    </span> </>
                )}
                {r.data.chapter_info.auth_access !== '0' && (
                    <> <span style={{ color: '#069A8E', fontSize: '40px' }}>
                        <i className="fa fa-check-circle" aria-hidden="true"></i>
                    </span> </>
                )}
            </p>
            <div>
                {jt[0] ? <Badge component={Link} prefetch={false} href={`/shchap/${params.chapid}?tsukkomis=0`} key={0} id="0" sx={{ width: "100%" }}
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
                    {shchap.txt.split("\n").map((l, i, length) => {
                        const id = i + 1
                        if (jt[id.toString()]) {
                            if (l.includes("<img")) {
                                return <div key={id} id={id.toString()}>
                                    <Badge
                                        component={Link} prefetch={false} href={`/shchap/${params.chapid}?tsukkomis=${id}`}
                                        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                                        badgeContent={jt[id.toString()].tsukkomi_num}
                                        color="secondary">
                                        <div dangerouslySetInnerHTML={{ __html: l }} />
                                    </Badge>{id != length.length && <br />}
                                </div>
                            } else {
                                return <div key={id} id={id.toString()}>
                                    <Badge
                                        component={Link} prefetch={false} href={`/shchap/${params.chapid}?tsukkomis=${id}`}
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
                <Card raised>
                    <Stack direction="row" spacing={2} sx={{ m: 1, mr: 2, ml: 2 }}>
                        <ShareIcon />
                        Shared by:
                        <AccountCircleIcon />
                        <b>{shchap.author_name}</b>
                        <p>at</p>
                        <AccessTimeIcon />
                        <b>{date}</b>
                    </Stack>
                </Card>
                <Card raised sx={{ p: 2, m: 2 }}>
                    {ln.last && <Button LinkComponent={Link} href={`/shchap/${ln.last}`}
                        startIcon={<KeyboardArrowLeftIcon />}>上一章</Button>}
                    {ln.newest && <Button LinkComponent={Link} href={`/shchap/${ln.newest}`}
                        endIcon={<KeyboardArrowRightIcon />}>下一章
                        <Prefetch url={[`/shchap/${ln.newest}`]} time={15000} />
                    </Button>}
                </Card>
            </Stack>
        </div>
        <S index={params.chapid} id={searchParams.tsukkomis ? searchParams.tsukkomis : "scrollIntoView"} />
        <History chap={r} />
    </Container>
}