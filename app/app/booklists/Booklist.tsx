import { Back } from "@/app/push";
import { BookCard } from "@/components/AutoBookCard";
import { H2 } from "@/components/H2";
import PaginationTotalElement from '@/components/Pagination';
import { UserchapInfo } from "@/Data/DataType";
import { UseAPI } from "@/Data/Use";
import { UseDB } from "@/Data/UseDB";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import { Fav } from "./client";

export default async function Booklist({ id, page }: { id: number, page: number }) {
    const a = await UseAPI()
    const r = await a.booklist(id, page)
    if (r.code != "100000") { notFound() }

    const [db, db_n] = UseDB()
    const Userchap = async ({ bookid }: { bookid: number | string }) => {
        var userchap: UserchapInfo[]
        var error: JSX.Element | undefined
        try {
            userchap = await unstable_cache(async () => db.UserchapInfo(bookid),
                [`UserchapInfo_${bookid}`], { revalidate: 86400, tags: [`UserchapInfo_${bookid}`] })()
        } catch { userchap = [{ chapters: 0, modes: null }]; error = <span className="console-error">数据库错误</span> }

        const Userchap = userchap
        const icons = [];
        if (error) { icons.push(error) }
        if (Userchap[0].chapters) {
            icons.push(`${Userchap[0].chapters} | `)
            if (Userchap[0].modes?.includes('vip')) {
                icons.push(<><span key="vip" style={{ color: '#6C00FF' }}><i className="fa fa-battery-full" aria-hidden="true"></i></span>  </>);
            }
            if (Userchap[0].modes?.includes('marauder')) {
                icons.push(<><span key="marauder" style={{ color: '#6C00FF' }}><i className="fa fa-battery-half" aria-hidden="true"></i></span>  </>);
            }
            if (Userchap[0].modes?.includes('post')) {
                icons.push(<span key="post" style={{ color: '#6C00FF' }}><i className="fa fa-battery-quarter" aria-hidden="true"></i></span>);
            }
        }
        return icons;
    }


    return <Container sx={{ textAlign: 'center' }}>
        <title>{r.data.list_info.list_name}</title>
        <H2>
            {r.data.list_info.list_name} - {r.data.list_info.reader_name} (<span id="book_num">{r.data.list_info.book_num}</span>)
        </H2>
        <Fav id={r.data.list_info.list_id} name={r.data.list_info.list_name} cover={r.data.list_info.list_cover} />
        <Stack direction="row" sx={{ p: 1, "& > p": { m: 1 } }} useFlexGap flexWrap="wrap" justifyContent="center" alignItems="center" color="text.primary">
            {r.data.list_info.list_introduce.split("\n").map((l) => <p key={l}>{l}</p>)}
        </Stack>

        {r.data.book_list.length == 0 && <H2 sx={{ backgroundColor: "error.main", color: "error.contrastText" }}>
            <WarningAmberIcon />
            什么都没有了呢,5秒后返航
            <Back time={5000}></Back>
        </H2>}

        <Grid container spacing={2} sx={{ p: 1 }} alignItems="center" justifyContent="center">
            {r.data.book_list.map((e) => <Grid item xs={6} md={3} key={e.book_id}>
                <BookCard book={e} db={db} />
            </Grid>)}
        </Grid>
        <PaginationTotalElement currentUri={`/booklists/${id}`} pageShow={page} totalSearch={parseInt(r.data.list_info.book_num)} />
    </Container>
}