import axios from 'axios'
import { BotExecution, ExecutionDetails, PortfolioSnapshot, DashboardResponse, VolumeOverTimeResponse } from './types'

const API_BASE = 'https://api.aggtrade.xyz/tracking'

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

export async function getExecutions(limit = 50, offset = 0) {
  const response = await api.get<{ executions: BotExecution[] }>(
    `/bot/executions?limit=${limit}&offset=${offset}`
  )
  return response.data
}

export async function getExecutionDetails(executionId: string) {
  const response = await api.get<ExecutionDetails>(`/bot/execution/${executionId}`)
  return response.data
}

export async function getPortfolioSnapshots(executionId: string, walletAddress: string) {
  const response = await api.get<{ snapshots: PortfolioSnapshot[] }>(
    `/bot/portfolio/${executionId}/${walletAddress}`
  )
  return response.data
}

export async function getSushiSwapDashboard(swapType?: 'CLASSIC' | 'LIMIT_ORDER') {
  const params = new URLSearchParams()
  if (swapType) {
    params.append('swap_type', swapType)
  }
  params.append('limit', '100')

  const response = await api.get<DashboardResponse>(
    `/sushiswap/dashboard?${params.toString()}`
  )
  return response.data
}

export async function getVolumeOverTime(swapType?: 'CLASSIC' | 'LIMIT_ORDER', interval = 'day') {
  const params = new URLSearchParams()
  params.append('interval', interval)
  if (swapType) {
    params.append('swap_type', swapType)
  }

  const response = await api.get<VolumeOverTimeResponse>(
    `/sushiswap/dashboard/volume-over-time?${params.toString()}`
  )
  return response.data
}
