"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Play, Trash2 } from "lucide-react";

// --- Types ---
interface JobTitle {
    id: number;
    title: string;
    lastScrapedAt?: string;
}

interface JobSource {
    id: number;
    name: string;
    url: string;
}

// --- Helper Functions ---
const canScrape = (lastScrapedAt?: string): boolean => {
    if (!lastScrapedAt) return true;
    const lastScraped = new Date(lastScrapedAt);
    const now = new Date();
    const hoursDiff = (now.getTime() - lastScraped.getTime()) / (1000 * 60 * 60);
    return hoursDiff >= 24;
};

// --- Hooks ---

const useJobTitles = () => {
    return useQuery({
        queryKey: ["jobTitles"],
        queryFn: async () => {
            const response = await api.get("/jobs/titles");
            console.log("Job Titles Response:", response.data);
            const data = response.data?.data?.data?.jobTitles || [];
            return data as JobTitle[];
        },
    });
};

const useJobSources = () => {
    return useQuery({
        queryKey: ["jobSources"],
        queryFn: async () => {
            const response = await api.get("/jobs/sources");
            console.log("Job Sources Response:", response.data);
            const data = response.data?.data?.data?.jobSources || [];
            return data as JobSource[];
        },
    });
};

const useAddJobTitle = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (title: string) => {
            return api.post("/jobs/titles", { title });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["jobTitles"] });
        },
    });
};

const useAddJobSource = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: { name: string; url: string }) => {
            return api.post("/jobs/sources", data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["jobSources"] });
        },
    });
};

const useDeleteJobTitle = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            return api.delete(`/jobs/titles/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["jobTitles"] });
        },
    });
};

const useDeleteJobSource = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            return api.delete(`/jobs/sources/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["jobSources"] });
        },
    });
};

const useTriggerScrape = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            return api.post("/jobs/scrape", { jobId: id });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["jobTitles"] });
        },
    });
};

export default function AdminDashboardPage() {
    const [jobTitle, setJobTitle] = useState("");
    const [sourceName, setSourceName] = useState("");
    const [sourceUrl, setSourceUrl] = useState("");

    const { data: jobTitles, isLoading: isLoadingTitles } = useJobTitles();
    const { data: jobSources, isLoading: isLoadingSources } = useJobSources();

    const { mutate: addTitle, isPending: isAddingTitle, isSuccess: titleSuccess } = useAddJobTitle();
    const { mutate: addSource, isPending: isAddingSource, isSuccess: sourceSuccess } = useAddJobSource();
    const { mutate: deleteTitle, isPending: isDeletingTitle } = useDeleteJobTitle();
    const { mutate: deleteSource, isPending: isDeletingSource } = useDeleteJobSource();
    const { mutate: triggerScrape, isPending: isScraping } = useTriggerScrape();
    const [scrapingId, setScrapingId] = useState<number | null>(null);

    const handleAddTitle = (e: React.FormEvent) => {
        e.preventDefault();
        addTitle(jobTitle, {
            onSuccess: () => setJobTitle(""),
        });
    };

    const handleAddSource = (e: React.FormEvent) => {
        e.preventDefault();
        addSource({ name: sourceName, url: sourceUrl }, {
            onSuccess: () => {
                setSourceName("");
                setSourceUrl("");
            },
        });
    };

    const handleScrape = (id: number) => {
        setScrapingId(id);
        triggerScrape(id, {
            onSettled: () => setScrapingId(null),
        });
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Add Job Title */}
                <Card>
                    <CardHeader>
                        <CardTitle>Add Job Title</CardTitle>
                        <CardDescription>Add a new job title to track.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAddTitle} className="space-y-4">
                            <Input
                                placeholder="e.g. Software Engineer"
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                                required
                            />
                            <Button type="submit" disabled={isAddingTitle}>
                                {isAddingTitle ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                                Add Title
                            </Button>
                            {titleSuccess && <p className="text-sm text-green-600">Job title added!</p>}
                        </form>
                    </CardContent>
                </Card>

                {/* Add Job Source */}
                <Card>
                    <CardHeader>
                        <CardTitle>Add Job Source</CardTitle>
                        <CardDescription>Add a new source for scraping.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAddSource} className="space-y-4">
                            <Input
                                placeholder="Source Name (e.g. LinkedIn)"
                                value={sourceName}
                                onChange={(e) => setSourceName(e.target.value)}
                                required
                            />
                            <Input
                                placeholder="URL"
                                value={sourceUrl}
                                onChange={(e) => setSourceUrl(e.target.value)}
                                required
                            />
                            <Button type="submit" disabled={isAddingSource}>
                                {isAddingSource ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                                Add Source
                            </Button>
                            {sourceSuccess && <p className="text-sm text-green-600">Job source added!</p>}
                        </form>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Job Titles List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Job Titles</CardTitle>
                        <CardDescription>Manage tracked job titles.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoadingTitles ? (
                            <div className="flex justify-center p-4">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : jobTitles?.length === 0 ? (
                            <p className="text-muted-foreground italic">No job titles found.</p>
                        ) : (
                            <div className="space-y-4">
                                {jobTitles?.map((title) => (
                                    <div key={title.id} className="flex items-center justify-between p-3 border rounded-lg bg-slate-50">
                                        <span className="font-medium">{title.title}</span>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleScrape(title.id)}
                                                disabled={scrapingId === title.id || !canScrape(title.lastScrapedAt)}
                                            >
                                                {scrapingId === title.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <>
                                                        <Play className="mr-2 h-3 w-3" />
                                                        Scrape
                                                    </>
                                                )}
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                onClick={() => deleteTitle(title.id)}
                                                disabled={isDeletingTitle}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Job Sources List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Job Sources</CardTitle>
                        <CardDescription>Manage scraping sources.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoadingSources ? (
                            <div className="flex justify-center p-4">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : jobSources?.length === 0 ? (
                            <p className="text-muted-foreground italic">No job sources found.</p>
                        ) : (
                            <div className="space-y-4">
                                {jobSources?.map((source) => (
                                    <div key={source.id} className="flex items-center justify-between p-3 border rounded-lg bg-slate-50">
                                        <div className="flex flex-col space-y-1">
                                            <span className="font-medium">{source.name}</span>
                                            <span className="text-xs text-muted-foreground truncate">{source.url}</span>
                                        </div>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                            onClick={() => deleteSource(source.id)}
                                            disabled={isDeletingSource}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
