import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import SecurityScoreChart from './SecurityScoreChart';

const SCORE = 72;
const MAX_SCORE = 100;

const getRiskLevel = (score: number): { label: string; color: 'error' | 'warning' | 'success' } => {
  if (score >= 80) return { label: 'Low Risk', color: 'success' };
  if (score >= 60) return { label: 'Medium Risk', color: 'warning' };
  return { label: 'High Risk', color: 'error' };
};

const GlowPaper = styled(Paper)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  border: `1px solid ${theme.palette.divider}`,
  borderTop: `3px solid ${theme.palette.primary.main}`,
  boxShadow: `0 18px 45px -35px ${theme.palette.primary.main}`,
  backgroundColor: theme.palette.background.paper,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `radial-gradient(ellipse at top left, ${theme.palette.primary.main}0A 0%, transparent 70%)`,
    pointerEvents: 'none',
  },
}));

const SecurityScore = () => {
  const risk = getRiskLevel(SCORE);
  const chartData = [{ value: SCORE, detail: { valueAnimation: true, offsetCenter: ['0%', '0%'] } }];

  return (
    <GlowPaper>
      <Stack
        spacing={2.5}
        width={1}
        minHeight={214}
        alignItems={{ xs: 'center', md: 'flex-start' }}
        justifyContent="space-between"
        direction={{ xs: 'column', sm: 'row', md: 'column', xl: 'row' }}
      >
        <Box width={1} maxWidth={130}>
          <Typography variant="caption" color="text.secondary" letterSpacing={1} sx={{ textTransform: 'uppercase' }}>
            Security Score
          </Typography>
          <Typography variant="h3" fontWeight={700} color="text.primary" mt={1}>
            {SCORE}
            <Typography component="span" variant="h5" color="text.secondary" fontWeight={400}>
              /{MAX_SCORE}
            </Typography>
          </Typography>
          <Box mt={1.5}>
            <Chip
              label={risk.label}
              color={risk.color}
              size="small"
              sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: 0.5 }}
            />
          </Box>
        </Box>

        <Stack spacing={1.5} alignItems="center" width={1}>
          <SecurityScoreChart data={chartData} sx={{ width: 80, height: '80px !important' }} />
          <Typography variant="caption" color="text.secondary">
            up from 65 last week
          </Typography>
        </Stack>
      </Stack>
    </GlowPaper>
  );
};

export default SecurityScore;
