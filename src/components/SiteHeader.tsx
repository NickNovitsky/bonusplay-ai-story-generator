import Image from 'next/image';
import { Container, Grid, Link, Typography } from "@mui/material";

function SiteHeader() {
    return (
    
    <Container sx={{}}>
        <Grid container py={8}>
            <Grid>
                <Link href="/" sx={{ color: "#111927"}}>
                    <Grid container alignItems="center">
                        <Image src="/bonusplay-logo.svg" alt="BonusPlay Logo" width={34} height={34} />
                        <Typography>BonusPlay</Typography>
                    </Grid>
                </Link>
            </Grid>
            <Grid size="grow" sx={{ textAlign: "right" }}>
                <Link href="/support">Support</Link>
                <Link href="/affiliate">Affiliate</Link>
            </Grid>
        </Grid>
    </Container>
    
    );
}

export default SiteHeader;