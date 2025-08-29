'use client';

import { generateImage } from "@/actions/playground.image.action";
import { Container, TextField, Typography, CardMedia, Button, FormControl, RadioGroup, FormControlLabel, Radio, FormLabel } from "@mui/material"
import { useActionState } from "react";

export default function Page() {

    const [state, formAction, pending] = useActionState(generateImage, { url: '', model: '', prompt: ''});

    return (
        <Container className="flex gap-6">
            <form className="grow" action={formAction}>
                <TextField multiline rows={10} fullWidth placeholder="Enter prompt for image" className="block" sx={{ mb: 2 }} name="prompt" />
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <FormLabel>Model</FormLabel>
                    <RadioGroup row name="model" defaultValue="dall-e-3">
                        <FormControlLabel value="dall-e-3" control={<Radio />} label="Dall-E 3" />
                        <FormControlLabel value="gpt-image-1" control={<Radio />} label="GPT Image 1" />
                    </RadioGroup>
                </FormControl>
                <Button variant="outlined" type="submit" disabled={pending}>Submit</Button>
            </form>
            { (state.url === '' || pending) && <Container className="grid place-content-center bg-gray-100" sx={{ width: 512, height: 512 }}>
                <Typography textAlign="center">{ (state.url === '' && !pending) && 'Generated image will appear here' || 'Loading...'}</Typography></Container>}
            { state.url !== '' && !pending && <Container sx={{ width: 512, height: 512 }}><CardMedia component="img" image={state.url} sx={{height: 512, width: 512, marginBottom: 1}} alt="Book cover" />
                <Typography fontSize={14}>{ state.prompt } ({ state.model })</Typography></Container>}
        </Container>
    )
}