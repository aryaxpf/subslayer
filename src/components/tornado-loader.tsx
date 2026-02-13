"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const LOGO_DOMAINS = [
    "netflix.com",
    "spotify.com",
    "google.com",
    "aws.amazon.com",
    "adobe.com",
    "dropbox.com",
    "slack.com",
    "zoom.us",
    "microsoft.com",
    "apple.com",
    "github.com",
    "figma.com",
    "notion.so",
    "chatgpt.com",
    "primevideo.com",
    "disneyplus.com",
    "hulu.com",
    "hbomax.com",
    "trello.com",
    "asana.com"
]

export function TornadoLoader() {
    // Generate random particles
    const particles = Array.from({ length: 40 }).map((_, i) => {
        const domain = LOGO_DOMAINS[i % LOGO_DOMAINS.length]
        return {
            id: i,
            logo: `https://logo.clearbit.com/${domain}`,
            delay: Math.random() * 2,
            duration: 2 + Math.random() * 1.5,
            xOffset: (Math.random() - 0.5) * 100 // Variance in starting position
        }
    })

    return (
        <div className="relative w-full h-[400px] flex flex-col items-center justify-center overflow-hidden bg-background/50 rounded-xl border border-muted/20 backdrop-blur-sm">

            {/* Tornado Center Core - Visual Anchor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-[300px] bg-gradient-to-t from-transparent via-primary/20 to-transparent blur-md" />

            {/* Swirling LOGOS */}
            {particles.map((p) => (
                <Particle key={p.id} {...p} />
            ))}

            {/* Text Overlay */}
            <div className="z-10 mt-64 bg-background/80 backdrop-blur-md px-6 py-2 rounded-full border shadow-sm">
                <p className="text-lg font-bold text-foreground animate-pulse">
                    Analyzing transaction patterns...
                </p>
            </div>
        </div>
    )
}

function Particle({ logo, delay, duration, xOffset }: { logo: string, delay: number, duration: number, xOffset: number }) {
    const [imgSrc, setImgSrc] = useState(logo)
    const [hasError, setHasError] = useState(false)

    return (
        <motion.div
            className="absolute w-8 h-8 rounded-full shadow-sm bg-white p-1 flex items-center justify-center overflow-hidden"
            initial={{
                y: 200,
                opacity: 0,
                scale: 0.2,
                x: 0,
                rotate: 0
            }}
            animate={{
                y: -200,
                opacity: [0, 1, 1, 0],
                scale: [0.2, 0.8, 1.2, 1.5],
                x: [
                    0,
                    30 * Math.cos(0),
                    80 * Math.cos(2),
                    150 * Math.cos(4)
                ],
                rotate: 360 * 2
            }}
            transition={{
                duration: duration,
                repeat: Infinity,
                delay: delay,
                ease: "linear",
            }}
            style={{
                left: "50%",
                top: "50%"
            }}
        >
            {!hasError ? (
                <img
                    src={imgSrc}
                    alt="logo"
                    className="w-full h-full object-contain"
                    onError={() => {
                        // Fallback to Google Favicon API if Clearbit fails
                        if (imgSrc.includes("clearbit")) {
                            setImgSrc(`https://www.google.com/s2/favicons?domain=${logo.split('/').pop()}&sz=64`)
                        } else {
                            setHasError(true)
                        }
                    }}
                />
            ) : (
                <div className="w-full h-full bg-primary/20 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-primary/50" />
                </div>
            )}
        </motion.div>
    )
}

// Improved Spiral Function
// Simple keyframes above might be jerky. Let's try a pure math approach if needed,
// but Framer Motion keyframes are easiest for "Tornado".
// To make it a true spiral, x needs to oscillate (sin/cos) with increasing amplitude.
