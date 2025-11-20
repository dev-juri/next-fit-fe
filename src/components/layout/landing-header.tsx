"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles, User } from "lucide-react";
import { useEffect, useState } from "react";

export default function LandingHeader() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");
            setIsLoggedIn(!!token);
        }
    }, []);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto px-4 h-16 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-lg shadow-primary/30">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Next Fit</span>
                </div>
                <div className="flex items-center gap-4">
                    {isLoggedIn ? (
                        <Button asChild className="rounded-full px-6 bg-gradient-to-r from-primary to-violet-600 shadow-lg shadow-primary/30 transition-all hover:shadow-primary/50 hover:scale-105">
                            <Link href="/dashboard">
                                <User className="mr-2 h-4 w-4" />
                                Dashboard
                            </Link>
                        </Button>
                    ) : (
                        <>
                            <Button variant="ghost" asChild className="font-medium text-slate-600 hover:text-primary">
                                <Link href="/login">Log in</Link>
                            </Button>
                            <Button asChild className="rounded-full px-6 bg-gradient-to-r from-primary to-violet-600 shadow-lg shadow-primary/30 transition-all hover:shadow-primary/50 hover:scale-105">
                                <Link href="/register">Get Started</Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
