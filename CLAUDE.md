# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Next.js 16 dashboard for monitoring bot execution data in real-time. The application displays bot executions with wallet-level tracking, capital changes, and execution status. Uses Next.js App Router with client-side rendering for real-time data fetching.

## Development Commands

```bash
# Development server (runs on http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm start
```

## Environment Setup

Required environment variable in `.env.local`:
```
NEXT_PUBLIC_API_URL=https://api.aggtrade.xyz/tracking
```

## Architecture

### Data Flow Pattern

All pages use client-side data fetching (marked with `'use client'`):
1. Components mount and trigger API calls in `useEffect`
2. Loading states are shown while fetching
3. Data is stored in component state
4. Error handling displays user-friendly messages

The execution details page (`/execution/[id]`) performs parallel fetches:
- First fetches execution details and wallet list
- Then fetches portfolio snapshots for ALL wallets concurrently using `Promise.all`
- Snapshot data is stored in a Record mapping wallet address to snapshots array

### Capital Calculation Logic

Capital change is calculated in `src/app/execution/[id]/page.tsx:179-186`:
- **Capital Before**: First snapshot's `total_capital_usd`
- **Capital After**: Last snapshot's `total_capital_usd`
- **Change**: Difference in dollar amount and percentage

If a wallet has no snapshots, capital values default to 0.

### Type System

Core types in `src/lib/types.ts`:
- `BotExecution`: Top-level execution with strategy, wallet counts, volume, status
- `WalletExecution`: Individual wallet with tokens, swaps, and status
- `PortfolioSnapshot`: Time-based snapshot of wallet capital and token balances
- `ExecutionDetails`: Combines execution with array of wallets

All status fields use literal types (`'running' | 'completed' | 'failed'`) for type safety.

### API Client

`src/lib/api.ts` uses axios with base URL from environment:
- `getExecutions()`: List all executions with pagination
- `getExecutionDetails()`: Get execution + wallets for specific ID
- `getPortfolioSnapshots()`: Get capital snapshots for specific wallet

API base defaults to `http://localhost:5000/tracking` if env var not set.

### Styling

Uses Tailwind CSS v4 with custom configuration. Status badges use consistent color scheme:
- Green: completed
- Blue: running
- Red: failed
- Gray: pending

## Path Aliases

`@/*` maps to `./src/*` (configured in tsconfig.json)

## Key Files

- `src/lib/types.ts`: Core TypeScript interfaces
- `src/lib/api.ts`: API client functions
- `src/app/page.tsx`: Home page with executions table
- `src/app/execution/[id]/page.tsx`: Detailed execution view with wallet table