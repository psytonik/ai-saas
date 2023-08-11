"use client";
import React, { FC, useEffect, useState } from "react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SideBar from "@/components/sidebar";
interface MobileSidebarProps {
    apiLimitCount: number;
    isPro: boolean;
}
const MobileSidebar: FC<MobileSidebarProps> = ({
    apiLimitCount,
    isPro = false
}) => {
    const [isMounted, setIsMounted] = useState<boolean>(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);
    if (!isMounted) {
        return null;
    }
    return (
        <div>
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" className="md:hidden" size="icon">
                        <Menu />
                    </Button>
                </SheetTrigger>
                <SheetContent className="p-0" side="left">
                    <SideBar apiLimitCount={apiLimitCount} isPro={isPro} />
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default MobileSidebar;
