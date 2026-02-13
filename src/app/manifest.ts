import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Subscription Slayer',
        short_name: 'SubSlayer',
        description: 'Stop paying for subscriptions you don\'t use. Analyze bank statements locally and cancel unwanted services.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
            {
                src: '/icon.png', // We'll need to ensure this exists or use a placeholder
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}
