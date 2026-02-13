import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Scale, AlertTriangle, FileText, Globe } from "lucide-react"

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-3xl space-y-8">

                {/* Header */}
                <div className="flex items-center space-x-4 mb-8">
                    <Link href="/">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
                </div>

                <div className="prose dark:prose-invert max-w-none space-y-8">
                    <p className="lead text-xl text-muted-foreground">
                        By using Subscription Slayer, you agree to these terms. Ideally, read them, but here is the plain English version.
                    </p>

                    <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 p-6 rounded-xl my-6">
                        <div className="flex items-start">
                            <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-500 mr-3 mt-1" />
                            <div>
                                <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-200 mb-2">Crucial Disclaimer</h3>
                                <p className="text-yellow-700 dark:text-yellow-300/80 text-sm">
                                    Subscription Slayer is a <strong>helper tool</strong>, not a financial advisor. We use pattern matching to find subscriptions, but we might miss some or misidentify others. <strong>Always verify</strong> your own bank statements before making financial decisions.
                                </p>
                            </div>
                        </div>
                    </div>

                    <section className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Scale className="h-5 w-5 text-primary" />
                            <h2 className="text-2xl font-bold m-0">1. Usage & License</h2>
                        </div>
                        <p className="text-muted-foreground">
                            Subscription Slayer is free, open-source software provided for personal use. You may use it to analyze your own financial statements. You may not use it to process data for others commercially without permission.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            <h2 className="text-2xl font-bold m-0">2. No Warranties ("As Is")</h2>
                        </div>
                        <p className="text-muted-foreground">
                            This software is provided "as is", without warranty of any kind, express or implied. We do not guarantee that the tool will detect every subscription or that the cost calculations are 100% accurate (currencies fluctuation, hidden fees, etc.).
                        </p>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Globe className="h-5 w-5 text-primary" />
                            <h2 className="text-2xl font-bold m-0">3. Third-Party Links</h2>
                        </div>
                        <p className="text-muted-foreground">
                            Our "Kill Switch" features link to third-party cancellation pages (like Netflix, Spotify). We are not affiliated with these companies. When you click these links, you leave our app and are subject to their terms and privacy policies.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">4. Limitation of Liability</h2>
                        <p className="text-muted-foreground">
                            In no event shall the developers or contributors be liable for any claim, damages, or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the software.
                        </p>
                        <p className="text-sm text-muted-foreground italic">
                            (Translation: If you forget to cancel a subscription because the app didn't remind you, we aren't liable for the charge.)
                        </p>
                    </section>

                    <div className="pt-8 border-t">
                        <p className="text-sm text-muted-foreground">
                            Last updated: February 2026<br />
                            Contact: aryapfir on GitHub
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
