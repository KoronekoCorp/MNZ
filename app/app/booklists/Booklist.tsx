import { BookCard } from "@/components/AutoBookCard";
import { H2 } from "@/components/H2";
import PaginationTotalElement from '@/components/Pagination';
import { Back } from "@/components/push";
import { UseAPI } from "@/Data/Use";
import { UseDB } from "@/Data/UseDB";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Tooltip } from "@mui/material";
import Container from "@mui/material/Container";
import Grid from '@mui/material/GridLegacy'
import Stack from "@mui/material/Stack";
import { notFound } from "next/navigation";
import { Fav } from "./client";

export default async function Booklist({ id, page }: { id: number, page: number }) {
    const a = await UseAPI()
    const r = await a.booklist(id, page)
    if (r.code != "100000") { notFound() }

    const [db, db_n] = UseDB()

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
                <Tooltip title={e.book_comment}>
                    <BookCard book={e} db={db} />
                </Tooltip>
            </Grid>)}
        </Grid>
        <PaginationTotalElement currentUri={`/booklists/${id}`} pageShow={page} totalSearch={parseInt(r.data.list_info.book_num)} />
    </Container>
}