import { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { styled, keyframes } from '@mui/material/styles';
import IconifyIcon from 'components/base/IconifyIcon';

interface LogLine {
  id: number;
  text: string;
  status: 'running' | 'success' | 'error' | 'info';
  delay: number;
}

const allLogLines: LogLine[] = [
  { id: 1, text: '> Initializing attack simulation engine...', status: 'info', delay: 0 },
  { id: 2, text: '> Scanning target stack: React 18 + Node.js 18 + MongoDB', status: 'info', delay: 800 },
  { id: 3, text: '> Probing authentication endpoints...', status: 'running', delay: 1600 },
  { id: 4, text: '> Injecting XSS payload into /api/comments...', status: 'running', delay: 2400 },
  { id: 5, text: '! XSS payload executed - script injection confirmed', status: 'error', delay: 3200 },
  { id: 6, text: '> Testing NoSQL injection via $where operator...', status: 'running', delay: 4000 },
  { id: 7, text: '! MongoDB query bypassed - database records exposed', status: 'error', delay: 4800 },
  { id: 8, text: '> Attempting brute force on SSH port 22...', status: 'running', delay: 5600 },
  { id: 9, text: '> Bypassing authentication via JWT none algorithm...', status: 'running', delay: 6400 },
  { id: 10, text: '! Access granted - admin privileges escalated', status: 'error', delay: 7200 },
  { id: 11, text: '> Extracting environment variables from process.env...', status: 'running', delay: 8000 },
  { id: 12, text: '! Found: DB_PASSWORD, JWT_SECRET, AWS_ACCESS_KEY', status: 'error', delay: 8800 },
  { id: 13, text: '> Simulation complete. 4 critical vulnerabilities found.', status: 'info', delay: 9600 },
  { id: 14, text: '> Generating security report...', status: 'success', delay: 10400 },
  { id: 15, text: '+ Report saved to /reports/sim-2026-04-09.json', status: 'success', delay: 11200 },
];

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

const TerminalWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: '#060713',
  borderRadius: '8px',
  border: `1px solid ${theme.palette.divider}`,
  overflow: 'hidden',
  fontFamily: "'JetBrains Mono', 'Courier New', monospace",
}));

const TerminalBar = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: '10px 16px',
}));

const getLineColor = (status: LogLine['status']) => {
  switch (status) {
    case 'error':
      return '#FF4D5E';
    case 'success':
      return '#2E8B57';
    case 'running':
      return '#FFB054';
    default:
      return '#8E92BC';
  }
};

const AttackSimulation = () => {
  const [visibleLines, setVisibleLines] = useState<LogLine[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const runSimulation = () => {
    clearTimeouts();
    setVisibleLines([]);
    setIsRunning(true);
    setIsDone(false);

    allLogLines.forEach((line) => {
      const t = setTimeout(() => {
        setVisibleLines((prev) => [...prev, line]);
        if (line.id === allLogLines.length) {
          setIsRunning(false);
          setIsDone(true);
        }
      }, line.delay);
      timeoutsRef.current.push(t);
    });
  };

  useEffect(() => {
    runSimulation();
    return clearTimeouts;
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleLines]);

  return (
    <Stack direction="column" spacing={1.5} width={1}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
        <Stack direction="row" spacing={1} alignItems="center">
          <IconifyIcon icon="hugeicons:terminal-01" color="text.primary" fontSize="h4.fontSize" />
          <Typography variant="h4">Attack Simulation</Typography>
        </Stack>
        <Button
          variant="outlined"
          color="error"
          size="small"
          disabled={isRunning}
          onClick={runSimulation}
          sx={{ minWidth: 120 }}
        >
          {isRunning ? 'Running...' : isDone ? 'Re-run Sim' : 'Run Simulation'}
        </Button>
      </Stack>

      <TerminalWrapper>
        <TerminalBar direction="row" spacing={0.75} alignItems="center">
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#FF5F57' }} />
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#FEBC2E' }} />
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#28C840' }} />
          <Typography variant="caption" color="text.secondary" ml={1.5} sx={{ fontFamily: 'inherit' }}>
            dnx-command - attack-sim - bash
          </Typography>
        </TerminalBar>

        <Box
          ref={scrollRef}
          sx={{
            p: 2,
            height: 280,
            overflowY: 'auto',
            '&::-webkit-scrollbar': { width: 4 },
            '&::-webkit-scrollbar-track': { background: 'transparent' },
            '&::-webkit-scrollbar-thumb': { background: '#323449', borderRadius: 2 },
          }}
        >
          {visibleLines.map((line) => {
            const now = new Date();
            const ts = `[${now.getHours().toString().padStart(2, '0')}:${now
              .getMinutes()
              .toString()
              .padStart(2, '0')}:${(now.getSeconds() + line.id).toString().padStart(2, '0')}]`;
            return (
              <Box key={line.id} mb={0.75}>
                <Typography
                  component="span"
                  sx={{
                    fontFamily: 'inherit',
                    fontSize: '0.78rem',
                    color: '#54577A',
                    mr: 1,
                  }}
                >
                  {ts}
                </Typography>
                <Typography
                  component="span"
                  sx={{
                    fontFamily: 'inherit',
                    fontSize: '0.78rem',
                    color: getLineColor(line.status),
                    lineHeight: 1.6,
                  }}
                >
                  {line.text}
                </Typography>
              </Box>
            );
          })}
          {isRunning && (
            <Typography
              component="span"
              sx={{
                fontFamily: 'inherit',
                fontSize: '0.78rem',
                color: '#2E8B57',
                animation: `${blink} 1s step-end infinite`,
              }}
            >
              |
            </Typography>
          )}
        </Box>
      </TerminalWrapper>
    </Stack>
  );
};

export default AttackSimulation;
