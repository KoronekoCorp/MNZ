import { Card, Container, Skeleton } from "@mui/material";
import Grid from '@mui/material/GridLegacy';


export default function Loading() {
    return <Container>
        <Grid container spacing={2} sx={{ p: 1 }} alignItems="center" justifyContent="center">
            {new Array(20).fill(1).map((i, j) => <Grid item xs={6} md={3} key={j}>
                <Card>
                    <Skeleton height="50vh" />
                </Card>
            </Grid>)}
        </Grid>
    </Container>
}