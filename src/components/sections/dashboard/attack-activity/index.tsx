import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import IconifyIcon from 'components/base/IconifyIcon';
import AttackActivityChart, { AttackSeriesData } from './AttackActivityChart';

const chartData: Record<string, AttackSeriesData> = {
  'this-week': {
    xss: [42, 58, 35, 80, 65, 48, 72],
    bruteForce: [18, 25, 40, 30, 55, 35, 42],
    apiAbuse: [30, 45, 28, 60, 38, 70, 55],
  },
  'last-week': {
    xss: [55, 38, 70, 45, 60, 30, 48],
    bruteForce: [22, 40, 18, 50, 28, 45, 35],
    apiAbuse: [40, 25, 55, 35, 48, 60, 30],
  },
  'two-weeks-ago': {
    xss: [30, 65, 45, 55, 38, 72, 50],
    bruteForce: [15, 35, 25, 40, 20, 38, 28],
    apiAbuse: [48, 32, 60, 25, 55, 40, 65],
  },
};

const legendItems = [
  { label: 'XSS Attempts', color: 'error.main' },
  { label: 'Brute Force', color: 'warning.main' },
  { label: 'API Abuse', color: 'primary.main' },
];

const AttackActivity = () => {
  const [data, setData] = useState<AttackSeriesData>(chartData['this-week']);
  const [week, setWeek] = useState('this-week');
  const [open, setOpen] = useState(false);

  const handleSelectChange = (event: SelectChangeEvent) => {
    const selected = event.target.value;
    setWeek(selected);
    setTimeout(() => {
      setData(chartData[selected] ?? chartData['this-week']);
    }, 100);
  };

  return (
    <Paper sx={{ flex: 1, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2} mt={-0.5}>
        <Stack direction="column" spacing={0.25}>
          <Typography variant="body1" color="text.primary" fontWeight={700}>
            Attack Activity
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" gap={1}>
            {legendItems.map((item) => (
              <Stack key={item.label} direction="row" spacing={0.75} alignItems="center">
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: item.color,
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {item.label}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Stack>

        <FormControl
          variant="filled"
          sx={{
            width: 110,
            '& .MuiInputBase-root': {
              '&:focus-within': { borderColor: 'transparent !important', boxShadow: 'none' },
            },
          }}
        >
          <Select
            id="attack-activity-select"
            value={week}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            onChange={handleSelectChange}
            IconComponent={() => (
              <IconifyIcon
                icon="iconamoon:arrow-down-2-duotone"
                sx={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            )}
          >
            <MenuItem value="this-week">This Week</MenuItem>
            <MenuItem value="last-week">Last Week</MenuItem>
            <MenuItem value="two-weeks-ago">Two Weeks Ago</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Box mt={2} borderRadius="8px" overflow="hidden" border="1px solid" borderColor="divider">
        <AttackActivityChart data={data} sx={{ height: '150px !important' }} />
      </Box>
    </Paper>
  );
};

export default AttackActivity;
