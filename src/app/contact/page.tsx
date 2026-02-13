"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Mail, Instagram, Github, MessageCircle, Coffee, Bitcoin } from "lucide-react"

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-xl space-y-8 text-center">

                {/* Header */}
                <div className="flex items-center justify-center relative mb-8">
                    <Link href="/" className="absolute left-0">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight">Get in Touch</h1>
                </div>

                <p className="text-muted-foreground text-lg">
                    Have questions, found a bug, or just want to say hi?
                    <br />
                    We'd love to hear from you.
                </p>

                <div className="grid gap-4 mt-8">

                    {/* Instagram - Priority Link */}
                    <a
                        href="https://www.instagram.com/aryapfir/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group p-6 border rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 transition-all flex items-center gap-4"
                    >
                        <div className="bg-white dark:bg-black p-3 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                            <Instagram className="h-6 w-6 text-[#E1306C]" />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-foreground">Instagram</h3>
                            <p className="text-sm text-muted-foreground">@aryapfir</p>
                        </div>
                    </a>

                    {/* GitHub - Secondary */}
                    <a
                        href="https://github.com/aryapfir"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group p-6 border rounded-2xl bg-card hover:bg-accent/50 transition-all flex items-center gap-4"
                    >
                        <div className="bg-muted p-3 rounded-full group-hover:scale-110 transition-transform">
                            <Github className="h-6 w-6" />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-foreground">GitHub</h3>
                            <p className="text-sm text-muted-foreground">Report bugs & contribute</p>
                        </div>
                    </a>

                    {/* General Inquiry */}
                    <div className="p-6 border rounded-2xl bg-card flex items-center gap-4 opacity-50 cursor-not-allowed">
                        <div className="bg-muted p-3 rounded-full">
                            <Mail className="h-6 w-6" />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-foreground">Email</h3>
                            <p className="text-sm text-muted-foreground">Coming soon</p>
                        </div>
                    </div>

                </div>

                {/* Support Section */}
                <div className="pt-8 border-t w-full">
                    <h2 className="text-xl font-bold mb-6">Support the Project</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        <a
                            href="https://saweria.co/aryapfir"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group p-6 border rounded-2xl bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/20 dark:hover:bg-orange-950/30 transition-all flex items-center gap-4 border-orange-200 dark:border-orange-800"
                        >
                            <div className="bg-orange-100 dark:bg-orange-900/50 p-3 rounded-full group-hover:scale-110 transition-transform text-orange-600 dark:text-orange-400">
                                <Coffee className="h-6 w-6" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-bold text-foreground">Buy me a Coffee</h3>
                                <p className="text-sm text-muted-foreground">via Saweria</p>
                            </div>
                        </a>

                        <div className="group p-6 border rounded-2xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/20 dark:hover:bg-blue-950/30 transition-all flex items-center gap-4 border-blue-200 dark:border-blue-800 cursor-not-allowed opacity-70">
                            <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full text-blue-600 dark:text-blue-400">
                                <Bitcoin className="h-6 w-6" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-bold text-foreground">Donate Crypto</h3>
                                <p className="text-sm text-muted-foreground">Coming Soon</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
