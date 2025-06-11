import { UseDB } from "@/Data/UseDB"
import { H1 } from "@/components/H2"
import { R } from "@/components/push"
import Container from "@mui/material/Container"
import { revalidateTag } from "next/cache"


export default async function Page(props: { params: Promise<{ chapid: string }> }) {
    const params = await props.params;
    const [db, db_n] = UseDB()
    revalidateTag(`${db_n}_shChap_${params.chapid}`)
    return <R url={`/shchap/${params.chapid}`}>
        <Container sx={{ textAlign: "center", mt: "20vh", color: "text.primary" }}>
            <H1 text="Cache Clearing" />
        </Container>
    </R>
}