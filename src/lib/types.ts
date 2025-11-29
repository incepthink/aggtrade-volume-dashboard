export interface BotExecution {
  id: number
  execution_id: string
  strategy_name: string
  total_wallets: number
  completed_wallets: number
  failed_wallets: number
  total_volume_usd: number
  start_time: string
  end_time: string | null
  status: 'running' | 'completed' | 'failed'
}

export interface WalletExecution {
  id: number
  execution_id: string
  wallet_index: number
  wallet_address: string
  tokens: string[]
  swaps_completed: number
  total_volume_usd: number
  status: 'pending' | 'running' | 'completed' | 'failed'
  error_message: string | null
  start_time: string
  end_time: string | null
}

export interface PortfolioSnapshot {
  id: number
  execution_id: string
  wallet_address: string
  total_capital_usd: number
  eth_balance: string
  usdc_balance: string
  wbtc_balance: string
  lbtc_balance: string
  timestamp: string
}

export interface ExecutionDetails {
  execution: BotExecution
  wallets: WalletExecution[]
}

export interface SushiSwap {
  id: number
  wallet_address: string
  swap_type: 'CLASSIC' | 'LIMIT_ORDER'
  token_from_address: string
  token_from_amount: string
  token_from_symbol: string
  token_from_logo: string
  token_to_address: string
  token_to_amount: string
  token_to_symbol: string
  token_to_logo: string
  usd_volume: string
  timestamp: string
  status: string
  filled_src_amount: string | null
  filled_dst_amount: string | null
  is_partial_fill: boolean
}

export interface VolumeOverTimeData {
  period: string
  volume: number
  swap_count: number
}

export interface DashboardResponse {
  swaps: SushiSwap[]
  statistics: {
    total_swaps: number
    total_volume_usd: number
    classic_swaps: number
    classic_volume_usd: number
    limit_order_swaps: number
    limit_order_volume_usd: number
    unique_wallets: number
  }
  pagination: {
    limit: number
    offset: number
    returned: number
  }
}

export interface VolumeOverTimeResponse {
  interval: string
  data: VolumeOverTimeData[]
}

export interface TopWallet {
  wallet_address: string
  total_volume: number
  swap_count: number
  classic_count: number
  limit_order_count: number
}

export interface TopWalletsResponse {
  wallets: TopWallet[]
}
