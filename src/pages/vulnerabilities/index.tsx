import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
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
import { stackTechs, TechVuln } from 'data/stackTechs';

const generateVulnsList = () => {
  const result: (TechVuln & { tech: string })[] = [];
  stackTechs.forEach((tech) => {
    tech.knownVulns.forEach((vuln) => {
      result.push({ ...vuln, tech: tech.name });
    });
  });
  return result;
};

const allVulnerabilities = generateVulnsList();

const severityColor = {
  Critical: 'error',
  Medium: 'warning',
  Low: 'success',
} as const;

const VulnRow = ({ item }: { item: TechVuln & { tech: string } }) => {
  const [open, setOpen] = useState(false);

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '8px',
        border: '1px solid',
        borderColor: open ? severityColor[item.severity] + '.main' : 'divider',
        bgcolor: open ? severityColor[item.severity] + '.main' + '08' : 'background.paper',
        overflow: 'hidden',
        transition: 'all 0.25s ease',
        '&:hover': {
          borderColor: severityColor[item.severity] + '.main',
          transform: 'translateY(-1px)',
          boxShadow: (theme) => `0 12px 30px -24px ${theme.palette[severityColor[item.severity]].main}`,
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
              bgcolor: severityColor[item.severity] + '.main' + '14',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <IconifyIcon
              icon={
                item.severity === 'Critical'
                  ? 'hugeicons:alert-01'
                  : item.severity === 'Medium'
                    ? 'hugeicons:alert-diamond'
                    : 'hugeicons:info-circle'
              }
              sx={{ color: severityColor[item.severity] + '.main', width: 24, height: 24 }}
            />
          </Box>
          <Stack spacing={0.5}>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              <Typography variant="subtitle1" fontWeight={800} color="text.primary">
                {item.type}
              </Typography>
              <Chip label={item.severity} color={severityColor[item.severity]} size="small" />
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              <Typography component="span" fontWeight={700} color="text.primary">
                {item.tech}
              </Typography>{' '}
              - {item.description}
            </Typography>
          </Stack>
        </Stack>

        <IconButton
          sx={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s',
            bgcolor: 'action.hover',
          }}
        >
          <IconifyIcon icon="iconamoon:arrow-down-2-light" />
        </IconButton>
      </Stack>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box sx={{ p: 3, pt: 0 }}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Box>
              <Typography variant="overline" color="text.secondary" fontWeight={800}>
                Detailed Context
              </Typography>
              <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.7 }}>
                This exposure can affect {item.tech} integrity, availability, or data boundaries
                when paired with weak input validation, permissive rules, or stale dependencies.
              </Typography>
            </Box>
            <Box>
              <Typography variant="overline" color="success.main" fontWeight={800}>
                Recommended Action
              </Typography>
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'success.main' + '11',
                  borderLeft: '4px solid',
                  borderColor: 'success.main',
                  borderRadius: '8px',
                  mt: 0.5,
                }}
              >
                <Typography variant="body2" color="text.primary" fontWeight={600}>
                  {item.fix}
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Box>
      </Collapse>
    </Paper>
  );
};

const Vulnerabilities = () => {
  const [severityFilter, setSeverityFilter] = useState('All');
  const [techFilter, setTechFilter] = useState('All');

  const filteredVulns = useMemo(() => {
    return allVulnerabilities.filter((v) => {
      const matchSeverity = severityFilter === 'All' || v.severity === severityFilter;
      const matchTech = techFilter === 'All' || v.tech === techFilter;
      return matchSeverity && matchTech;
    });
  }, [severityFilter, techFilter]);

  const uniqueTechs = Array.from(new Set(allVulnerabilities.map((v) => v.tech)));

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
          <Chip label="Risk registry" color="primary" size="small" sx={{ alignSelf: 'flex-start' }} />
          <Typography variant="h3" fontWeight={800} color="text.primary">
            Vulnerabilities Registry
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
            Review and triage current known security flaws derived from the active stack.
          </Typography>
        </Stack>

        <Stack direction="row" spacing={2} flexWrap="wrap" gap={2}>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Severity</InputLabel>
            <Select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)} label="Severity">
              <MenuItem value="All">All Levels</MenuItem>
              <MenuItem value="Critical">Critical</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Technology</InputLabel>
            <Select value={techFilter} onChange={(e) => setTechFilter(e.target.value)} label="Technology">
              <MenuItem value="All">All Tech</MenuItem>
              {uniqueTechs.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 2,
        }}
      >
        {(['Critical', 'Medium', 'Low'] as const).map((severity) => {
          const count = allVulnerabilities.filter((vuln) => vuln.severity === severity).length;
          const percent = Math.round((count / allVulnerabilities.length) * 100);
          return (
            <Paper
              key={severity}
              sx={{
                p: 2.5,
                borderRadius: '8px',
                border: '1px solid',
                borderColor: 'divider',
              }}
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
                  {percent}% of current registry
                </Typography>
              </Stack>
            </Paper>
          );
        })}
      </Box>

      <Stack direction="column" spacing={2}>
        {filteredVulns.length === 0 ? (
          <Paper sx={{ p: 5, textAlign: 'center', borderRadius: '8px', bgcolor: 'background.paper' }}>
            <IconifyIcon icon="hugeicons:shield-check" sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
            <Typography variant="h6">No Vulnerabilities Found</Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your filters or running a new scan.
            </Typography>
          </Paper>
        ) : (
          filteredVulns.map((item, index) => <VulnRow key={`${item.tech}-${index}`} item={item} />)
        )}
      </Stack>
    </Stack>
  );
};

export default Vulnerabilities;
