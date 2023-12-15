import { Container } from "@mui/material";

export default async function Page({ params }: { params: { word: string[] } }) {
    return <Container sx={{ textAlign: "center", color: "text.primary" }}>
        <h1>正在建设中</h1>
        <div>
            <img src="/assets/images/%E6%86%A7%E6%86%AC%E6%88%90%E7%82%BA%E9%AD%94%E6%B3%95%E5%B0%91%E5%A5%B3-50-3.png" />
        </div>
    </Container>
}