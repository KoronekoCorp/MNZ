import { H2 } from "@/components/H2";
import { PaginationElement } from "@/components/Pagination";
import SearchIcon from '@mui/icons-material/Search';
import { Card, Container, Skeleton } from "@mui/material";
import Grid from '@mui/material/GridLegacy';


export default function Loading({ tag, page, }: { tag?: string, page?: number }) {
    return <Container sx={{ textAlign: 'center' }}>
        <title>{decodeURI(tag ?? "")}</title>
        <H2>
            <SearchIcon />{decodeURI(tag ?? "")}
        </H2>
        <Grid container spacing={2} sx={{ p: 1 }} alignItems="center" justifyContent="center">
            {new Array(12).fill(1).map((i, j) => <Grid item xs={6} md={3} key={j}>
                <Card>
                    <Skeleton height="50vh" />
                </Card>
            </Grid>)}
        </Grid>
        {page && <PaginationElement currentUri={`/tag/${tag}`} pageShow={page} />}
    </Container>
}