import { H2 } from "@/components/H2"
import { UseAPI } from "@/Data/Use"
import Container from "@mui/material/Container"
import { notFound } from "next/navigation"
import BarChartIcon from '@mui/icons-material/BarChart';
import { Chart } from "./client";

export default async function Page(props: { params: Promise<{ bookid: string }> }) {
    const params = await props.params;

    const a = await UseAPI()
    const r = await a.bookinfo(params.bookid)
    if (r.code !== '100000') {
        notFound()
    }
    const chaps = await a.catalog(params.bookid)

    return <Container>
        <title>{`《${r.data.book_info.book_name}》 – ${r.data.book_info.author_name}`}</title>
        <H2 sx={{ backgroundColor: "info.main", color: "info.contrastText" }}>
            <BarChartIcon />《{r.data.book_info.book_name}》 – {r.data.book_info.author_name}
        </H2>
        <Chart Catalog={chaps} />
    </Container>
}