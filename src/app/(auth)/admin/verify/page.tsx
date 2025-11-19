"use client";

import { useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAdminVerifyMagicLink } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

function VerifyContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const router = useRouter();
    const { mutate: verify, isPending, error } = useAdminVerifyMagicLink();
    const hasVerified = useRef(false);

    useEffect(() => {
        if (token && !hasVerified.current) {
            hasVerified.current = true;
            verify(token);
        } else if (!token) {
            // If no token, redirect back to login
            // router.push("/admin/login");
        }
    }, [token, verify, router]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
            {isPending ? (
                <div className="flex flex-col items-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Verifying your magic link...</p>
                </div>
            ) : error ? (
                <div className="text-center text-red-500">
                    <p>Verification failed.</p>
                    <p className="text-sm">{error.message}</p>
                    <button onClick={() => router.push("/admin/login")} className="mt-4 underline">
                        Back to Login
                    </button>
                </div>
            ) : (
                <div className="text-center">
                    {!token ? "Invalid link." : "Redirecting..."}
                </div>
            )}
        </div>
    );
}

export default function AdminVerifyPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <VerifyContent />
        </Suspense>
    );
}
