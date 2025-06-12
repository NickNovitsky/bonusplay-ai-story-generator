import { supabase } from '@/lib/supabase'
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'

export default async function AdminUsagePage() {
  const { data: usageLogs } = await supabase.from('usage_logs').select('*').order('timestamp', { ascending: false }).limit(100)
  const { data: flags } = await supabase.from('abuse_flags').select('*')

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 6 }}>
      <Typography variant="h4">📊 Usage Logs</Typography>
      <Table sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>IP</TableCell>
            <TableCell>Action</TableCell>
            <TableCell>Timestamp</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {usageLogs?.map((row, i) => (
            <TableRow key={i}>
              <TableCell>{row.ip}</TableCell>
              <TableCell>{row.action}</TableCell>
              <TableCell>{new Date(row.timestamp).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Typography variant="h5" sx={{ mt: 5 }}>🚫 Flagged IPs</Typography>
      <Table sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>IP</TableCell>
            <TableCell>Flags</TableCell>
            <TableCell>Blocked</TableCell>
            <TableCell>Last Flagged</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {flags?.map((f, i) => (
            <TableRow key={i}>
              <TableCell>{f.ip}</TableCell>
              <TableCell>{f.flag_count}</TableCell>
              <TableCell>{f.blocked ? 'Yes' : 'No'}</TableCell>
              <TableCell>{new Date(f.last_flagged).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  )
}
