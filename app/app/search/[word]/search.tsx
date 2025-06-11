import { BookCard } from '@/components/AutoBookCard';
import { H2 } from '@/components/H2';
import { PaginationElement } from '@/components/Pagination';
import { Back, R } from '@/components/push';
import { UseAPI } from "@/Data/Use";
import { UseDB } from "@/Data/UseDB";
import SearchIcon from '@mui/icons-material/Search';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Container } from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import { Metadata } from 'next';



export const metadata: Metadata = {
    title: '搜索',
}

export default async function Search({ search_word, page }: { search_word: string, page: number }) {
    const word = decodeURIComponent(search_word)

    //BUG.md.1
    if (word.includes("book/")) {
        return <R url={`/book/${word.split("/").pop()}`} />
    }

    const a = await UseAPI()
    const r = await a.search(word, page)

    const [db, db_n] = UseDB()

    return <Container sx={{ textAlign: 'center' }}>
        <title>{`${word}的搜索结果`}</title>
        <H2>
            <SearchIcon />{word}
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
        <PaginationElement currentUri={`/search/${word}`} pageShow={page} end={r.data.book_list.length < 10} />
    </Container>
}