'use client'

import { useEffect, useState } from 'react'
import { getExecutions } from '@/lib/api'
import { BotExecution } from '@/lib/types'
import Link from 'next/link'
import {
  Box,
  Container,
  Stack,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material'
import GlowBox from '@/components/common/GlowBox'

export default function BotPage() {
  const [executions, setExecutions] = useState<BotExecution[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getExecutions()
      .then(data => setExecutions(data.executions))
      .catch(err => {
        console.error(err)
        setError('Failed to load executions')
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          bgcolor: '#050C19',
        }}
      >
        <CircularProgress sx={{ color: '#00F5E0' }} />
      </Box>
    )
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          bgcolor: '#050C19',
        }}
      >
        <Typography sx={{ color: '#ff6b6b', fontSize: '1.125rem' }}>{error}</Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#050C19',
        py: 4,
        px: 2,
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: 'white',
              mb: 2,
            }}
          >
            Bot Executions
          </Typography>

          <GlowBox>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#00F5E0', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem' }}>
                      ID
                    </TableCell>
                    <TableCell sx={{ color: '#00F5E0', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem' }}>
                      Strategy
                    </TableCell>
                    <TableCell sx={{ color: '#00F5E0', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem' }}>
                      Wallets
                    </TableCell>
                    <TableCell sx={{ color: '#00F5E0', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem' }}>
                      Volume
                    </TableCell>
                    <TableCell sx={{ color: '#00F5E0', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem' }}>
                      Status
                    </TableCell>
                    <TableCell sx={{ color: '#00F5E0', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem' }}>
                      Started
                    </TableCell>
                    <TableCell sx={{ color: '#00F5E0', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem' }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {executions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ color: 'rgba(255, 255, 255, 0.6)', py: 4 }}>
                        No executions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    executions.map(exec => (
                      <TableRow
                        key={exec.execution_id}
                        sx={{
                          '&:hover': {
                            bgcolor: 'rgba(0, 245, 224, 0.05)',
                          },
                        }}
                      >
                        <TableCell sx={{ color: 'rgba(255, 255, 255, 0.6)', fontFamily: 'monospace', fontSize: '0.875rem' }}>
                          {exec.execution_id.slice(0, 8)}...
                        </TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 500 }}>
                          {exec.strategy_name}
                        </TableCell>
                        <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                          {exec.completed_wallets}/{exec.total_wallets}
                          {exec.failed_wallets > 0 && (
                            <Box component="span" sx={{ color: '#ff6b6b', ml: 1 }}>
                              ({exec.failed_wallets} failed)
                            </Box>
                          )}
                        </TableCell>
                        <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                          ${exec.total_volume_usd.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={exec.status}
                            size="small"
                            sx={{
                              bgcolor:
                                exec.status === 'completed' ? 'rgba(34, 197, 94, 0.2)' :
                                exec.status === 'running' ? 'rgba(59, 130, 246, 0.2)' :
                                'rgba(239, 68, 68, 0.2)',
                              color:
                                exec.status === 'completed' ? '#4ade80' :
                                exec.status === 'running' ? '#60a5fa' :
                                '#f87171',
                              fontWeight: 600,
                              fontSize: '0.75rem',
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem' }}>
                          {new Date(exec.start_time).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/bot/execution/${exec.execution_id}`}
                            style={{
                              color: '#00F5E0',
                              fontWeight: 500,
                              textDecoration: 'none',
                            }}
                          >
                            View Details
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </GlowBox>
        </Stack>
      </Container>
    </Box>
  )
}
