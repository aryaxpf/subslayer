"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { FileUpload } from "@/components/file-upload"
import { analyzeSubscriptions } from "@/lib/analysis"
import { TornadoLoader } from "@/components/tornado-loader"
import { Transaction, AnalysisResult } from "@/lib/types"
import { ArrowRight, ShieldCheck, Zap, DollarSign, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  const router = useRouter()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null) // New state for error
  const [hasSavedData, setHasSavedData] = useState(false) // New state for saved data

  useEffect(() => {
    // Check for saved data on mount
    const savedData = localStorage.getItem("subscription_slayer_data")
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        // Ensure parsed data has expected structure, e.g., subscriptions array
        if (parsed && parsed.subscriptions && Array.isArray(parsed.subscriptions) && parsed.subscriptions.length > 0) {
          setHasSavedData(true)
        } else {
          // Data is invalid or empty, clear it
          localStorage.removeItem("subscription_slayer_data")
        }
      } catch (e) {
        // Invalid JSON, clear it
        console.error("Error parsing saved data from localStorage:", e)
        localStorage.removeItem("subscription_slayer_data")
      }
    }
  }, [])

  const handleAnalysisComplete = (result: AnalysisResult) => {
    localStorage.setItem("subscription_slayer_data", JSON.stringify(result))
    // Use a small timeout to ensure state is saved before navigation (though localStorage is sync)
    setTimeout(() => router.push("/dashboard"), 100)
  }

  const handleDataParsed = (transactions: Transaction[]) => {
    setIsAnalyzing(true)
    setError(null) // Clear any previous errors
    // Simulate a brief "AI Analysis" delay for UX
    setTimeout(() => {
      try {
        const result = analyzeSubscriptions(transactions)
        handleAnalysisComplete(result)
      } catch (e: any) {
        console.error("Analysis failed:", e)
        setError("Failed to analyze transactions. Please check your file format.")
        setIsAnalyzing(false)
      }
    }, 1500)
  }

  const handleResume = () => {
    router.push("/dashboard")
  }

  return (
    <main className="flex-1 w-full bg-background flex flex-col items-center justify-center p-6">

      {/* Minimalist Hero Content */}
      <section className="w-full max-w-5xl mx-auto flex flex-col items-center space-y-12 transition-all">

        <div className="text-center space-y-6">
          {/* New Title "Subscription Slayer" */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter text-foreground"
          >
            Subscription Slayer
          </motion.h1>

          {/* New Subtitle "Stop paying..." */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg md:text-2xl font-light text-muted-foreground tracking-wide max-w-2xl mx-auto"
          >
            Stop paying for forgotten subscriptions
          </motion.p>
        </div>

        {/* Upload Area - kept as functionality core */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          {isAnalyzing ? (
            <TornadoLoader />
          ) : (
            <FileUpload onDataParsed={handleDataParsed} />
          )}

          {/* Privacy tagline below upload box */}
          <p className="mt-4 text-center text-sm text-muted-foreground/60">
            Your files are analyzed and immediately discarded. Nothing is stored.
          </p>
        </motion.div>

      </section>
    </main>
  )
}
