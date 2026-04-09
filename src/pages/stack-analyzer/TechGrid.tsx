import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import { styled } from '@mui/material/styles';
import IconifyIcon from 'components/base/IconifyIcon';
import { StackTech } from 'data/stackTechs';

interface TechGridProps {
  techs: StackTech[];
  selected: Record<string, string>;
  onSelect: (techId: string, version: string) => void;
  onDeselect: (techId: string) => void;
}

const TechCard = styled(Box)<{ isselected: string }>(({ theme, isselected }) => ({
  position: 'relative',
  padding: '16px 12px',
  borderRadius: '8px',
  border: `1px solid ${isselected === 'true' ? theme.palette.primary.main : theme.palette.divider}`,
  backgroundColor: isselected === 'true'
    ? `${theme.palette.primary.main}11`
    : theme.palette.background.paper,
  cursor: 'pointer',
  transition: 'all 0.25s ease',
  boxShadow: isselected === 'true' ? `0 0 16px ${theme.palette.primary.main}33` : 'none',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 12px ${theme.palette.primary.main}22`,
    transform: 'translateY(-2px)',
  },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '100%',
  gap: '8px',
}));

const TechGrid = ({ techs, selected, onSelect, onDeselect }: TechGridProps) => {
  return (
    <Box
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(2, 1fr)',
        sm: 'repeat(3, 1fr)',
        md: 'repeat(4, 1fr)',
      }}
      gap={2}
    >
      {techs.map((tech) => {
        const isSelected = !!selected[tech.id];
        return (
          <TechCard
            key={tech.id}
            isselected={isSelected.toString()}
            onClick={() => {
              if (isSelected) {
                onDeselect(tech.id);
              } else {
                onSelect(tech.id, tech.versions[0]);
              }
            }}
          >
            {isSelected && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IconifyIcon
                  icon="mdi:check"
                  sx={{ width: 12, height: 12, color: 'white' }}
                />
              </Box>
            )}
            <IconifyIcon icon={tech.icon} sx={{ width: 36, height: 36 }} />
            <Typography variant="subtitle2" fontWeight={700} color="text.primary" align="center">
              {tech.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" align="center">
              {tech.ecosystem} - {tech.category}
            </Typography>

            {isSelected && (
              <FormControl
                size="small"
                variant="outlined"
                onClick={(e) => e.stopPropagation()}
                sx={{ width: '100%' }}
              >
                <Select
                  value={selected[tech.id]}
                  onChange={(e) => {
                    e.stopPropagation();
                    onSelect(tech.id, e.target.value);
                  }}
                  sx={{
                    fontSize: '0.7rem',
                    height: 28,
                    borderRadius: '6px',
                    '& .MuiSelect-select': { py: 0, px: 1 },
                  }}
                >
                  {tech.versions.map((v) => (
                    <MenuItem key={v} value={v} sx={{ fontSize: '0.75rem' }}>
                      v{v}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {!isSelected && (
              <Stack spacing={0.5} direction="row" flexWrap="wrap" justifyContent="center">
                <Typography variant="caption" color="primary.main" sx={{ fontSize: '0.68rem' }}>
                  Real OSV scan
                </Typography>
              </Stack>
            )}
          </TechCard>
        );
      })}
    </Box>
  );
};

export default TechGrid;
