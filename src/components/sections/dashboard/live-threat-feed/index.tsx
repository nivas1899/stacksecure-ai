import { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { styled, keyframes } from '@mui/material/styles';
import IconifyIcon from 'components/base/IconifyIcon';
import { threatPool, getInitialThreats, formatLiveTime, Threat } from 'data/threats';

type LiveThreat = Threat & { liveId: number };

const severityColor = {
  xss: 'error',
  bruteforce: 'error',
  exposure: 'warning',
  injection: 'error',
  ddos: 'warning',
} as const;

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const AlertItem = styled(Box)<{ threattype: string }>(({ theme, threattype }) => {
  const isError = ['xss', 'bruteforce', 'injection'].includes(threattype);
  const glowColor = isError ? theme.palette.error.main : theme.palette.warning.main;
  return {
    animation: `${slideIn} 0.3s ease`,
    padding: '12px',
    borderRadius: '8px',
    border: `1px solid ${glowColor}22`,
    backgroundColor: `${glowColor}0A`,
    transition: 'box-shadow 200ms ease',
    '&:hover': {
      boxShadow: `0 0 12px ${glowColor}33`,
      borderColor: `${glowColor}44`,
    },
  };
});

const LiveThreatFeed = () => {
  const [threats, setThreats] = useState<LiveThreat[]>(getInitialThreats());
  const counterRef = useRef(100);
  const poolIndexRef = useRef(6);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = poolIndexRef.current % threatPool.length;
      const newThreat: LiveThreat = {
        ...threatPool[nextIndex],
        liveId: counterRef.current++,
        time: formatLiveTime(),
      };
      poolIndexRef.current++;
      setThreats((prev) => [newThreat, ...prev].slice(0, 20));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Stack direction="column" height={1} spacing={0}>
      <Stack
        px={2.5}
        py={2}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        position="sticky"
        top={0}
        zIndex={10}
        sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="h6" fontWeight={800} color="text.primary">
            Live Threat Feed
          </Typography>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: 'error.main',
              boxShadow: '0 0 8px #FF4D5E',
              animation: `${keyframes`0%,100%{opacity:1}50%{opacity:.3}`} 2s ease infinite`,
            }}
          />
        </Stack>
        <Chip
          label={`${threats.length} alerts`}
          size="small"
          color="error"
          variant="outlined"
          sx={{ fontSize: '0.65rem', height: 20 }}
        />
      </Stack>

      <Stack
        direction="column"
        spacing={1}
        px={2}
        py={1.5}
        sx={{
          overflowY: 'auto',
          flex: 1,
          '&::-webkit-scrollbar': { width: 4 },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': { background: '#323449', borderRadius: 2 },
        }}
      >
        {threats.map((threat) => (
          <AlertItem key={threat.liveId} threattype={threat.type}>
            <Stack direction="row" alignItems="flex-start" spacing={1.25}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  display: 'grid',
                  placeItems: 'center',
                  color: `${severityColor[threat.type]}.main`,
                  bgcolor: `${severityColor[threat.type]}.main` + '14',
                  flexShrink: 0,
                }}
              >
                <IconifyIcon icon={threat.icon} sx={{ width: 18, height: 18 }} />
              </Box>
              <Stack direction="column" spacing={0.5} flex={1} minWidth={0}>
                <Typography
                  variant="body2"
                  color="text.primary"
                  fontWeight={500}
                  sx={{ lineHeight: 1.4 }}
                >
                  {threat.message}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                  <Typography variant="caption" color="text.secondary">
                    {threat.flag} {threat.country}
                  </Typography>
                  <Chip
                    label={threat.type.toUpperCase()}
                    size="small"
                    color={severityColor[threat.type]}
                    variant="outlined"
                    sx={{ fontSize: '0.6rem', height: 18, fontWeight: 700 }}
                  />
                </Stack>
                <Typography
                  variant="caption"
                  color="text.disabled"
                  sx={{ fontFamily: "'JetBrains Mono','Courier New',monospace" }}
                >
                  {threat.time || 'just now'}
                </Typography>
              </Stack>
            </Stack>
          </AlertItem>
        ))}
      </Stack>
    </Stack>
  );
};

export default LiveThreatFeed;
