'use client'

import { useState } from 'react';
import { Button, TextField, Typography, Stack, styled, Container, Grid, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

import { BookPreview } from '@/components/BookPreview';
import BookOutline from '@/components/BookOutline';

const ColoredText = styled('span')(({ theme }) => ({
  color: theme.palette.primary.main,
}));

export default function HomePage() {

    const [idea, setIdea] = useState("");
    const [deliveryFormat, setDeliveryFormat] = useState("pdf");
    const [layout, setLayout] = useState("portrait");
    const [artStyle, setArtStyle] = useState("watercolor-illustration");
    const [mood, setMood] = useState("whimsical");
    const [lighting, setLighting] = useState("soft-natural-light");
    const [colorPalette, setColorPalette] = useState("vibrant-playful");
    const [bookPreviewVisible, showBookPreview] = useState(false);
    const [bookOutlineVisible, showBookOutline] = useState(false);

    const bookCreationOptions = { idea, deliveryFormat, layout, artStyle, mood, lighting, colorPalette }

    if (bookPreviewVisible) return <BookPreview bookCreationOptions={bookCreationOptions} />

    if (bookOutlineVisible) return <BookOutline idea={idea} />

    return (
        <Container sx={{border: 'solid 1px #E4E4E7', borderRadius: '16px', backgroundColor: '#f9f9f9'}} className="py-10 px-10">
            <Stack sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto'}}>
                <Typography variant="h1" sx={{fontSize: "64px", fontWeight: 600, color: "#09090B"}} gutterBottom>
                    <ColoredText>Imagine</ColoredText> your own book from just one idea...
                </Typography>

                <TextField
                    label="What's your story idea?"
                    required
                    multiline
                    minRows={5}
                    fullWidth
                    value={idea}
                    onChange={e => setIdea(e.target.value)}
                    sx={{ mt: 4, backgroundColor: 'white', mb: 5 }}
                    className="shadow-lg rounded-lg"
                />

                <Grid container p={3} spacing={3} className="shadow-lg bg-white rounded-lg">
                    <Grid size={2}>
                        <FormControl fullWidth>
                            <InputLabel>Delivery Format</InputLabel>
                            <Select label="Delivery Format" value={deliveryFormat} onChange={(e) => setDeliveryFormat(e.target.value)}>
                                <MenuItem value="pdf">Digital Download (PDF)</MenuItem>
                                <MenuItem value="print" disabled>Printed and Posted (coming soon)</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={2}>
                        <FormControl fullWidth>
                            <InputLabel>Layout</InputLabel>
                            <Select label="Layout" value={layout} onChange={(e) => setLayout(e.target.value)}>
                                <MenuItem value="portrait">Portrait</MenuItem>
                                <MenuItem value="landscape">Landscape</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={2}>
                        <FormControl fullWidth>
                            <InputLabel>Art Style</InputLabel>
                            <Select label="Art Style" value={artStyle} onChange={(e) => setArtStyle(e.target.value)}>
                                <MenuItem value="watercolor-illustration">Watercolor Illustration</MenuItem>
                                <MenuItem value="flat-vector-art">Flat Vector Art</MenuItem>
                                <MenuItem value="pencil-sketch">Pencil Sketch</MenuItem>
                                <MenuItem value="cartoon-style">Cartoon Style</MenuItem>
                                <MenuItem value="cut-paper-collage">Cut Paper Collage</MenuItem>
                                <MenuItem value="pastel-drawing">Pastel Drawing</MenuItem>
                                <MenuItem value="3d-rendered">3D Rendered Style</MenuItem>
                                <MenuItem value="ink-and-wash">Ink & Wash</MenuItem>
                                <MenuItem value="digital-art">Digital Art</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={2}>
                        <FormControl fullWidth>
                            <InputLabel>Mood</InputLabel>
                            <Select label="Mood" value={mood} onChange={(e) => setMood(e.target.value)}>
                                <MenuItem value="whimsical">Whimsical</MenuItem>
                                <MenuItem value="joyful">Joyful</MenuItem>
                                <MenuItem value="cozy">Cozy</MenuItem>
                                <MenuItem value="adventurous">Adenturous</MenuItem>
                                <MenuItem value="magical">Magical</MenuItem>
                                <MenuItem value="mysterious">Mysterious</MenuItem>
                                <MenuItem value="heartwarming">Heartwarming</MenuItem>
                                <MenuItem value="funnysilly">Funny/Silly</MenuItem>
                                <MenuItem value="calm">Calm</MenuItem>
                                <MenuItem value="uplifting">Uplifting</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={2}>
                        <FormControl fullWidth>
                            <InputLabel>Lighting</InputLabel>
                            <Select label="Lighting" value={lighting} onChange={(e) => setLighting(e.target.value)}>
                                <MenuItem value="soft-natural-light">Soft Natural Light</MenuItem>
                                <MenuItem value="bright-daylight">Bright Daylight</MenuItem>
                                <MenuItem value="warm-evening-glow">Warm Evening Glow</MenuItem>
                                <MenuItem value="diffused-studio-light">Diffused Studio Light</MenuItem>
                                <MenuItem value="dreamy-glow">Dreamy Glow</MenuItem>
                                <MenuItem value="candlelight">Candlelight</MenuItem>
                                <MenuItem value="moonlight-nighttime">Moonlight/Nighttime</MenuItem>
                                <MenuItem value="overcast-misty">Overcast/Misty</MenuItem>
                                <MenuItem value="high-contrast">High Contrast Lighting</MenuItem>
                                <MenuItem value="neon-futuristic">Neon/Futuristic Light</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={2}>
                        <FormControl fullWidth>
                            <InputLabel>Color Palette</InputLabel>
                            <Select label="Color Palette" value={colorPalette} onChange={(e) => setColorPalette(e.target.value)}>
                                <MenuItem value="vibrant-playful">Vibrant & Playful</MenuItem>
                                <MenuItem value="pastel-tones">Pastel Tones</MenuItem>
                                <MenuItem value="earthy-tones">Earthy Tones</MenuItem>
                                <MenuItem value="monochrome-with-accents">Monochrome with Accents</MenuItem>
                                <MenuItem value="rainbow-colors">Rainbow Colors</MenuItem>
                                <MenuItem value="primary-colors">Primary Colors</MenuItem>
                                <MenuItem value="cool-blues-greens">Cool Blues and Greens</MenuItem>
                                <MenuItem value="warm-reds-yellows">Warm Reds & Yellows</MenuItem>
                                <MenuItem value="sepia-vintage">Sepia / Vintage</MenuItem>
                                <MenuItem value="muted-tones">Muted Tones</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                <Stack direction="row" spacing={2} justifyContent="right" sx={{ mt: 4 }}>
                    <Button variant="outlined" onClick={() => showBookPreview(true)}>🔮 Surprise Me</Button>
                    <Button variant="contained" onClick={() => showBookOutline(true)}>🎛️ Let Me Guide It</Button>
                </Stack>
            </Stack>
        </Container>
    )
}