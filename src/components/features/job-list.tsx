"use client";

import { useState, useEffect } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, Briefcase, MapPin, Building2, ExternalLink, Lock, X } from "lucide-react";
import Link from "next/link";
import { useDebounce } from "@/hooks/useDebounce";

// --- Types ---
interface Job {
    id: string;
    title: string;
    link: string;
    snippet: string;
    tag: string;
    createdAt: string;
    updatedAt: string;
}

interface JobsResponse {
    jobs: Job[];
    nextCursor?: string;
}

interface JobListProps {
    isPublic?: boolean; // If true, limit to 5 and show CTA
}

export default function JobList({ isPublic = false }: JobListProps) {
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { ref, inView } = useInView();

    // Check if user is logged in
    useEffect(() => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");
            setIsLoggedIn(!!token);
        }
    }, []);

    // Fetch job tags for chips
    const { data: tagsData } = useQuery({
        queryKey: ["jobTags"],
        queryFn: async () => {
            const response = await api.get("/jobs/tags");
            const tags = response.data?.data?.tags || [];
            return tags as string[];
        },
    });

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
        error,
    } = useInfiniteQuery({
        queryKey: ["jobs", selectedTag, isPublic],
        queryFn: async ({ pageParam }) => {
            try {
                const params: Record<string, string> = {};
                if (pageParam) params.cursor = pageParam as string;
                if (selectedTag) params.tag = selectedTag;

                const response = await api.get("/jobs", { params });
                console.log("Jobs API Response:", response.data);
                return response.data.data as JobsResponse;
            } catch (err: any) {
                // For public view, treat 403 and rate limit errors as successful responses
                // This allows us to show the registration modal instead of an error
                if (isPublic && (err?.response?.status === 403 || err?.response?.status === 429)) {
                    console.log("Rate limit or auth error in public view, showing available jobs");
                    // Return whatever jobs we have (empty array if none)
                    return { jobs: [], nextCursor: undefined } as JobsResponse;
                }
                // For other errors or authenticated view, throw the error normally
                throw err;
            }
        },
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage: JobsResponse) => {
            if (!lastPage.jobs || lastPage.jobs.length === 0) return undefined;
            return lastPage.jobs[lastPage.jobs.length - 1].id;
        },
    });

    const isRestricted = isPublic && !isLoggedIn;

    useEffect(() => {
        if (inView && hasNextPage && !isRestricted) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage, isRestricted]);

    const jobs = data?.pages.flatMap((page) => page.jobs) || [];

    // If logged in, show all jobs (infinite scroll). If public and not logged in, limit to 5.
    const displayJobs = isRestricted ? jobs.slice(0, 5) : jobs;

    const handleChipClick = (tag: string) => {
        setSelectedTag(selectedTag === tag ? null : tag);
    };

    const RestrictedModal = (
        <div className="relative mt-8">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background z-10 h-20 -top-20 pointer-events-none"></div>
            <Card className="bg-slate-900 text-white border-none overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20"></div>
                <CardContent className="flex flex-col items-center justify-center p-12 text-center space-y-6 relative z-20">
                    <div className="h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-2">
                        <Lock className="h-8 w-8 text-white" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold">Unlock Full Access</h3>
                        <p className="text-slate-300 max-w-md mx-auto text-lg">
                            Register now to view unlimited job listings and find your perfect role today.
                        </p>
                    </div>
                    <Button size="lg" asChild className="h-12 px-8 rounded-full bg-white text-slate-900 hover:bg-slate-100 hover:scale-105 transition-all font-semibold">
                        <Link href="/register">Create Free Account</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Job Tag Chips */}
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-wrap gap-2 justify-center">
                    {tagsData?.map((tag) => (
                        <button
                            key={tag}
                            onClick={() => handleChipClick(tag)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedTag === tag
                                ? "bg-primary text-primary-foreground shadow-md"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                }`}
                        >
                            {tag}
                            {selectedTag === tag && (
                                <X className="inline-block ml-2 h-3 w-3" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Job List */}
            <div className="space-y-4">
                {status === "pending" ? (
                    <div className="flex flex-col items-center justify-center p-12 space-y-4">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        <p className="text-slate-600 font-medium animate-pulse">Finding the best jobs for you...</p>
                    </div>
                ) : status === "error" ? (
                    <div className="text-center p-8 rounded-lg bg-red-50 text-red-600 border border-red-100">
                        <p className="font-medium">Error loading jobs</p>
                        <p className="text-sm mt-1">{(error as any)?.response?.data?.message || error?.message || "Please try again later."}</p>
                    </div>
                ) : displayJobs.length === 0 ? (
                    isRestricted ? (
                        RestrictedModal
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                            <Search className="h-12 w-12 text-slate-300 mb-4" />
                            <h3 className="text-lg font-medium text-slate-900">No jobs found</h3>
                            <p className="text-muted-foreground mt-1">Try selecting a different tag.</p>
                        </div>
                    )
                ) : (
                    <div className="grid gap-4">
                        {displayJobs.map((job, index) => (
                            <Card key={`${job.id}-${index}`} className="group hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                                <CardHeader className="pb-3">
                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                        <div className="space-y-1">
                                            <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                                                <a href={job.link} target="_blank" rel="noopener noreferrer" className="focus:outline-none">
                                                    {job.title}
                                                    <span className="absolute inset-0" aria-hidden="true" />
                                                </a>
                                            </CardTitle>
                                            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Briefcase className="h-3.5 w-3.5" />
                                                    {job.tag}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <a href={job.link} target="_blank" rel="noopener noreferrer" className="relative z-10">
                                                <Button variant="outline" size="sm" className="rounded-full group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-colors">
                                                    Apply Now <ExternalLink className="ml-2 h-3 w-3" />
                                                </Button>
                                            </a>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {job.snippet && (
                                        <p className="text-sm text-slate-600 line-clamp-2">{job.snippet}</p>
                                    )}
                                    <div className="flex items-center justify-end mt-3">
                                        <a href={job.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                                            View Job
                                            <ExternalLink className="h-3.5 w-3.5" />
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {/* Public View CTA - Only show if restricted (public + not logged in) */}
                        {isRestricted && displayJobs.length > 0 && RestrictedModal}

                        {/* Infinite Scroll Loader - Show if NOT restricted */}
                        {!isRestricted && (
                            <div ref={ref} className="flex justify-center p-8">
                                {isFetchingNextPage && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
