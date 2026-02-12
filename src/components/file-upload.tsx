"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import Papa from "papaparse"
import { UploadCloud, FileText, X, CheckCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Transaction } from "@/lib/types"

interface FileUploadProps {
    onDataParsed: (transactions: Transaction[]) => void
}

export function FileUpload({ onDataParsed }: FileUploadProps) {
    const [files, setFiles] = useState<File[]>([])
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(prev => [...prev, ...acceptedFiles])
        setError(null)
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/csv': ['.csv'],
            // 'application/pdf': ['.pdf'] // PDF support to be added later
        },
        maxFiles: 3
    })

    const processFiles = async () => {
        setIsProcessing(true)
        setError(null)
        const allTransactions: Transaction[] = []

        try {
            for (const file of files) {
                if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
                    await new Promise<void>((resolve, reject) => {
                        Papa.parse(file, {
                            header: true,
                            skipEmptyLines: true,
                            complete: (results) => {
                                // Normalize keys (handle different bank formats)
                                const parsed = results.data.map((row: any) => {
                                    const amount = parseFloat(row.Amount || row.amount || row.Debit || row.debit || row.Value || "0")
                                    const description = row.Description || row.description || row.Memo || row.memo || "Unknown"
                                    const date = row.Date || row.date || row.Posted || new Date().toISOString()

                                    return {
                                        id: Math.random().toString(36).substr(2, 9),
                                        date,
                                        description,
                                        originalDescription: description,
                                        amount: isNaN(amount) ? 0 : amount
                                    } as Transaction
                                })
                                allTransactions.push(...parsed)
                                resolve()
                            },
                            error: (err: Error) => { // Type the error explicitly
                                reject(err)
                            }
                        })
                    })
                }
            }

            if (allTransactions.length === 0) {
                setError("No valid transactions found. Please check your CSV format.")
            } else {
                onDataParsed(allTransactions)
            }
        } catch (err) {
            setError("Failed to process files. Please try again.")
            console.error(err)
        } finally {
            setIsProcessing(false)
        }
    }

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index))
    }

    return (
        <div className="w-full max-w-xl mx-auto space-y-4">
            <Card
                {...getRootProps()}
                className={cn(
                    "border-2 border-dashed p-10 transition-all cursor-pointer hover:border-primary/50 hover:bg-muted/30",
                    isDragActive ? "border-primary bg-primary/5 scale-[1.02]" : "border-muted-foreground/25"
                )}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                    <div className="p-4 bg-muted rounded-full">
                        <UploadCloud className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-semibold text-lg">Drop your bank statements here</h3>
                        <p className="text-sm text-muted-foreground">
                            Supports CSV files from major banks. Data stays on your device.
                        </p>
                    </div>
                </div>
            </Card>

            <AnimatePresence>
                {files.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-2"
                    >
                        {files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-card border rounded-md shadow-sm">
                                <div className="flex items-center space-x-3">
                                    <FileText className="h-5 w-5 text-primary" />
                                    <span className="text-sm font-medium truncate max-w-[200px]">{file.name}</span>
                                    <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</span>
                                </div>
                                <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); removeFile(index); }}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}

                        <Button
                            className="w-full mt-4"
                            size="lg"
                            onClick={processFiles}
                            disabled={isProcessing}
                        >
                            {isProcessing ? "Analyzing..." : "Analyze Subscriptions"}
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md text-center">
                    {error}
                </div>
            )}
        </div>
    )
}
