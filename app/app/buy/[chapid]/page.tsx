import { History } from '@/app/chap/[chapid]/client';
import { H2 } from '@/components/H2';
import { Back, Prefetch, R, S } from '@/components/push';
import { API } from '@/Data/Ciweimao';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BookIcon from '@mui/icons-material/Book';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import InfoIcon from '@mui/icons-material/Info';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import LockIcon from '@mui/icons-material/Lock';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import MoneyIcon from '@mui/icons-material/Money';
import ReviewsIcon from '@mui/icons-material/Reviews';
import SortIcon from '@mui/icons-material/Sort';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Badge, Button, Card, Container, Stack } from '@mui/material';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import Link from 'next/link';
import Share from './client';

export default async function Page({ params, searchParams }: { params: { chapid: string }, searchParams: { [key: string]: string | undefined } }) {
    const cookie = cookies()
    const ci_login_token = cookie.get("ci_login_token")
    const ci_account = cookie.get("ci_account")
    const share = cookie.get("auto_share_chapter_vip")?.value == "on"
    if (ci_login_token == undefined || ci_account == undefined) {
        return <R url='/login' />
    }
    const a = new API(ci_login_token.value, ci_account?.value)
    const _jt = a.tsukkomis(params.chapid)
    const [r, buy] = await a.buy_and_get_chaper(params.chapid)
    const _ln = a.find(params.chapid, r.data.chapter_info.book_id)
    const jt = await _jt
    const ln = await _ln

    if (buy?.tip) {
        revalidateTag(`buy_and_get_chaper_${params.chapid}`)

        return <H2 className="card fluid center" style={{ backgroundColor: "rgb(255 180 180)" }}>
            <InfoIcon />
            {buy?.tip}, 5秒后返回
            <Back time={5000}></Back>
        </H2>
    }

    return <Container sx={{
        textAlign: "center",
        color: "text.primary",
        "a": { textDecoration: 'none' },
        "article": { color: "text.secondary", bgcolor: 'background.paper', p: 1, "img": { width: "100%" } },
        "p": { wordBreak: 'break-word' }
    }}>
        <title>{r.data.chapter_info.chapter_title.split("#")[0]}</title>
        <H2 sx={{ backgroundColor: "error.main", color: "error.contrastText" }}>
            <WarningAmberIcon />内容缺失问题已解决，如果仍然存在问题请记得上报
        </H2>
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
            <Share chap={params.chapid} auto={share} body={r.data.chapter_info.txt_content} />
            <Stack direction="row" useFlexGap flexWrap="wrap" justifyContent="center" alignItems="center" spacing={2}>
                {r.data.chapter_info.is_paid === '1' && <LockIcon color='warning' fontSize='large' />}
                {r.data.chapter_info.auth_access == '0'
                    ? <HighlightOffIcon color='error' fontSize='large' />
                    : <CheckCircleOutlineIcon color='success' fontSize='large' />}
            </Stack>
            <div>
                {jt[0] ? <Badge component={Link} prefetch={false} href={`/buy/${params.chapid}?tsukkomis=0`} key={0} id="0" sx={{ width: "100%" }}
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
                                        component={Link} prefetch={false} href={`/buy/${params.chapid}?tsukkomis=${id}`}
                                        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                                        badgeContent={jt[id.toString()].tsukkomi_num}
                                        color="secondary">
                                        <div dangerouslySetInnerHTML={{ __html: l }} />
                                    </Badge>{id != length.length && <br />}
                                </div>
                            } else {
                                return <div key={id} id={id.toString()}>
                                    <Badge
                                        component={Link} prefetch={false} href={`/buy/${params.chapid}?tsukkomis=${id}`}
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
        {/* 存在问题BUG.7 */}
        <S index={params.chapid} id={searchParams.tsukkomis ? searchParams.tsukkomis : "scrollIntoView"} />
        <History chap={r} />
    </Container>
}