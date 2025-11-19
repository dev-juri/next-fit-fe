import JobList from "@/components/features/job-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Sparkles, Zap, Target, TrendingUp } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 font-sans selection:bg-primary/20">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-950/60">
        <div className="container mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-lg shadow-primary/30">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">Next Fit</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild className="font-medium text-slate-600 dark:text-slate-300 hover:text-primary">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild className="rounded-full px-6 bg-gradient-to-r from-primary to-violet-600 shadow-lg shadow-primary/30 transition-all hover:shadow-primary/50 hover:scale-105">
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-32 md:pt-32 md:pb-48">
          {/* Enhanced Background Gradients */}
          <div className="absolute inset-0 -z-10 h-full w-full">
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] opacity-60"></div>
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[100px] opacity-60"></div>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary mb-8 backdrop-blur-sm shadow-lg shadow-primary/10">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              New jobs added every hour
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              <span className="text-slate-900 dark:text-white">Find Your </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-violet-600 to-purple-600 animate-gradient">Dream Job</span>
              <br className="hidden md:block" />
              <span className="text-slate-900 dark:text-white"> Without the Hassle</span>
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Our advanced AI-powered scraper aggregates opportunities from top sources, giving you a competitive edge in your job search.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Button size="lg" asChild className="h-14 px-10 rounded-full text-lg bg-gradient-to-r from-primary to-violet-600 shadow-xl shadow-primary/30 transition-all hover:scale-105 hover:shadow-primary/50">
                <Link href="/register">
                  Start Searching Free <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-14 px-10 rounded-full text-lg border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white">
                <Link href="#jobs">View Latest Jobs</Link>
              </Button>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center justify-center gap-4 max-w-3xl mx-auto">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Real-time Updates</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Smart Filtering</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Top Sources</span>
              </div>
            </div>
          </div>
        </section>

        {/* Job List Section */}
        <section id="jobs" className="py-24 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold tracking-tight mb-4 text-slate-900 dark:text-white">Latest Opportunities</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Browse through our curated list of the most recent job postings. Register to unlock full access and advanced filters.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <JobList isPublic={true} />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12">
        <div className="container mx-auto px-4 text-center text-slate-500 dark:text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Next Fit. Built for efficiency.</p>
        </div>
      </footer>
    </div>
  );
}
