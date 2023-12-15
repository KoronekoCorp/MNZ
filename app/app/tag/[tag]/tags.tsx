import { UseAPI } from "@/Data/Use";
import { UseDB } from "@/Data/UseDB"
import { Back } from '@/app/push'
import { Container, Grid } from "@mui/material";
import { H2 } from "@/components/H2";
import { BookCard } from "@/components/AutoBookCard";
import SearchIcon from '@mui/icons-material/Search';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { PaginationElement } from "@/components/Pagination";

export default async function Tags({ Tag, page }: { Tag: string, page: number }) {
    const tag = decodeURI(Tag)
    const a = await UseAPI()
    const r = await a.tag(tag, page)
    const [db, db_n] = UseDB()

    return <Container sx={{ textAlign: 'center' }}>
        <title>{tag}</title>
        <H2>
            <SearchIcon />{tag}
        </H2>
        <Grid container spacing={2} sx={{ p: 1 }} alignItems="center" justifyContent="center">
            {r.data.book_list.map((book) => <Grid item xs={6} md={3} key={book.book_id}>
                <BookCard book={book} db={db} />
            </Grid>)}
        </Grid>
        {r.data.book_list.length == 0 && <H2 sx={{ backgroundColor: "rgb(255 180 180)" }}>
            <WarningAmberIcon />
            什么都没有了呢,5秒后返航
            <Back time={5000}></Back>
        </H2>}
        <PaginationElement currentUri={`/tag/${tag}`} pageShow={page} end={r.data.book_list.length < 10} />
    </Container>
}