import { BookCard } from '@/components/AutoBookCard';
import { H2 } from "@/components/H2";
import { PaginationElement } from '@/components/Pagination';
import { UseAPI } from "@/Data/Use";
import { UseDB } from "@/Data/UseDB";
import AnchorIcon from '@mui/icons-material/Anchor';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { Container, Link } from "@mui/material";
import Grid from '@mui/material/GridLegacy';
import { default as LinkC } from "next/link";
import Head from "./client";

export default async function Page({ type, page }: { type: "hot" | "new" | "top", page: number }) {
    const a = await UseAPI()
    const r = await a.booklists(type, page)

    const [db, db_n] = UseDB()
    return <Container sx={{ textAlign: 'center' }}>
        <Head />
        {r.data.booklists.map((booklist) => {
            return <>
                <H2 key={booklist.list_id}>
                    <Link component={LinkC} href={`/booklists/${booklist.list_id}`}>{booklist.list_name}</Link> {' '}
                    <LibraryBooksIcon /> {booklist.book_num}{' '}
                    <AnchorIcon />{booklist.favor_num}{' '}
                </H2>
                <Grid container spacing={2} sx={{ p: 1 }} alignItems="center" justifyContent="center" key={booklist.list_id}>
                    {booklist.book_info_list.map((e) => <Grid item xs={6} md={3} key={e.book_id}>
                        <BookCard book={e} db={db} />
                    </Grid>)}
                </Grid>
            </>
        })}
        <PaginationElement currentUri={`/booklists/${type}`} pageShow={page} />
    </Container>
}