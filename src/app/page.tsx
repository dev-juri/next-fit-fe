import JobList from "@/components/features/job-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Sparkles, Zap, Target, TrendingUp } from "lucide-react";

import LandingHeader from "@/components/layout/landing-header";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white font-sans selection:bg-primary/20">
      {/* Navbar */}
      <LandingHeader />

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
              <span className="text-slate-900">Find Your </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-violet-600 to-purple-600 animate-gradient">Dream Job</span>
              <br className="hidden md:block" />
              <span className="text-slate-900"> Without the Hassle</span>
            </h1>

            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Our advanced AI-powered scraper aggregates opportunities from top sources, giving you a competitive edge in your job search.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Button size="lg" asChild className="h-14 px-10 rounded-full text-lg bg-gradient-to-r from-primary to-violet-600 shadow-xl shadow-primary/30 transition-all hover:scale-105 hover:shadow-primary/50">
                <Link href="/register">
                  Start Searching Free <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-14 px-10 rounded-full text-lg border-slate-200 hover:bg-slate-50 hover:text-slate-900">
                <Link href="#jobs">View Latest Jobs</Link>
              </Button>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center justify-center gap-4 max-w-3xl mx-auto">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-slate-700">Real-time Updates</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-slate-700">Smart Filtering</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-slate-700">Top Sources</span>
              </div>
            </div>
          </div>
        </section>

        {/* Job List Section */}
        <section id="jobs" className="py-24 bg-white border-t border-slate-200">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold tracking-tight mb-4 text-slate-900">Latest Opportunities</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Browse through our curated list of the most recent job postings. Register to unlock full access and advanced filters.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <JobList isPublic={true} />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Next Fit. Built for efficiency.</p>
        </div>
      </footer>
    </div>
  );
}
