# Bot Monitoring Dashboard

A Next.js monitoring dashboard to display real-time and historical bot execution data.

## Features

- View list of all bot executions with status, strategy, and progress
- Detailed execution view showing wallet-level data
- Capital tracking (before/after) for each wallet
- Status indicators for executions and wallets
- Clean, responsive UI with Tailwind CSS

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Axios for API requests

## Getting Started

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```
NEXT_PUBLIC_API_URL=https://api.aggtrade.xyz/tracking
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

### Build

Create a production build:

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Home: List of executions
│   ├── execution/[id]/page.tsx     # Execution details
│   └── layout.tsx
├── lib/
│   ├── api.ts                      # API client with axios
│   └── types.ts                    # TypeScript interfaces
└── components/                      # Future components
```

## API Endpoints Used

- `GET /bot/executions?limit=50&offset=0` - List all executions
- `GET /bot/execution/:execution_id` - Get execution details
- `GET /bot/portfolio/:execution_id/:wallet_address` - Get portfolio snapshots

## Features Breakdown

### Home Page (`/`)
- Table view of all bot executions
- Shows execution ID, strategy, wallet progress, volume, status, and start time
- Click on any execution to view details

### Execution Details Page (`/execution/[id]`)
- Summary cards showing strategy, total wallets, volume, and status
- Detailed wallet table with:
  - Wallet index and address
  - Starting token
  - Number of swaps completed
  - Capital before (first snapshot)
  - Capital after (last snapshot)
  - Dollar and percentage change
  - Wallet status

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Set environment variable:
   - `NEXT_PUBLIC_API_URL=https://api.aggtrade.xyz/tracking`
4. Deploy

Or use Vercel CLI:

```bash
vercel deploy
```

## Future Enhancements

- Auto-refresh for running executions
- Search/filter executions by strategy or date
- Pagination for execution list
- Export to CSV
- Detailed swap history per wallet
- Charts and graphs for capital tracking
