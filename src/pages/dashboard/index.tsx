import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import IconifyIcon from 'components/base/IconifyIcon';
import SecurityScore from 'components/sections/dashboard/security-score';
import AttackActivity from 'components/sections/dashboard/attack-activity';
import LiveThreatFeed from 'components/sections/dashboard/live-threat-feed';

export interface TechDiscoveryDetail {
  id: string;
  name: string;
  category?: string;
  observation?: string;
  confidence?: number;
  version?: string;
}

import DetectedVulnerabilities from 'components/sections/dashboard/detected-vulnerabilities';
import AttackSimulation from 'components/sections/dashboard/attack-simulation';
import { stackTechs } from 'data/stackTechs';

const signalCards = [
  {
    label: 'Protected services',
    value: '18',
    trend: '+4 this week',
    icon: 'hugeicons:server-stack-01',
    color: 'primary.main',
  },
  {
    label: 'Open findings',
    value: '7',
    trend: '3 critical',
    icon: 'hugeicons:bug-01',
    color: 'error.main',
  },
  {
    label: 'Mean response',
    value: '8m',
    trend: '42% faster',
    icon: 'hugeicons:clock-01',
    color: 'success.main',
  },
  {
    label: 'Blocked attempts',
    value: '1.4k',
    trend: 'live edge rules',
    icon: 'hugeicons:shield-block',
    color: 'warning.main',
  },
];

const activeControls = [
  { label: 'WAF policy', value: 92 },
  { label: 'Secrets hygiene', value: 84 },
  { label: 'Dependency patching', value: 76 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [scanProgress, setScanProgress] = useState(68);
  const [scanCycle, setScanCycle] = useState(1);
  const [siteUrl, setSiteUrl] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [discoveredTechs, setDiscoveredTechs] = useState<TechDiscoveryDetail[]>([]);

  const handleSiteScan = async () => {
    if (!siteUrl) return;
    setIsDetecting(true);
    setDiscoveredTechs([]);
    try {
      const response = await fetch('http://localhost:4000/api/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: siteUrl }),
      });
      const data = await response.json();
      if (data.status === 'success' && data.techs) {
        setDiscoveredTechs(data.techs);
      }
    } catch (error) {
      console.error('Detection failed:', error);
    } finally {
      setIsDetecting(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setScanProgress((current) => {
        const next = current >= 96 ? 54 : current + 7;
        if (next < current) {
          setScanCycle((cycle) => cycle + 1);
        }
        return next;
      });
    }, 2200);

    return () => clearInterval(timer);
  }, []);

  const criticalCount = useMemo(
    () =>
      stackTechs.reduce(
        (total, tech) => total + tech.knownVulns.filter((vuln) => vuln.severity === 'Critical').length,
        0,
      ),
    [],
  );

  return (
    <Stack direction="column" spacing={3.5}>
      <Paper
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: '8px',
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Stack
          direction={{ xs: 'column', lg: 'row' }}
          spacing={4}
          alignItems={{ xs: 'flex-start', lg: 'center' }}
          justifyContent="space-between"
        >
          <Stack spacing={2.5} sx={{ maxWidth: 680 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              <Chip label="Live security posture" color="primary" size="small" />
              <Chip label={`${criticalCount} critical checks`} color="error" variant="outlined" size="small" />
            </Stack>
            <Box>
              <Typography variant="h2" color="text.primary" sx={{ mb: 1, lineHeight: 1.08 }}>
                Command the full application attack surface.
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 640, lineHeight: 1.8 }}>
                Track stack risk, watch live threat signals, and run simulations before attackers
                find the same weak points.
              </Typography>
            </Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button variant="contained" color="primary" component={RouterLink} to="/pages/stack-analyzer">
                Analyze stack
              </Button>
              <Button variant="outlined" color="primary" component={RouterLink} to="/pages/vulnerabilities">
                Review findings
              </Button>
            </Stack>
          </Stack>

          <Box sx={{ width: { xs: '100%', lg: 360 } }}>
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle2" fontWeight={800} color="text.primary">
                  Continuous scan
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Cycle {scanCycle}
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={scanProgress}
                sx={{
                  height: 10,
                  borderRadius: '8px',
                  bgcolor: 'neutral.light',
                  '& .MuiLinearProgress-bar': { borderRadius: '8px' },
                }}
              />
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="caption" color="text.secondary">
                  Dependency graph
                </Typography>
                <Typography variant="caption" fontWeight={800} color="primary.main">
                  {scanProgress}%
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Paper>

      {/* NEW: Site Scanner Card */}
      <Paper
        sx={{
          p: 3,
          borderRadius: '8px',
          border: '1px solid',
          borderColor: 'primary.main',
          bgcolor: 'background.paper',
          boxShadow: '0 0 15px rgba(0, 255, 159, 0.05)',
        }}
      >
        <Stack spacing={2}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <IconifyIcon icon="hugeicons:search-02" sx={{ color: 'primary.main', width: 24, height: 24 }} />
            <Typography variant="h6" fontWeight={800} color="text.primary">
              Wappalyzer Site Scanner
            </Typography>
            <Chip label="AI POWERED" size="small" color="primary" sx={{ fontSize: '0.65rem', fontWeight: 900 }} />
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Enter any website URL to instantly detect its technology stack and run a security analysis.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="https://example.com"
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
              disabled={isDetecting}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  bgcolor: 'neutral.light',
                }
              }}
            />
            <Button
              variant="contained"
              color="primary"
              disabled={!siteUrl || isDetecting}
              onClick={handleSiteScan}
              startIcon={
                isDetecting ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <IconifyIcon icon="hugeicons:shield-search" style={{ width: 18, height: 18 }} />
                )
              }
              sx={{ 
                px: 4, 
                fontWeight: 800, 
                minWidth: 180,
                boxShadow: '0 0 20px rgba(0, 255, 159, 0.2)'
              }}
            >
              {isDetecting ? 'Detecting...' : 'Scan & Analyze'}
            </Button>
          </Stack>

          {discoveredTechs.length > 0 && (
            <Stack spacing={2} sx={{ mt: 3, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle2" fontWeight={800} color="primary.main">
                  DISCOVERY REPORT ({discoveredTechs.length} STACKS FOUND)
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  color="primary"
                  onClick={() => {
                    sessionStorage.setItem('pendingAnalysis', JSON.stringify(discoveredTechs));
                    navigate(`/pages/stack-analyzer`);
                  }}
                  endIcon={<IconifyIcon icon="hugeicons:arrow-right-01" />}
                  sx={{ fontWeight: 800, borderRadius: '6px' }}
                >
                  ANALYZE ALL STACKS
                </Button>
              </Stack>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {Object.entries(
                  discoveredTechs.reduce((acc: Record<string, TechDiscoveryDetail[]>, tech) => {
                    const cat = tech.category || 'Miscellaneous';
                    if (!acc[cat]) acc[cat] = [];
                    acc[cat].push(tech);
                    return acc;
                  }, {})
                ).map(([category, techs]) => (
                  <Box key={category}>
                    <Typography variant="body1" fontWeight={800} color="text.primary" sx={{ mb: 1.5 }}>
                      {category}
                    </Typography>
                    <Box 
                      sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, 
                        gap: 2 
                      }}
                    >
                      {techs.map((tech) => (
                        <Paper
                          key={tech.id}
                          sx={{
                            p: 2,
                            borderRadius: '8px',
                            bgcolor: 'neutral.light',
                            border: '1px solid',
                            borderColor: 'divider',
                            '&:hover': { borderColor: 'primary.main' }
                          }}
                        >
                          <Stack spacing={1}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Typography variant="body2" fontWeight={800} color="text.primary">
                                {tech.name} {tech.version && <Chip label={tech.version} size="small" variant="outlined" sx={{ height: 16, fontSize: '0.6rem' }} />}
                              </Typography>
                              <Typography variant="caption" fontWeight={700} color="success.main">
                                {tech.confidence}% Match
                              </Typography>
                            </Stack>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <IconifyIcon icon="hugeicons:eye" width={12} />
                              {tech.observation}
                            </Typography>
                          </Stack>
                        </Paper>
                      ))}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Stack>
          )}
        </Stack>
      </Paper>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
          gap: 2,
        }}
      >
        {signalCards.map((item) => (
          <Paper
            key={item.label}
            sx={{
              p: 2.5,
              borderRadius: '8px',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {item.label}
                </Typography>
                <Typography variant="h4" color="text.primary" sx={{ mt: 0.5 }}>
                  {item.value}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {item.trend}
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: '8px',
                  bgcolor: `${item.color}14`,
                  color: item.color,
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <IconifyIcon icon={item.icon} sx={{ width: 22, height: 22 }} />
              </Box>
            </Stack>
          </Paper>
        ))}
      </Box>

      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3}>
        <Stack direction="column" spacing={3} sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            <SecurityScore />
            <AttackActivity />
          </Stack>
          <Paper sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: '8px' }}>
            <Stack spacing={2.25}>
              <Typography variant="h6" color="text.primary">
                Control Readiness
              </Typography>
              {activeControls.map((control) => (
                <Box key={control.label}>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
                    <Typography variant="body2" fontWeight={700} color="text.primary">
                      {control.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {control.value}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={control.value}
                    sx={{ height: 8, borderRadius: '8px', bgcolor: 'neutral.light' }}
                  />
                </Box>
              ))}
            </Stack>
          </Paper>
          <DetectedVulnerabilities />
          <AttackSimulation />
        </Stack>

        <Stack
          sx={{
            width: { xs: '100%', lg: 400 },
            flexShrink: 0,
            maxHeight: { lg: 'calc(100vh - 96px)' },
            overflow: 'auto',
            borderRadius: '8px',
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <LiveThreatFeed />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Dashboard;
