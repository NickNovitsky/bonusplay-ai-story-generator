"use client";

import Button from "@mui/material/Button";

type ButtonParams = {
    id: string
}

function UpgradeButton({id} : ButtonParams) {

    const handleUpgrade = async () => {
        const res = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bookId: id }),
        });
        const { url } = await res.json();
        window.location.href = url;
    }

    return <Button variant="contained" size="large" onClick={handleUpgrade}>Unlock Full Book – $9.99</Button>
}

export default UpgradeButton;