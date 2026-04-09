import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import IconifyIcon from 'components/base/IconifyIcon';

const baselineControls = [
  {
    id: 'realtime',
    title: 'Real-time analysis',
    description: 'Scan route changes, dependency updates, and traffic bursts as they happen.',
    enabled: true,
    impact: 18,
  },
  {
    id: 'simulation',
    title: 'Attack simulation',
    description: 'Run scheduled XSS, injection, auth, and exposure probes against the selected stack.',
    enabled: true,
    impact: 16,
  },
  {
    id: 'threatFeed',
    title: 'Threat feed',
    description: 'Keep live intelligence visible across edge, API, and application events.',
    enabled: true,
    impact: 12,
  },
  {
    id: 'quarantine',
    title: 'Auto quarantine',
    description: 'Hold risky deployments until critical checks are reviewed.',
    enabled: false,
    impact: 14,
  },
];

const SecuritySettings = () => {
  const [controls, setControls] = useState(baselineControls);
  const [sensitivity, setSensitivity] = useState(68);

  const posture = useMemo(() => {
    const enabledImpact = controls.reduce((sum, control) => sum + (control.enabled ? control.impact : 0), 0);
    return Math.min(100, 38 + enabledImpact + Math.round(sensitivity / 10));
  }, [controls, sensitivity]);

  const toggleControl = (id: string) => {
    setControls((current) =>
      current.map((control) =>
        control.id === id ? { ...control, enabled: !control.enabled } : control,
      ),
    );
  };

  return (
    <Stack direction="column" spacing={4}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
        spacing={2}
      >
        <Stack spacing={1.25}>
          <Chip label="Policy center" color="primary" size="small" sx={{ alignSelf: 'flex-start' }} />
          <Typography variant="h3" fontWeight={800} color="text.primary">
            Security Settings
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 680, lineHeight: 1.8 }}>
            Tune the operating mode for analysis, simulation, and deployment protection.
          </Typography>
        </Stack>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '380px 1fr' },
          gap: 3,
        }}
      >
        <Paper sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: '8px' }}>
          <Stack spacing={2.5}>
            <Stack direction="row" spacing={1.25} alignItems="center">
              <IconifyIcon icon="hugeicons:shield-01" sx={{ width: 24, height: 24, color: 'primary.main' }} />
              <Typography variant="h6" color="text.primary">
                Protection Posture
              </Typography>
            </Stack>
            <Typography variant="h2" color="text.primary">
              {posture}
              <Typography component="span" variant="h5" color="text.secondary">
                /100
              </Typography>
            </Typography>
            <LinearProgress
              variant="determinate"
              value={posture}
              sx={{ height: 10, borderRadius: '8px', bgcolor: 'neutral.light' }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              Higher sensitivity catches more weak signals and may produce more review items.
            </Typography>
          </Stack>
        </Paper>

        <Paper sx={{ p: { xs: 3, md: 4 }, border: '1px solid', borderColor: 'divider', borderRadius: '8px' }}>
          <Stack spacing={4}>
            <Box>
              <Typography variant="subtitle1" fontWeight={800} color="text.primary" sx={{ mb: 1 }}>
                Risk Sensitivity
              </Typography>
              <Slider
                value={sensitivity}
                min={20}
                max={95}
                onChange={(_, value) => setSensitivity(value as number)}
                valueLabelDisplay="auto"
              />
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="caption" color="text.secondary">
                  Calm
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Strict
                </Typography>
              </Stack>
            </Box>

            <Stack spacing={2}>
              {controls.map((control) => (
                <Box
                  key={control.id}
                  sx={{
                    p: 2,
                    border: '1px solid',
                    borderColor: control.enabled ? 'primary.main' : 'divider',
                    borderRadius: '8px',
                    bgcolor: control.enabled ? 'primary.main' + '08' : 'transparent',
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                    <Stack spacing={0.5}>
                      <Typography variant="subtitle1" fontWeight={800} color="text.primary">
                        {control.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                        {control.description}
                      </Typography>
                    </Stack>
                    <Switch
                      checked={control.enabled}
                      color="primary"
                      onChange={() => toggleControl(control.id)}
                    />
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Stack>
        </Paper>
      </Box>
    </Stack>
  );
};

export default SecuritySettings;
