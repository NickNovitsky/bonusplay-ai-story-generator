import { Box, Container, Grid, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

export default function SiteFooter() {
    return <Box sx={{ backgroundColor: '#EFF2F4' }} p={10}>
        <Container>
            <Grid container>
                <Grid size={6}>
                    <Image src="/bonusplay-logo-full.svg" width={166} height={30} alt="BonusPlay Logo" />
                </Grid>
                <Grid size={2}>
                    <Typography variant="caption">Help and Information</Typography>
                    <Link href="/support"><Typography>Support</Typography></Link>
                    <Link href="/delivery"><Typography>Delivery</Typography></Link>
                    <Link href="/sitemap.xml"><Typography>Sitemap</Typography></Link>
                </Grid>
                <Grid size={2}>
                    <Typography variant="caption">About BonusPlay</Typography>
                    <Link href="/story"><Typography>Our Story</Typography></Link>
                    <Link href="/affiliate"><Typography>Affiliate Program</Typography></Link>
                    <Link href="/refer"><Typography>Refer a Friend</Typography></Link>
                </Grid>
                <Grid size={2}>
                    <Typography variant="caption">Site Use</Typography>
                    <Link href="/privacy"><Typography>Privacy Policy</Typography></Link>
                    <Link href="/terms"><Typography>Terms of Service</Typography></Link>
                    <Link href="/returns"><Typography>Returns Policy</Typography></Link>
                </Grid>
            </Grid>
            <Typography variant="caption">© Copyright BonusTrade Interactive Ltd. All rights reserved.</Typography>
        </Container>
    </Box>
}