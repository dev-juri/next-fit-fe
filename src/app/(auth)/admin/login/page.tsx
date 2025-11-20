"use client";

import { useState } from "react";
import { useAdminRequestMagicLink } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { mutate: requestMagicLink, isPending, error } = useAdminRequestMagicLink();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        requestMagicLink({ email }, {
            onSuccess: () => {
                setIsSubmitted(true);
            }
        });
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
                    <CardTitle>Admin Login</CardTitle>
                    <CardDescription>
                        Enter your email to receive a magic link.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isSubmitted ? (
                        <div className="text-center text-green-600">
                            <p>Magic link sent! Check your email.</p>
                            <Button variant="link" onClick={() => setIsSubmitted(false)} className="mt-4">
                                Try another email
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Input
                                    type="email"
                                    placeholder="admin@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            {error && (
                                <p className="text-sm text-red-500">
                                    {error.message || "An error occurred"}
                                </p>
                            )}
                            <Button type="submit" className="w-full" disabled={isPending}>
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    "Send Magic Link"
                                )}
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
