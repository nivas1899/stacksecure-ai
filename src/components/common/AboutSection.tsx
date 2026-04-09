import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconifyIcon from 'components/base/IconifyIcon';
import { useThemeMode } from 'context/ThemeContext';

const AboutSection = () => {
  const { mode } = useThemeMode();

  return (
    <Paper
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: '8px',
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        transition: 'all 0.3s ease',
        ...(mode === 'hacker' && {
          boxShadow: '0 0 20px #00FF9F08',
        }),
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={3}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        justifyContent="space-between"
      >
        <Box>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
            <IconifyIcon
              icon="hugeicons:shield-check"
              sx={{
                width: 22,
                height: 22,
                color: 'primary.main',
                ...(mode === 'hacker' && {
                  filter: 'drop-shadow(0 0 4px currentColor)',
                }),
              }}
            />
            <Typography variant="h6" fontWeight={800} color="text.primary">
              DNX Security Command
            </Typography>
          </Stack>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ lineHeight: 1.8, maxWidth: 780 }}
          >
            Analyze the stack, surface risk, monitor active signals, and rehearse attack paths
            from one focused security workspace.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
          {['Stack intelligence', 'Threat telemetry', 'Simulation lab'].map((item) => (
            <Box
              key={item}
              sx={{
                px: 1.5,
                py: 0.75,
                borderRadius: '8px',
                border: '1px solid',
                borderColor: 'divider',
                color: 'text.secondary',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
            >
              {item}
            </Box>
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
};

export default AboutSection;
