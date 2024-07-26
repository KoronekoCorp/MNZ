import { ClientButton } from '@/app/chap/[chapid]/client';
import { H2 } from '@/components/H2';
import { Prefetch, S } from '@/components/push';
import { UseDB } from "@/Data/UseDB";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Battery2BarIcon from '@mui/icons-material/Battery2Bar';
import Battery5BarIcon from '@mui/icons-material/Battery5Bar';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import BookIcon from '@mui/icons-material/Book';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ShareIcon from '@mui/icons-material/Share';
import { Button, Card, Container, Stack } from '@mui/material';
import { unstable_cache } from 'next/cache';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { bookid: string, chapid: string } }) {
    const [db, db_n] = UseDB()
    const shchap = await unstable_cache(async () => db.Shchap(params.chapid, params.bookid),
        [`${db_n}_shChap_${params.chapid}`], { revalidate: 2592000, tags: [`${db_n}_shChap_${params.chapid}`] })()

    if (shchap == null) {
        return notFound()
    }
    const b = await unstable_cache(async () => db.Bookchaps(params.bookid),
        [`${db_n}_Catalog_${params.bookid}`], { revalidate: 7200, tags: [`${db_n}_Catalog_${params.bookid}`] })()

    const main = b.findIndex((c) => c.chapter_id == parseInt(params.chapid))
    const ln = {
        last: b[main - 1]?.chapter_id,
        newest: b[main + 1]?.chapter_id
    }

    const date = new Date((shchap.stime + 7 * 3600) * 1000).toLocaleString('zh-CN', { timeZone: 'GMT' });

    return <Container sx={{
        textAlign: "center",
        color: "text.primary",
        "a": { textDecoration: 'none' },
        "article": { color: "text.secondary", bgcolor: 'background.paper', p: 1, "img": { width: "100%" } },
        "p": { wordBreak: 'break-word' }
    }}>
        <title>{shchap.title?.split("#")[0] ?? "未知"}</title>
        <div style={{ padding: 10, textAlign: 'center' }}>
            <Button LinkComponent={Link} href={`/archive/book/${shchap.book_id}`}>
                <BookIcon />
            </Button>
        </div>
        <div id="scrollIntoView">
            <ClientButton body={shchap.txt} />
            <Stack direction="row" useFlexGap flexWrap="wrap" justifyContent="center" alignItems="center" spacing={2}>
                {shchap.mode.includes("vip") && <BatteryFullIcon sx={{ color: "#6C00FF" }} fontSize='large' />}
                {shchap.mode.includes("marauder") && <Battery5BarIcon sx={{ color: "#6C00FF" }} fontSize='large' />}
                {shchap.mode.includes("post") && <Battery2BarIcon sx={{ color: "#6C00FF" }} fontSize='large' />}
            </Stack>
            <div>
                <H2>
                    {shchap.title?.split("#")[0] ?? "未知"}
                </H2>
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
                        if (l.includes("<img")) {
                            return <div dangerouslySetInnerHTML={{ __html: l }} key={id} id={id.toString()} />
                        } else {
                            return <div style={{ fontSize: "20px" }} key={id} id={id.toString()}>{l}{id != length.length && <><br /><br /></>}</div>
                        }
                    })}
                </article>
            </div>
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
                    {ln.last && <Button LinkComponent={Link} href={`/archive/chap/${params.bookid}/${ln.last}`}
                        startIcon={<KeyboardArrowLeftIcon />}>上一章</Button>}
                    {ln.newest && <Button LinkComponent={Link} href={`/archive/chap/${params.bookid}/${ln.newest}`}
                        endIcon={<KeyboardArrowRightIcon />}>下一章
                        <Prefetch url={[`/shchap/${ln.newest}`]} time={15000} />
                    </Button>}
                </Card>
            </Stack>
        </div>
        <S index={params.chapid} id={"scrollIntoView"} />
        {/* <History chap={r} /> */}
    </Container>
}