"use client"

import { useParams, useRouter } from "next/navigation"
import { SUBSCRIPTION_KNOWLEDGE_BASE } from "@/lib/subscriptions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft, ExternalLink, ShieldAlert, CheckCircle2, AlertTriangle, FileText, Mail, Phone } from "lucide-react"

export default function HowToCancelPage() {
    const params = useParams()
    const router = useRouter()

    // Find service by ID (slug)
    const service = SUBSCRIPTION_KNOWLEDGE_BASE.find(s => s.id === params.slug)

    if (!service) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
                <Button onClick={() => router.push("/")}>Return Home</Button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">How to Cancel {service.name}</h1>
                        <p className="text-muted-foreground">Verified steps to stop being charged.</p>
                    </div>
                </div>

                {/* Hero Card */}
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 border border-primary/20">
                    <div className="relative w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center p-2 shrink-0">
                        <img src={service.logo} alt={service.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 text-center md:text-left space-y-4">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold">The "Kill Switch"</h2>
                            <p className="text-muted-foreground">The fastest way to cancel. We found the direct link to their hidden cancellation page.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                            <Button size="lg" className="gap-2 bg-destructive hover:bg-destructive/90 text-white font-bold shadow-xl" onClick={() => window.open(service.cancellationUrl, '_blank')}>
                                <ExternalLink className="h-5 w-5" />
                                Cancel {service.name} Now
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Guide Content */}
                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                Step-by-Step Guide
                            </CardTitle>
                            <CardDescription>
                                Method: <span className="font-semibold text-foreground">{service.cancellationMethod}</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <ol className="relative border-l border-muted ml-3 space-y-8">
                                {service.steps.map((step, index) => (
                                    <li key={index} className="mb-10 ml-6">
                                        <span className="absolute flex items-center justify-center w-8 h-8 bg-background rounded-full -left-4 ring-4 ring-background border-2 border-primary text-primary font-bold text-sm">
                                            {index + 1}
                                        </span>
                                        <div className="p-4 bg-muted/30 rounded-lg border">
                                            <p className="text-base leading-relaxed">{step}</p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </CardContent>
                    </Card>

                    {/* Disclaimer */}
                    <Card className="bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900">
                        <CardContent className="pt-6 flex gap-4">
                            <AlertTriangle className="h-6 w-6 text-orange-600 shrink-0" />
                            <div className="space-y-2">
                                <h3 className="font-semibold text-orange-900 dark:text-orange-200">Important Note</h3>
                                <p className="text-sm text-orange-800 dark:text-orange-300">
                                    Subscription Slayer provides these guides for informational purposes. Companies often change their cancellation flows to make it harder. If a link is broken, please let us know.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    )
}
