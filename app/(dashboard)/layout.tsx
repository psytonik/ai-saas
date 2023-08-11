import React, { FC, ReactNode } from "react";
import Navbar from "@/components/navbar";
import SideBar from "@/components/sidebar";
import { getApiLimitCount } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

interface DashboardLayoutProps {
    children: ReactNode;
}
const DashboardLayout: FC<DashboardLayoutProps> = async ({ children }) => {
    const apiLimitCount = await getApiLimitCount();
    const isPro = await checkSubscription();
    return (
        <div className="h-full relative">
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 bg-gray-900">
                <SideBar apiLimitCount={apiLimitCount} isPro={isPro} />
            </div>
            <main className="md:pl-72">
                <Navbar />
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;
