import JobList from "@/components/features/job-list";

export default function UserDashboardPage() {
    return (
        <div className="space-y-6 max-w-4xl mx-auto h-full flex flex-col">
            <div className="flex-shrink-0">
                <h1 className="text-3xl font-bold">Job Listings</h1>
                <p className="text-muted-foreground">
                    Browse and search through all available job opportunities.
                </p>
            </div>

            <JobList isPublic={false} />
        </div>
    );
}
