"use client";

import { useState } from "react";
import { useUserLogin } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { mutate: login, isPending, error } = useUserLogin();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login({ email, password });
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
            <div className="mb-8 flex items-center gap-2">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-lg shadow-primary/30">
                    <Sparkles className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Next Fit</span>
            </div>
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>
                        Welcome back! Please login to your account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && (
                            <p className="text-sm text-red-500">
                                {(error as any)?.response?.data?.message || error.message || "Invalid credentials"}
                            </p>
                        )}
                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Logging in...
                                </>
                            ) : (
                                "Login"
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center">
                    <p className="text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link href="/register" className="text-primary hover:underline">
                            Register
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
