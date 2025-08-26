import Image from 'next/image';
import { Container, Grid, Link } from "@mui/material";
import NextLink from 'next/link';

function SiteHeader() {
    return (
    
    <Container>
        <Grid container py={8}>
            <Grid>
                <NextLink href="/">
                    <Image src="/bonusplay-logo-full.svg" width={166} height={30} alt="BonusPlay Logo" />
                </NextLink>
            </Grid>
            <Grid size="grow" sx={{ textAlign: "right" }}>
                <Link component={NextLink} variant='body2' ml={1} href="/about" sx={{ textDecoration: 'none', color: '#111927' }}>About</Link>
                <Link component={NextLink} variant='body2' ml={1} href="/support" sx={{ textDecoration: 'none', color: '#111927' }}>Support</Link>
                <Link component={NextLink} variant='body2' ml={1} href="/affiliate" sx={{ textDecoration: 'none', color: '#111927' }}>Affiliate</Link>
            </Grid>
        </Grid>
    </Container>
    
    );
}

export default SiteHeader;