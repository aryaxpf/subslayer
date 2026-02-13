import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Shield, Lock, EyeOff, Trash2 } from "lucide-react"

export default function PrivacyPage() {
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
                    <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
                </div>

                <div className="prose dark:prose-invert max-w-none space-y-8">
                    <p className="lead text-xl text-muted-foreground">
                        Your financial data is yours. We don't want it, we don't store it, and we never see it.
                    </p>

                    <div className="grid gap-6 md:grid-cols-2 my-8">
                        <div className="p-6 border rounded-xl bg-card">
                            <Shield className="h-8 w-8 text-primary mb-4" />
                            <h3 className="text-lg font-semibold mb-2">100% Client-Side Processing</h3>
                            <p className="text-muted-foreground text-sm">
                                All analysis happens directly in your browser. Your bank statements never leave your device. We use modern web technologies to process data locally.
                            </p>
                        </div>
                        <div className="p-6 border rounded-xl bg-card">
                            <EyeOff className="h-8 w-8 text-primary mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No Server Storage</h3>
                            <p className="text-muted-foreground text-sm">
                                We have no database for transaction data. Once you close the tab or clear your data, it's gone from our "memory" forever.
                            </p>
                        </div>
                    </div>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">The Core Promise</h2>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li><strong>No Uploads:</strong> When you "upload" a file, it is read by JavaScript running on your computer. It is NOT uploaded to a remote server.</li>
                            <li><strong>No Database:</strong> We do not verify your identity, store your passwords, or keep records of your subscriptions.</li>
                            <li><strong>No Tracking:</strong> We do not track your spending habits or sell your data to advertisers.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">Data Persistence</h2>
                        <p className="text-muted-foreground">
                            For your convenience, we save the <em>results</em> of the analysis (the list of detected subscriptions) to your browser's <strong>Local Storage</strong>.
                        </p>
                        <div className="bg-muted p-4 rounded-lg flex items-start gap-3">
                            <Trash2 className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                            <p className="text-sm">
                                You can clear this data at any time by clicking "Clear Data & Exit" in the dashboard, or by clearing your browser cache.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">Third-Party Services</h2>
                        <p className="text-muted-foreground">
                            We use minimal third-party services to function:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li><strong>Vercel / Cloudflare:</strong> For hosting the static website files.</li>
                            <li><strong>Saweria:</strong> If you choose to donate, you will be redirected to their platform which handles payments securely. We do not process payments.</li>
                            <li><strong>Clearbit / Wikipedia:</strong> To fetch public logos for subscriptions. We only send the <em>name</em> of the service (e.g., "Netflix"), not your account details.</li>
                        </ul>
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
