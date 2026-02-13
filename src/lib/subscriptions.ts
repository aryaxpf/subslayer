import { ServiceKnowledge } from "./types";

export const SUBSCRIPTION_KNOWLEDGE_BASE: ServiceKnowledge[] = [
    // --- GLOBAL ENTERTAINMENT ---
    {
        id: "netflix",
        name: "Netflix",
        category: "Entertainment",
        logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
        description: "Streaming service for movies and TV shows.",
        url: "https://www.netflix.com",
        cancellationUrl: "https://www.netflix.com/cancelplan",
        cancellationMethod: "Online",
        steps: [
            "Log in to your Netflix account.",
            "Click on your profile icon and select 'Account'.",
            "Under 'Membership & Billing', click 'Cancel Membership'.",
            "Confirm the cancellation on the next page."
        ],
        keywords: ["netflix", "nflx"],
        downgradeOptions: [
            { name: "Standard with Ads", price: "$6.99/mo", savings: "Save ~50%" },
            { name: "Share Account (Extra Member)", price: "$7.99/mo", savings: "vs Full Sub" }
        ]
    },
    {
        id: "spotify",
        name: "Spotify",
        category: "Entertainment",
        logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
        description: "Digital music, podcast, and video service.",
        url: "https://www.spotify.com",
        cancellationUrl: "https://www.spotify.com/account/change-plan/",
        cancellationMethod: "Online",
        steps: [
            "Log in to your Spotify account page.",
            "Scroll strictly to the 'Your plan' section.",
            "Click 'Change plan'.",
            "Scroll to 'Cancel Spotify Premium' and click 'Cancel Premium'."
        ],
        keywords: ["spotify", "spotify ab"],
        downgradeOptions: [
            { name: "Spotify Duo (2 accts)", price: "$14.99/mo", savings: "Save $5/mo vs 2 Solos" },
            { name: "Student Plan", price: "$5.99/mo", savings: "Save 50%" }
        ]
    },
    {
        id: "youtube_premium",
        name: "YouTube Premium",
        category: "Entertainment",
        logo: "https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg",
        description: "Ad-free YouTube and YouTube Music.",
        url: "https://www.youtube.com",
        cancellationUrl: "https://www.youtube.com/paid_memberships",
        cancellationMethod: "Online",
        steps: [
            "Go to youtube.com/paid_memberships.",
            "Click 'Manage Membership'.",
            "Click 'Deactivate'.",
            "Click 'Continue to Cancel'."
        ],
        keywords: ["youtube", "google *youtube", "youtube premium"]
    },
    {
        id: "disney_plus",
        name: "Disney+",
        category: "Entertainment",
        logo: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg",
        description: "Streaming home of Disney, Pixar, Marvel, Star Wars, and Nat Geo.",
        url: "https://www.disneyplus.com",
        cancellationUrl: "https://www.disneyplus.com/account/subscription",
        cancellationMethod: "Online",
        steps: [
            "Log in to Disney+ via a web browser.",
            "Select your Profile > Account.",
            "Select your Subscription.",
            "Select 'Cancel Subscription'."
        ],
        keywords: ["disney+", "disney plus"]
    },
    {
        id: "prime_video",
        name: "Prime Video",
        category: "Entertainment",
        logo: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.png",
        description: "Amazon's video on-demand service.",
        url: "https://www.amazon.com/primevideo",
        cancellationUrl: "https://www.amazon.com/gp/video/settings",
        cancellationMethod: "Online",
        steps: [
            "Go to 'Account & Settings'.",
            "Select the 'Your Account' tab.",
            "Look for 'Your Membership' and click 'End Membership'."
        ],
        keywords: ["prime video", "amazon prime", "amazon video", "amzn digital"]
    },
    {
        id: "hulu",
        name: "Hulu",
        category: "Entertainment",
        logo: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Hulu_Logo.svg",
        description: "Streaming library of current hits and classic favorites.",
        url: "https://www.hulu.com",
        cancellationUrl: "https://secure.hulu.com/account",
        cancellationMethod: "Online",
        steps: [
            "Go to your Account page on a computer or mobile browser.",
            "Select 'Cancel' under 'Your Subscription'.",
            "Select 'Continue to Cancel'.",
            "Select 'Cancel Subscription'."
        ],
        keywords: ["hulu", "hulu.com"]
    },
    {
        id: "hbo_max",
        name: "Max (HBO)",
        category: "Entertainment",
        logo: "https://upload.wikimedia.org/wikipedia/commons/1/17/HBO_Max_Logo.svg",
        description: "Home of HBO, DC, and Warner Bros.",
        url: "https://www.max.com",
        cancellationUrl: "https://auth.max.com/subscription",
        cancellationMethod: "Online",
        steps: [
            "Go to Max.com/subscription and sign in.",
            "Choose 'Cancel Your Subscription'.",
            "Confirm your cancellation."
        ],
        keywords: ["hbo max", "hbo now", "max.com"]
    },
    {
        id: "apple_services",
        name: "Apple Services",
        category: "Utilities",
        logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
        description: "iCloud, Apple Music, Apple TV+, etc.",
        url: "https://apple.com",
        cancellationUrl: "https://support.apple.com/en-us/HT202039",
        cancellationMethod: "Online",
        steps: [
            "Open Settings on your iPhone/iPad.",
            "Tap your name.",
            "Tap 'Subscriptions'.",
            "Tap the subscription you want to manage.",
            "Tap 'Cancel Subscription'."
        ],
        keywords: ["apple.com/bill", "itunes", "apple music", "icloud"]
    },

    // --- SOFTWARE & CLOUD ---
    {
        id: "adobe_cc",
        name: "Adobe Creative Cloud",
        category: "Software",
        logo: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Creative_Cloud.svg",
        description: "Photoshop, Illustrator, Premiere Pro, etc.",
        url: "https://www.adobe.com",
        cancellationUrl: "https://account.adobe.com/plans",
        cancellationMethod: "Online",
        steps: [
            "Sign in to account.adobe.com/plans.",
            "Select 'Manage plan' for the plan you want to cancel.",
            "Select 'Cancel your plan'.",
            "Beware of early termination fees if you are on an annual contract!"
        ],
        keywords: ["adobe", "adobe systems", "photoshop", "creative cloud"],
        downgradeOptions: [
            { name: "Photography Plan", price: "$9.99/mo", savings: "Save 80% vs All Apps" },
            { name: "Retention Effect", price: "Free 2 Months", savings: "Often offered if you try to cancel" }
        ]
    },
    {
        id: "aws",
        name: "Amazon Web Services",
        category: "Software",
        logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
        description: "Cloud computing services.",
        url: "https://aws.amazon.com",
        cancellationUrl: "https://console.aws.amazon.com/billing/home#/account",
        cancellationMethod: "Online",
        steps: [
            "Sign in to the AWS Management Console.",
            "Go to the 'Billing and Cost Management' dashboard.",
            "Go to 'Account Settings'.",
            "Scroll to 'Close Account' and tick the boxes."
        ],
        keywords: ["aws", "amazon web services"]
    },
    {
        id: "google_one",
        name: "Google One",
        category: "Utilities",
        logo: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Google_One_logo.svg",
        description: "Expanded cloud storage for Google Drive, Gmail, and Photos.",
        url: "https://one.google.com",
        cancellationUrl: "https://one.google.com/settings",
        cancellationMethod: "Online",
        steps: [
            "Go to one.google.com.",
            "Click Settings.",
            "Click 'Cancel membership'.",
            "Click 'Cancel membership' again to confirm."
        ],
        keywords: ["google storage", "google one", "google drive"]
    },
    {
        id: "chatgpt",
        name: "ChatGPT Plus",
        category: "Software",
        logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
        description: "AI chatbot by OpenAI.",
        url: "https://chat.openai.com",
        cancellationUrl: "https://chat.openai.com/#settings/Subscription",
        cancellationMethod: "Online",
        steps: [
            "Log in to chat.openai.com.",
            "Click on 'My Plan' or your profile.",
            "Click 'Manage my subscription'.",
            "This opens a Stripe portal; click 'Cancel Plan'."
        ],
        keywords: ["chatgpt", "openai", "chatgpt plus"]
    },
    {
        id: "canva",
        name: "Canva",
        category: "Software",
        logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg",
        description: "Graphic design platform.",
        url: "https://www.canva.com",
        cancellationUrl: "https://www.canva.com/settings/billing",
        cancellationMethod: "Online",
        steps: [
            "Go to 'Account Settings' from the gear icon.",
            "Select 'Billing & Plans'.",
            "Under the plan you want to cancel, click 'More actions' (three dots).",
            "Select 'Request cancellation'."
        ],
        keywords: ["canva"]
    },
    {
        id: "dropbox",
        name: "Dropbox",
        category: "Software",
        logo: "https://upload.wikimedia.org/wikipedia/commons/7/78/Dropbox_Icon.svg",
        description: "File hosting service.",
        url: "https://www.dropbox.com",
        cancellationUrl: "https://www.dropbox.com/account/billing",
        cancellationMethod: "Online",
        steps: [
            "Sign in to Dropbox.",
            "Click your avatar and select 'Settings'.",
            "Click 'Plan'.",
            "Click 'Cancel plan' at the bottom of the page."
        ],
        keywords: ["dropbox"]
    },
    {
        id: "microsoft_365",
        name: "Microsoft 365",
        category: "Software",
        logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
        description: "Office apps and OneDrive storage.",
        url: "https://www.microsoft.com",
        cancellationUrl: "https://account.microsoft.com/services",
        cancellationMethod: "Online",
        steps: [
            "Go to account.microsoft.com/services.",
            "Find your subscription and select 'Manage'.",
            "Select 'Cancel subscription'.",
            "Follow the instructions to confirm."
        ],
        keywords: ["microsoft 365", "msft *office", "microsoft"]
    },
    {
        id: "github",
        name: "GitHub",
        category: "Software",
        logo: "https://upload.wikimedia.org/wikipedia/commons/c/c2/GitHub_Invertocat_Logo.svg",
        description: "Software development platform.",
        url: "https://github.com",
        cancellationUrl: "https://github.com/settings/billing",
        cancellationMethod: "Online",
        steps: [
            "Go to Settings > Billing and plans.",
            "Scroll to 'Current plan'.",
            "Select 'Downgrade to Free'."
        ],
        keywords: ["github"]
    },
    {
        id: "zoom",
        name: "Zoom",
        category: "Software",
        logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Zoom_communications_Logo.svg",
        description: "Video conferencing tool.",
        url: "https://zoom.us",
        cancellationUrl: "https://zoom.us/billing/plan",
        cancellationMethod: "Online",
        steps: [
            "Sign in to the Zoom web portal.",
            "Click 'Account Management' > 'Billing'.",
            "On the 'Current Plans' tab, find the plan you want to cancel and click 'Cancel Plan'."
        ],
        keywords: ["zoom.us", "zoom video"]
    },

    // --- INDONESIAN SERVICES ---
    {
        id: "telkomsel",
        name: "Telkomsel Halo",
        category: "Utilities",
        logo: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Telkomsel_2021_icon.svg",
        description: "Postpaid mobile service.",
        url: "https://www.telkomsel.com",
        cancellationUrl: "https://www.telkomsel.com/support/contact-us",
        cancellationMethod: "Phone",
        steps: [
            "Requires visiting a GraPARI location or calling 188.",
            "Prepare your KTP and KK.",
            "Alternatively, use the MyTelkomsel app to switch to a lower package if full cancellation isn't desired."
        ],
        keywords: ["telkomsel", "kartu halo", "halo"]
    },
    {
        id: "indihome",
        name: "IndiHome",
        category: "Utilities",
        logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/IndiHome_Logo.svg",
        description: "Home internet and TV provider.",
        url: "https://indihome.co.id",
        cancellationUrl: "https://myih.telkom.co.id/",
        cancellationMethod: "Phone",
        steps: [
            "Best method: Call 147.",
            "Visit a Plasa Telkom nearest to you.",
            "Ensure all bills are paid before requesting termination.",
            "Return the modem/STB devices."
        ],
        keywords: ["indihome", "telkom indonesia"]
    },
    {
        id: "pln",
        name: "PLN",
        category: "Utilities",
        logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Logo_PLN.svg",
        description: "State electricity corporation.",
        url: "https://pln.co.id",
        cancellationUrl: "https://layanan.pln.co.id/",
        cancellationMethod: "Phone", // Or in-person
        steps: [
            "Call 123 for information.",
            "Visit the nearest PLN office for termination or power change requests."
        ],
        keywords: ["pln", "tagihan listrik"]
    },
    {
        id: "vidio",
        name: "Vidio",
        category: "Entertainment",
        logo: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Vidio_Logo.png",
        description: "Indonesian streaming service.",
        url: "https://www.vidio.com",
        cancellationUrl: "https://www.vidio.com/packages/active",
        cancellationMethod: "Online",
        steps: [
            "Login to Vidio desktop/mobile web.",
            "Go to 'Packages' or 'My Packages'.",
            "Click on 'Active Package'.",
            "Click 'Unsubscribe'."
        ],
        keywords: ["vidio", "vidio.com"]
    },
    {
        id: "ruangguru",
        name: "Ruangguru",
        category: "Software",
        logo: "https://upload.wikimedia.org/wikipedia/commons/d/d4/Logo_Ruangguru_2020.svg",
        description: "Educational technology company.",
        url: "https://ruangguru.com",
        cancellationUrl: "https://bayar.ruangguru.com/",
        cancellationMethod: "Email",
        steps: [
            "Contact info@ruangguru.com.",
            "Or use the help feature in the app.",
            "Subscriptions are often prepaid, so cancellation stops renewal."
        ],
        keywords: ["ruangguru"]
    }
];

export function getServiceKnowledge(description: string): ServiceKnowledge | undefined {
    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
    const search = normalize(description);

    return SUBSCRIPTION_KNOWLEDGE_BASE.find(service =>
        service.keywords.some(k => search.includes(normalize(k)))
    );
}

export function getAllServices(): ServiceKnowledge[] {
    return SUBSCRIPTION_KNOWLEDGE_BASE;
}
