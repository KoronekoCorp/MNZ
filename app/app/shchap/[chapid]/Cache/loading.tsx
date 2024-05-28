import { H1 } from "@/components/H2";
import { Container } from "@mui/material";

export default function Page() {
    return <Container sx={{ textAlign: "center", mt: "20vh", color: "text.primary" }}>
        <H1 text="Cache Clearing" />
    </Container>
}