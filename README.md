# Subscription Slayer ⚔️

**AI-Powered Subscription Manager & Cancellation Assistant**

Subscription Slayer is a privacy-focused web application that helps you take control of your recurring expenses. Upload your bank statements (CSV/PDF), and our intelligent engine will detect subscriptions, calculate your total monthly spend, and provide actionable cancellation instructions.

![Screenshot](/screenshot.png)

## Features

- 🕵️ **Smart Detection**: Automatically identifies subscriptions from bank statements.
- 🌍 **Multi-Currency Support**: Handles IDR, USD, EUR, GBP, and more with unified reporting.
- 📊 **Visual Analytics**: Interactive charts for category distribution and monthly spending trends.
- 📅 **Subscription Calendar**: Visualize upcoming payments to avoid surprise charges.
- 🔮 **Spending Forecast**: Project your cumulative costs over 1-5 years.
- 🔒 **Privacy First**: All data processing happens **locally in your browser**. No financial data is uploaded to our servers.
- 💾 **Smart Resume**: Saves your progress locally so you can return later without re-uploading.

## Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/subscription-slayer.git
    cd subscription-slayer
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

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Shadcn UI
- **State/Animations**: Framer Motion
- **Parsing**: PapaParse (CSV), PDF.js
- **Charts**: Recharts

## License

MIT
