"use client";
import React, { FC, useState } from "react";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-hot-toast";

interface SubscriptionButtonProps {
    isPro: boolean;
}
const SubscriptionButton: FC<SubscriptionButtonProps> = ({ isPro }) => {
    const [loading, setLoading] = useState(false);
    const onClick = async () => {
        try {
            setLoading(true);
            const response: AxiosResponse = await axios.get("/api/stripe");
            window.location.href = response.data.url;
        } catch (e) {
            if (e instanceof AxiosError || e instanceof Error)
                toast.error(e.message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <Button
            variant={isPro ? "default" : "premium"}
            disabled={loading}
            onClick={onClick}
        >
            {isPro ? "Manage Subscription" : "Upgrade"}
            {!isPro && <Zap className="w-4 h-4 ml-2 fill-white" />}
        </Button>
    );
};

export default SubscriptionButton;
