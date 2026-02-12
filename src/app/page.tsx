"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { FileUpload } from "@/components/file-upload"
import { analyzeSubscriptions } from "@/lib/analysis"
import { Transaction } from "@/lib/types"
import { ArrowRight, ShieldCheck, Zap, DollarSign, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  const router = useRouter()
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleDataParsed = (transactions: Transaction[]) => {
    setIsAnalyzing(true)
    // Simulate a brief "AI Analysis" delay for UX
    setTimeout(() => {
      const result = analyzeSubscriptions(transactions)
      localStorage.setItem("subscription_slayer_data", JSON.stringify(result))
      router.push("/dashboard")
    }, 1500)
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <DollarSign className="text-primary-foreground h-5 w-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">SubscriptionSlayer</span>
        </div>
        <nav className="hidden md:flex space-x-6 text-sm font-medium text-muted-foreground">
          <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
          <a href="#privacy" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="https://github.com/rohunvora/just-fucking-cancel" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center space-y-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
            <Zap className="h-3 w-3 mr-1" />
            <span>AI-Powered Finance auditing</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
            Stop paying for <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">forgotten subscriptions</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload your bank statements. Our local AI finds recurring charges you forgot about.
            Sanitize your finances in seconds.
          </p>
        </motion.div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full max-w-lg bg-card border rounded-xl shadow-xl p-2"
        >
          {isAnalyzing ? (
            <div className="p-12 flex flex-col items-center space-y-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-lg font-medium">Analyzing transaction patterns...</p>
              <p className="text-sm text-muted-foreground">Finding those sneaky $9.99 charges</p>
            </div>
          ) : (
            <div className="p-6 bg-background rounded-lg border-dashed border-2 border-muted/50">
              <FileUpload onDataParsed={handleDataParsed} />
            </div>
          )}
        </motion.div>

        {/* Social Proof / Trust */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center space-x-8 pt-8 text-muted-foreground/60 scale-90 md:scale-100"
        >
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-5 w-5" />
            <span className="text-sm">100% Client-side Privacy</span>
          </div>
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span className="text-sm">No Data Uploaded</span>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-muted-foreground border-t">
        <p>© 2024 SubscriptionSlayer. Inspired by JustCancel.io.</p>
      </footer>
    </main>
  )
}
