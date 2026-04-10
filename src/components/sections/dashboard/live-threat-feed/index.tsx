import { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import { styled, keyframes } from '@mui/material/styles';
import IconifyIcon from 'components/base/IconifyIcon';
import { threatPool, getInitialThreats, formatLiveTime, Threat, ThreatType } from 'data/threats';

type LiveThreat = Threat & { liveId: number };

const threatColorMap: Record<ThreatType, 'error' | 'warning' | 'info' | 'success'> = {
  xss: 'error',
  bruteforce: 'error',
  exposure: 'warning',
  injection: 'error',
  ddos: 'warning',
  csrf: 'warning',
  ssrf: 'error',
  rce: 'error',
  lfi: 'error',
  idor: 'warning',
  xxe: 'error',
  deserialization: 'error',
  'supply-chain': 'error',
  jwt: 'error',
  oauth: 'warning',
  clickjacking: 'warning',
  mitm: 'error',
  'prototype-pollution': 'warning',
  'race-condition': 'warning',
  'open-redirect': 'info',
};

const threatIconMap: Record<ThreatType, string> = {
  xss: 'hugeicons:alert-02',
  bruteforce: 'hugeicons:login-03',
  exposure: 'hugeicons:database-01',
  injection: 'hugeicons:code-square',
  ddos: 'hugeicons:flash',
  csrf: 'hugeicons:shield-block',
  ssrf: 'hugeicons:arrow-move-up-right',
  rce: 'hugeicons:terminal-01',
  lfi: 'hugeicons:folder-open',
  idor: 'hugeicons:user-shield-02',
  xxe: 'hugeicons:xml',
  deserialization: 'hugeicons:package-01',
  'supply-chain': 'hugeicons:box-01',
  jwt: 'hugeicons:key-01',
  oauth: 'hugeicons:connect',
  clickjacking: 'hugeicons:cursor-01',
  mitm: 'hugeicons:wifi-signal-no-network',
  'prototype-pollution': 'hugeicons:bug-01',
  'race-condition': 'hugeicons:clock-01',
  'open-redirect': 'hugeicons:link-01',
};

const severityColorMap: Record<string, 'error' | 'warning' | 'info' | 'success'> = {
  critical: 'error',
  high: 'error',
  medium: 'warning',
  low: 'info',
};

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(-10px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(255, 77, 94, 0.6); }
  50% { opacity: 0.6; box-shadow: 0 0 0 6px rgba(255, 77, 94, 0); }
`;

const countUp = keyframes`
  from { transform: translateY(6px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const AlertItem = styled(Box)<{ threattype: ThreatType }>(({ theme, threattype }) => {
  const color =
    threatColorMap[threattype] === 'error'
      ? theme.palette.error.main
      : threatColorMap[threattype] === 'warning'
        ? theme.palette.warning.main
        : theme.palette.info.main;
  return {
    animation: `${slideIn} 0.35s cubic-bezier(0.22, 1, 0.36, 1)`,
    padding: '10px 12px',
    borderRadius: '8px',
    border: `1px solid ${color}22`,
    backgroundColor: `${color}09`,
    transition: 'all 200ms ease',
    cursor: 'default',
    '&:hover': {
      boxShadow: `0 0 14px ${color}28`,
      borderColor: `${color}40`,
      backgroundColor: `${color}13`,
    },
  };
});

const attackTypeCounts = (threats: LiveThreat[]) => {
  const map: Partial<Record<ThreatType, number>> = {};
  threats.forEach((t) => {
    map[t.type] = (map[t.type] || 0) + 1;
  });
  return map;
};

const LiveThreatFeed = () => {
  const [threats, setThreats] = useState<LiveThreat[]>(getInitialThreats());
  const [totalBlocked, setTotalBlocked] = useState(1407);
  const [activeNow, setActiveNow] = useState(3);
  const counterRef = useRef(100);
  const poolIndexRef = useRef(8);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = poolIndexRef.current % threatPool.length;
      const newThreat: LiveThreat = {
        ...threatPool[nextIndex],
        liveId: counterRef.current++,
        time: formatLiveTime(),
      };
      poolIndexRef.current++;
      setThreats((prev) => [newThreat, ...prev].slice(0, 25));
      setTotalBlocked((n) => n + Math.floor(Math.random() * 3 + 1));
      setActiveNow(Math.floor(Math.random() * 5 + 1));
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const typeCounts = attackTypeCounts(threats);
  const topTypes = Object.entries(typeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3) as [ThreatType, number][];

  const criticalCount = threats.filter((t) => t.severity === 'critical').length;

  return (
    <Stack direction="column" height={1} spacing={0}>
      {/* Header */}
      <Stack
        px={2.5}
        py={1.75}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        position="sticky"
        top={0}
        zIndex={10}
        sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              bgcolor: 'error.main',
              animation: `${pulse} 1.8s ease infinite`,
              flexShrink: 0,
            }}
          />
          <Typography variant="h6" fontWeight={800} color="text.primary">
            Live Threat Feed
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            label={`${criticalCount} critical`}
            size="small"
            color="error"
            sx={{ fontSize: '0.6rem', height: 20, fontWeight: 700 }}
          />
          <Chip
            label={`${threats.length} total`}
            size="small"
            color="default"
            variant="outlined"
            sx={{ fontSize: '0.6rem', height: 20 }}
          />
        </Stack>
      </Stack>

      {/* Live stats bar */}
      <Box
        sx={{
          px: 2.5,
          py: 1.25,
          bgcolor: 'error.main' + '0A',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack spacing={0}>
            <Typography variant="caption" color="text.disabled" fontSize="0.6rem" textTransform="uppercase" letterSpacing={0.8}>
              Total Blocked Today
            </Typography>
            <Typography
              variant="subtitle1"
              fontWeight={800}
              color="error.main"
              sx={{ animation: `${countUp} 0.3s ease`, fontFamily: "'JetBrains Mono', monospace" }}
            >
              {totalBlocked.toLocaleString()}
            </Typography>
          </Stack>
          <Divider orientation="vertical" flexItem />
          <Stack spacing={0} alignItems="center">
            <Typography variant="caption" color="text.disabled" fontSize="0.6rem" textTransform="uppercase" letterSpacing={0.8}>
              Active Attacks
            </Typography>
            <Typography
              variant="subtitle1"
              fontWeight={800}
              color="warning.main"
              sx={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {activeNow}
            </Typography>
          </Stack>
          <Divider orientation="vertical" flexItem />
          <Stack spacing={0} alignItems="flex-end">
            <Typography variant="caption" color="text.disabled" fontSize="0.6rem" textTransform="uppercase" letterSpacing={0.8}>
              Top Attack
            </Typography>
            <Typography variant="subtitle2" fontWeight={700} color="text.primary" fontSize="0.72rem">
              {topTypes[0]?.[0]?.toUpperCase() ?? '—'}
            </Typography>
          </Stack>
        </Stack>
      </Box>

      {/* Top attack types summary */}
      {topTypes.length > 0 && (
        <Stack
          direction="row"
          spacing={0.75}
          px={2.5}
          py={1}
          flexWrap="wrap"
          gap={0.75}
          sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
        >
          {topTypes.map(([type, count]) => (
            <Chip
              key={type}
              icon={
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 0.75 }}>
                  <IconifyIcon icon={threatIconMap[type]} sx={{ width: 12, height: 12 }} />
                </Box>
              }
              label={`${type.toUpperCase()} ×${count}`}
              size="small"
              color={threatColorMap[type]}
              variant="outlined"
              sx={{ fontSize: '0.58rem', height: 20, fontWeight: 700 }}
            />
          ))}
        </Stack>
      )}

      {/* Feed list */}
      <Stack
        direction="column"
        spacing={0.75}
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
        {threats.map((threat) => {
          const colorKey = threatColorMap[threat.type];
          const severityColorKey = severityColorMap[threat.severity];
          return (
            <AlertItem key={threat.liveId} threattype={threat.type}>
              <Stack direction="row" alignItems="flex-start" spacing={1.25}>
                {/* Icon */}
                <Box
                  sx={{
                    width: 30,
                    height: 30,
                    borderRadius: '7px',
                    display: 'grid',
                    placeItems: 'center',
                    color: `${colorKey}.main`,
                    bgcolor: `${colorKey}.main` + '16',
                    flexShrink: 0,
                  }}
                >
                  <IconifyIcon icon={threatIconMap[threat.type]} sx={{ width: 16, height: 16 }} />
                </Box>

                <Stack direction="column" spacing={0.4} flex={1} minWidth={0}>
                  {/* Message */}
                  <Typography
                    variant="body2"
                    color="text.primary"
                    fontWeight={500}
                    sx={{ lineHeight: 1.35, fontSize: '0.78rem' }}
                  >
                    {threat.message}
                  </Typography>

                  {/* Meta row */}
                  <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap">
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                      {threat.flag} {threat.country}
                    </Typography>
                    {threat.endpoint && (
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: '0.6rem',
                          fontFamily: "'JetBrains Mono', monospace",
                          color: 'text.disabled',
                          bgcolor: 'action.hover',
                          px: 0.5,
                          borderRadius: '3px',
                          maxWidth: 100,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {threat.endpoint}
                      </Typography>
                    )}
                    <Chip
                      label={threat.type.toUpperCase()}
                      size="small"
                      color={colorKey}
                      variant="outlined"
                      sx={{ fontSize: '0.55rem', height: 16, fontWeight: 700 }}
                    />
                    <Chip
                      label={threat.severity.toUpperCase()}
                      size="small"
                      color={severityColorKey}
                      sx={{ fontSize: '0.55rem', height: 16, fontWeight: 700 }}
                    />
                  </Stack>

                  {/* Timestamp */}
                  <Typography
                    variant="caption"
                    color="text.disabled"
                    sx={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace", fontSize: '0.62rem' }}
                  >
                    ⏱ {threat.time || 'just now'}
                  </Typography>
                </Stack>
              </Stack>
            </AlertItem>
          );
        })}
      </Stack>
    </Stack>
  );
};

export default LiveThreatFeed;
