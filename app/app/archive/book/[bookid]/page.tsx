import { UseDB } from '@/Data/UseDB';
import { Card, CardActionArea, CardContent, Container } from "@mui/material";
import Grid from '@mui/material/GridLegacy';
import { Metadata } from 'next';
import { unstable_cache } from 'next/cache';
import Link from 'next/link';


export const metadata: Metadata = {
    title: 'Book Archive',
}


export default async function Page(props: { params: Promise<{ bookid: string }> }) {
    const params = await props.params;

    const [db, db_n] = UseDB()
    const b = await unstable_cache(async () => db.Bookchaps(params.bookid),
        [`${db_n}_Catalog_${params.bookid}`], { revalidate: 7200, tags: [`${db_n}_Catalog_${params.bookid}`] })()

    return <Container>
        <Grid container spacing={2} sx={{ p: 1 }} alignItems="center" justifyContent="center">
            {b.map((c) => <Grid item xs={6} md={3} key={c.chapter_id}>
                <Card>
                    <CardActionArea LinkComponent={Link} href={`/archive/chap/${params.bookid}/${c.chapter_id}`}>
                        <CardContent>
                            {c.chapter_id}
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>)}
        </Grid>
    </Container>
}