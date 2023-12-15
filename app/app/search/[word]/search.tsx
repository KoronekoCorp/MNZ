import { unstable_cache } from 'next/cache'
import { UseAPI } from "@/Data/Use";
import { UseDB } from "@/Data/UseDB"
import Link from 'next/link'
import { Metadata } from 'next'
import { UserchapInfo } from "@/Data/DataType"
import { R, Back } from '@/components/push';
import { Container, Grid } from '@mui/material';
import { H2 } from '@/components/H2';
import { BookCard } from '@/components/AutoBookCard';
import SearchIcon from '@mui/icons-material/Search';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { PaginationElement } from '@/components/Pagination';


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
    const Userchap = async ({ bookid }: { bookid: number | string }) => {
        let userchap: UserchapInfo[]
        let error: JSX.Element | undefined
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