# Subscription Slayer ⚔️

**AI-Powered Subscription Manager & Cancellation Assistant**

Subscription Slayer is a privacy-focused web application that helps you take control of your recurring expenses. Upload your bank statements (CSV/PDF), and our intelligent engine will detect subscriptions, calculate your total monthly spend, and provide actionable cancellation instructions.

![Screenshot](/screenshot.png)

## Features

- 🕵️ **Smart Detection**: Automatically identifies subscriptions from bank statements.
- 🌍 **Multi-Currency Support**: Handles IDR, USD, EUR, GBP, and more with unified reporting.
- 📊 **Visual Analytics**: Interactive charts for category distribution and monthly spending trends.
- 📱 **PWA Ready**: Installable on mobile devices with offline support.
- 🗓️ **Subscription Calendar**: Visualize upcoming payments to avoid surprise charges.
- ⚡ **Bulk Actions**: Select multiple subscriptions to generate cancellation lists or mark them as cancelled.
- 📄 **PDF Support**: Drag and drop PDF bank statements (parsed locally).
- 🔮 **Spending Forecast**: Project your cumulative costs over 1-5 years.
- 🔒 **Privacy First**: All data processing happens **locally in your browser**. No financial data is uploaded to our servers.
- 💾 **Smart Resume**: Saves your progress locally so you can return later without re-uploading.

## Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/aryaxpf/subslayer.git
    cd subslayer
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  **Open the app**:
    Visit [http://localhost:3000](http://localhost:3000)

## Deployment (Vercel) 🚀

This project is optimized for deployment on [Vercel](https://vercel.com).

1.  Push your code to a GitHub repository.
2.  Import the project into Vercel.
3.  **Important**: In the Vercel Project Settings > **Build & Development Settings**:
    -   Override **Build Command** to: `npm run build`
    -   (This ensures the PWA service worker is generated correctly using Webpack).

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Shadcn UI
- **State/Animations**: Framer Motion
- **Parsing**: PapaParse (CSV), PDF.js (Client-side)
- **Charts**: Recharts
- **PWA**: @ducanh2912/next-pwa

## License

MIT
