import { useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import LinearProgress from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconifyIcon from 'components/base/IconifyIcon';
import { vulnerabilities, Vulnerability } from 'data/vulnerabilities';

const severityColor = {
  Critical: 'error',
  High: 'error',
  Medium: 'warning',
  Low: 'success',
} as const;

const attackTypeIcon: Record<string, string> = {
  XSS: 'hugeicons:alert-02',
  LFI: 'hugeicons:folder-open',
  'LFI / Path Traversal': 'hugeicons:folder-open',
  'NoSQL Injection': 'hugeicons:database-01',
  'SQL Injection': 'hugeicons:code-square',
  'Open Redirect': 'hugeicons:link-01',
  SSRF: 'hugeicons:arrow-move-up-right',
  'Broken Access Control': 'hugeicons:lock-01',
  'Prototype Pollution': 'hugeicons:bug-01',
  'Supply Chain Attack': 'hugeicons:box-01',
  'JWT Attack': 'hugeicons:key-01',
  RCE: 'hugeicons:terminal-01',
  'CSRF / WebSocket Hijacking': 'hugeicons:shield-block',
  CSRF: 'hugeicons:shield-block',
  'Authentication Bypass': 'hugeicons:login-03',
  'Deserialization / RCE': 'hugeicons:package-01',
  'Deserialization': 'hugeicons:package-01',
  'SSTI / RCE': 'hugeicons:code-square',
  SSTI: 'hugeicons:code-square',
  'Information Disclosure': 'hugeicons:eye',
  'Credential Leakage': 'hugeicons:key-01',
  'Mass Assignment / Privilege Escalation': 'hugeicons:user-shield-02',
  'HTTP Request Smuggling': 'hugeicons:flash',
  DoS: 'hugeicons:flash',
  'XSS + Credential Theft': 'hugeicons:alert-02',
};

const VulnRow = ({ item }: { item: Vulnerability }) => {
  const [open, setOpen] = useState(false);
  const color = severityColor[item.severity];
  const icon = attackTypeIcon[item.attackType ?? ''] || 'hugeicons:shield-block';

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '10px',
        border: '1px solid',
        borderColor: open ? `${color}.main` : 'divider',
        bgcolor: open ? `${color}.main` + '08' : 'background.paper',
        overflow: 'hidden',
        transition: 'all 0.25s ease',
        '&:hover': {
          borderColor: `${color}.main`,
          transform: 'translateY(-1px)',
          boxShadow: (theme) => `0 12px 30px -24px ${theme.palette[color].main}`,
        },
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        justifyContent="space-between"
        sx={{ p: 2.5, gap: 2, cursor: 'pointer' }}
        onClick={() => setOpen(!open)}
      >
        <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ flex: 1 }}>
          <Box
            sx={{
              p: 1.25,
              borderRadius: '8px',
              bgcolor: `${color}.main` + '14',
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            <IconifyIcon icon={icon} sx={{ color: `${color}.main`, width: 22, height: 22 }} />
          </Box>
          <Stack spacing={0.5} flex={1}>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" gap={0.5}>
              <Typography variant="subtitle1" fontWeight={800} color="text.primary">
                {item.vuln}
              </Typography>
              <Chip label={item.severity} color={color} size="small" sx={{ fontWeight: 700 }} />
              {item.attackType && (
                <Chip
                  label={item.attackType}
                  size="small"
                  variant="outlined"
                  color={color}
                  sx={{ fontSize: '0.65rem' }}
                />
              )}
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" gap={0.5}>
              <Typography component="span" variant="body2" fontWeight={700} color="text.primary">
                {item.tech}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.version}
              </Typography>
              {item.cve && (
                <Chip
                  label={item.cve}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.6rem', height: 18, color: 'text.secondary' }}
                />
              )}
              {item.cvssScore !== undefined && (
                <Chip
                  label={`CVSS ${item.cvssScore}`}
                  size="small"
                  color={item.cvssScore >= 9 ? 'error' : item.cvssScore >= 7 ? 'warning' : 'success'}
                  sx={{ fontSize: '0.6rem', height: 18, fontWeight: 700 }}
                />
              )}
            </Stack>
          </Stack>
        </Stack>

        <IconButton
          sx={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s',
            bgcolor: 'action.hover',
            flexShrink: 0,
          }}
        >
          <IconifyIcon icon="iconamoon:arrow-down-2-light" />
        </IconButton>
      </Stack>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box sx={{ px: 3, pb: 3 }}>
          <Divider sx={{ mb: 2.5 }} />

          <Stack spacing={2.5}>
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" mb={0.75}>
                <IconifyIcon icon="hugeicons:info-circle" sx={{ color: 'info.main', width: 18, height: 18 }} />
                <Typography variant="overline" color="info.main" fontWeight={800} fontSize="0.7rem">
                  What Is It?
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.8 }}>
                {item.what}
              </Typography>
            </Box>

            <Box>
              <Stack direction="row" spacing={1} alignItems="center" mb={0.75}>
                <IconifyIcon icon="hugeicons:ai-security-01" sx={{ color: 'warning.main', width: 18, height: 18 }} />
                <Typography variant="overline" color="warning.main" fontWeight={800} fontSize="0.7rem">
                  Exposure Pattern
                </Typography>
              </Stack>
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'warning.main' + '0D',
                  borderLeft: '3px solid',
                  borderColor: 'warning.main',
                  borderRadius: '6px',
                }}
              >
                <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.8 }}>
                  {item.how}
                </Typography>
              </Box>
            </Box>

            <Box>
              <Stack direction="row" spacing={1} alignItems="center" mb={0.75}>
                <IconifyIcon icon="hugeicons:shield-check" sx={{ color: 'success.main', width: 18, height: 18 }} />
                <Typography variant="overline" color="success.main" fontWeight={800} fontSize="0.7rem">
                  Recommended Fix
                </Typography>
              </Stack>
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'success.main' + '11',
                  borderLeft: '4px solid',
                  borderColor: 'success.main',
                  borderRadius: '8px',
                }}
              >
                <Typography variant="body2" color="text.primary" fontWeight={600} sx={{ lineHeight: 1.8 }}>
                  {item.fix}
                </Typography>
              </Box>
            </Box>

            <Alert severity="info" sx={{ borderRadius: '8px' }}>
              Defensive use only. This registry does not provide exploit payloads, weaponization steps, or
              attack simulation.
            </Alert>
          </Stack>
        </Box>
      </Collapse>
    </Paper>
  );
};

const attackTypes = Array.from(new Set(vulnerabilities.map((v) => v.attackType).filter(Boolean)));

const Vulnerabilities = () => {
  const [severityFilter, setSeverityFilter] = useState('All');
  const [attackFilter, setAttackFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVulns = useMemo(() => {
    return vulnerabilities.filter((v) => {
      const matchSeverity = severityFilter === 'All' || v.severity === severityFilter;
      const matchAttack = attackFilter === 'All' || v.attackType === attackFilter;
      const matchSearch =
        !searchQuery ||
        v.vuln.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.tech.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.cve && v.cve.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (v.attackType && v.attackType.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchSeverity && matchAttack && matchSearch;
    });
  }, [severityFilter, attackFilter, searchQuery]);

  const avgCvss = (
    vulnerabilities.filter((v) => v.cvssScore).reduce((s, v) => s + (v.cvssScore ?? 0), 0) /
    vulnerabilities.filter((v) => v.cvssScore).length
  ).toFixed(1);

  return (
    <Stack direction="column" spacing={4}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
        gap={3}
        flexWrap="wrap"
      >
        <Stack spacing={1.5} sx={{ flex: 1, minWidth: 300 }}>
          <Stack direction="row" spacing={1}>
            <Chip label="Risk Registry" color="primary" size="small" sx={{ alignSelf: 'flex-start' }} />
            <Chip label="Defensive Guidance" color="info" size="small" variant="outlined" sx={{ alignSelf: 'flex-start' }} />
          </Stack>
          <Typography variant="h3" fontWeight={800} color="text.primary">
            Vulnerability Registry
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
            Review supported vulnerabilities by stack, understand exposure patterns at a high level, and
            move quickly to the safest fix and validation path.
          </Typography>
        </Stack>

        <Stack direction="row" spacing={2} flexWrap="wrap" gap={2}>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Severity</InputLabel>
            <Select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)} label="Severity">
              <MenuItem value="All">All Levels</MenuItem>
              <MenuItem value="Critical">Critical</MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 190 }}>
            <InputLabel>Attack Type</InputLabel>
            <Select value={attackFilter} onChange={(e) => setAttackFilter(e.target.value)} label="Attack Type">
              <MenuItem value="All">All Types</MenuItem>
              {attackTypes.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Stack>

      <Alert severity="info" sx={{ borderRadius: '10px' }}>
        This page summarizes public CVEs and common exposure patterns for awareness and remediation. It does
        not include exploitation walkthroughs or step-by-step reproduction instructions.
      </Alert>

      <Box
        component="input"
        placeholder="Search by CVE, technology, attack type, or vulnerability name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{
          width: '100%',
          px: 2,
          py: 1.5,
          borderRadius: '8px',
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          color: 'text.primary',
          fontSize: '0.9rem',
          fontFamily: 'inherit',
          outline: 'none',
          transition: 'border-color 0.2s',
          '&:focus': { borderColor: 'primary.main' },
        }}
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
          gap: 2,
        }}
      >
        {(
          [
            {
              label: 'Registry Entries',
              value: vulnerabilities.length,
              icon: 'hugeicons:bug-01',
              color: 'primary.main',
            },
            {
              label: 'Critical',
              value: vulnerabilities.filter((v) => v.severity === 'Critical').length,
              icon: 'hugeicons:alert-01',
              color: 'error.main',
            },
            {
              label: 'Covered Stacks',
              value: new Set(vulnerabilities.map((v) => v.tech)).size,
              icon: 'hugeicons:layers-01',
              color: 'info.main',
            },
            {
              label: 'Avg CVSS Score',
              value: avgCvss,
              icon: 'hugeicons:chart-bar',
              color: 'success.main',
            },
          ] as const
        ).map((card) => (
          <Paper
            key={card.label}
            sx={{
              p: 2.5,
              borderRadius: '10px',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '10px',
                  bgcolor: `${card.color}14`,
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,
                }}
              >
                <IconifyIcon icon={card.icon} sx={{ color: card.color, width: 22, height: 22 }} />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {card.label}
                </Typography>
                <Typography variant="h5" fontWeight={800} color="text.primary">
                  {card.value}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        ))}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
        {(['Critical', 'High', 'Medium', 'Low'] as const).map((severity) => {
          const count = vulnerabilities.filter((v) => v.severity === severity).length;
          const percent = Math.round((count / vulnerabilities.length) * 100);
          return (
            <Paper
              key={severity}
              sx={{ p: 2.5, borderRadius: '10px', border: '1px solid', borderColor: 'divider' }}
            >
              <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle2" fontWeight={800} color="text.primary">
                    {severity}
                  </Typography>
                  <Chip label={count} color={severityColor[severity]} size="small" />
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={percent}
                  color={severityColor[severity]}
                  sx={{ height: 8, borderRadius: '8px', bgcolor: 'neutral.light' }}
                />
                <Typography variant="caption" color="text.secondary">
                  {percent}% of registry - {count} vulnerabilities
                </Typography>
              </Stack>
            </Paper>
          );
        })}
      </Box>

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" color="text.secondary">
          Showing{' '}
          <Typography component="span" fontWeight={700} color="text.primary">
            {filteredVulns.length}
          </Typography>{' '}
          of {vulnerabilities.length} vulnerabilities
        </Typography>
        {(severityFilter !== 'All' || attackFilter !== 'All' || searchQuery) && (
          <Button
            size="small"
            variant="text"
            color="primary"
            onClick={() => {
              setSeverityFilter('All');
              setAttackFilter('All');
              setSearchQuery('');
            }}
          >
            Clear filters
          </Button>
        )}
      </Stack>

      <Stack direction="column" spacing={2}>
        {filteredVulns.length === 0 ? (
          <Paper sx={{ p: 5, textAlign: 'center', borderRadius: '10px', bgcolor: 'background.paper' }}>
            <IconifyIcon icon="hugeicons:shield-check" sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
            <Typography variant="h6">No Vulnerabilities Found</Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your filters or clearing your search query.
            </Typography>
          </Paper>
        ) : (
          filteredVulns.map((item) => <VulnRow key={item.id} item={item} />)
        )}
      </Stack>
    </Stack>
  );
};

export default Vulnerabilities;
