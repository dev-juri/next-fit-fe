"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, User, Sparkles } from "lucide-react";

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        if (!token) {
            router.push("/login");
        }
    }, [router]);

    if (!isMounted) return null;

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        router.push("/login");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-lg shadow-primary/30">
                            <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Next Fit</span>
                    </Link>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center text-sm text-muted-foreground">
                            <User className="mr-2 h-4 w-4" />
                            User
                        </div>
                        <Button variant="outline" size="sm" onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            <main className="flex-1 container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
}
