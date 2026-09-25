# SpendIQ — Personal Expense Intelligence

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

> A sleek, privacy-first personal finance and expense analytics dashboard built with Next.js, React 19, TypeScript, Tailwind CSS, and Recharts. Gain deep visibility into where your money goes with real-time statistics, monthly budgets, category breakdowns, velocity charts, and client-side data persistence.

---

## Overview

**SpendIQ** transforms manual expense tracking into actionable financial intelligence. Without requiring an account, external database, or third-party tracking, SpendIQ operates 100% on the user's device using browser `localStorage`. Every logged transaction immediately updates real-time analytics, category distributions, budget pacing, and interactive charts.

---

## Key Features

### 1. Real-Time Dashboard
- **Total Spending:** Comprehensive all-time spending calculation.
- **This Month's Spending:** Isolated view of current calendar month volume.
- **Today's Spending:** Fast check on daily expenditure.
- **Average Daily Spending:** Dynamic calculation based on days elapsed in the month.
- **Transaction Count:** Total logged entries indicator.
- **Largest Expense:** Highlights the single largest purchase with title and amount.
- **Top Spending Category:** Automatically identifies the highest spend category with percentage allocation.

### 2. Intelligent Budgeting & Warnings
- **Configurable Monthly Budget:** Set and adjust your monthly spending ceiling at any time.
- **Pacing Progress Bar:** Real-time percentage utilized.
- **Warning Indicators:** Transitions from emerald (<80%) to amber warning when approaching budget limit.
- **Budget Exceeded Alert:** Clear, bold **`Budget exceeded`** alert if expenses surpass the target limit.
- **Zero Investment Advice:** Purely mathematical pacing without unsolicited financial recommendations.

### 3. Deep Analytics & Data Visualization
- **Donut / Pie Chart:** Visual breakdown of category allocations with interactive hover tooltips and dynamic center label.
- **Monthly Volume Bar Chart:** Comparison of spending across consecutive calendar months.
- **Daily Velocity Area Chart:** Day-by-day expenditure pattern across the active month.
- **Ranked Category Pods:** Quick inspection of top spending categories.

### 4. Transaction Management & Organization
- **Add & Edit Expense:** Quick modal with amount, title, 9 standardized categories, date presets (Today/Yesterday), and optional notes.
- **Search:** Real-time search across titles, notes, categories, and amounts.
- **Category Filters:** Filter by Food, Transport, Shopping, Entertainment, Education, Bills, Health, Travel, or Other.
- **Date Filters:** Filter by All Dates, This Month, Last Month, Last 30 Days, or Custom Date Ranges.
- **Multi-criteria Sorting:** Sort by Newest, Oldest, Amount: High-to-Low, or Amount: Low-to-High.
- **Responsive Layout:** High-density data table on desktop; touch-friendly cards on mobile.

### 5. Data Privacy & Local Persistence
- **100% Client-Side:** No external database, telemetry, or server uploads.
- **Automatic Storage:** Expenses, budget limits, theme, and currency settings persist across browser restarts in `localStorage`.
- **Reset Option:** Single-click "Reset All Data" option with confirmation modal.
- **Demo Data Generator:** Pre-loaded realistic sample data for instant product evaluation.
- **CSV Export:** One-click download of all transaction records (`Date`, `Expense name`, `Category`, `Amount`, `Note`) compatible with Microsoft Excel, Apple Numbers, and Google Sheets.

---

## Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **Next.js 16 (App Router)** | High-performance React framework, optimized bundles |
| **React 19** | Component rendering, hooks, and reactive UI state |
| **TypeScript** | Strict type safety for transactions, analytics, and metrics |
| **Tailwind CSS v4** | Modern fintech design system, sleek dark/light modes |
| **Recharts** | Responsive SVG charts (Pie, Bar, Area/Line) |
| **Lucide React** | Clean, consistent icons across categories and navigation |

---

## Architecture & Project Structure

```text
spendiq-expense-dashboard/
├── app/
│   ├── favicon.ico
│   ├── globals.css         # Tailwind v4 theme, fintech grid & glassmorphism
│   ├── icon.svg            # Custom vector favicon and app icon
│   ├── layout.tsx          # Root layout with OpenGraph, SEO, & ExpenseProvider
│   └── page.tsx            # Main dashboard, assembling metrics, charts, & tables
├── components/
│   ├── Analytics/
│   │   └── AnalyticsSection.tsx      # Multi-chart tabbed analytics suite
│   ├── Budget/
│   │   └── BudgetCard.tsx            # Monthly budget tracker with exceed alerts
│   ├── Charts/
│   │   ├── CategoryPieChart.tsx      # Responsive donut chart
│   │   ├── DailySpendingChart.tsx    # Daily spend velocity area chart
│   │   └── MonthlySpendingChart.tsx  # Monthly volume bar chart
│   ├── Common/
│   │   ├── ConfirmModal.tsx          # Confirmation dialog for data reset
│   │   └── PrivacyNotice.tsx         # Device privacy disclosure
│   ├── Dashboard/
│   │   └── StatCards.tsx             # 7 core metric cards
│   ├── ExpenseForm/
│   │   └── ExpenseModal.tsx          # Add & Edit transaction modal form
│   ├── ExpenseList/
│   │   ├── EmptyState.tsx            # Polished empty state with quick actions
│   │   ├── ExpenseFilters.tsx        # Search, filter, sort, & CSV export toolbar
│   │   └── ExpenseTable.tsx          # Desktop table & mobile cards layout
│   └── Navbar.tsx                    # Brand header, currency selector, theme toggle
├── context/
│   └── ExpenseContext.tsx            # Unified React context for reactive state
├── lib/
│   ├── analytics.ts                  # Pure mathematical metric calculation functions
│   ├── constants.ts                  # Categories, colors, demo data, presets
│   ├── export.ts                     # RFC 4180 UTF-8 CSV exporter
│   └── storage.ts                    # LocalStorage read/write with error resilience
└── types/
    └── expense.ts                    # TypeScript types and interfaces
```

---

## Getting Started

### Prerequisites
- **Node.js** >= 18.17.0 (v20+ or v24+ recommended)
- **npm**, **yarn**, or **pnpm**

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Amit0730/spendiq-expense-dashboard.git
   cd spendiq-expense-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```text
   http://localhost:3000
   ```

---

## Production Build

To test and compile the production bundle locally:

```bash
npm run build
npm run start
```

---

## Data Privacy & Security

SpendIQ adheres to strict privacy principles:
- **No Remote Storage:** Your financial transactions are never transmitted to external APIs or remote databases.
- **Zero Credentials Required:** No login, OAuth, passwords, or personal identity verification needed.
- **Client-Side Storage:** Records exist solely within your browser's sandboxed `localStorage`.
- **Easy Wipe:** Reset your data with a single click at any time.

---

## Deployment Instructions

### Deploy on Vercel

The easiest way to deploy SpendIQ is through [Vercel](https://vercel.com):

1. Push your repository to GitHub.
2. Import the project into the [Vercel Dashboard](https://vercel.com/new).
3. Framework preset will automatically detect **Next.js**.
4. Click **Deploy**.

Alternatively, deploy directly from the CLI:
```bash
npx vercel
```

---

## Future Improvements

- [ ] Recurring expense scheduler (e.g. monthly subscriptions)
- [ ] Multi-month budget forecasting & trend simulation
- [ ] Receipt image attachment stored via IndexedDB
- [ ] Custom category creation with user-selected colors and icons
- [ ] Encrypted JSON backup and restore

---

## License

This project is licensed under the [MIT License](LICENSE).
