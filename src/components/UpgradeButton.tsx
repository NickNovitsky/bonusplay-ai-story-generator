"use client";

import { createCheckoutSession } from "@/actions/stripe";
import Button from "@mui/material/Button";
import { useState } from "react";

type ButtonParams = {
    id: string
}

function UpgradeButton({id} : ButtonParams) {

    const [loading, setLoading] = useState(false);

    const handleUpgrade = async () => {
        if (loading) return;
        setLoading(true);
        const stripeCheckoutSessionUrl = await createCheckoutSession(id);
        if (stripeCheckoutSessionUrl) window.location.href = stripeCheckoutSessionUrl;
    }

    return <Button variant="contained" size="large" onClick={handleUpgrade}>{loading && 'Wait...' || 'Unlock Full Book – $9.99'}</Button>
}

export default UpgradeButton;