import { useState, useMemo, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import IconifyIcon from 'components/base/IconifyIcon';
import { stackTechs, StackTech } from 'data/stackTechs';
import { useThemeMode } from 'context/ThemeContext';
import TechGrid from './TechGrid';
import AnalysisOutput from './AnalysisOutput';

const filterTechOptions = createFilterOptions<StackTech>({
  stringify: (option) =>
    `${option.name} ${option.packageName} ${option.ecosystem} ${option.category}`,
});

const StackAnalyzer = () => {
  const { mode } = useThemeMode();
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [analysisReady, setAnalysisReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState<StackTech | null>(null);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (analysisReady && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [analysisReady]);

  const selectedTechs = useMemo(
    () => stackTechs.filter((t) => !!selected[t.id]),
    [selected],
  );

  const handleSelect = (techId: string, version: string) => {
    setSelected((prev) => ({ ...prev, [techId]: version }));
    setAnalysisReady(false);
  };

  const handleDeselect = (techId: string) => {
    setSelected((prev) => {
      const next = { ...prev };
      delete next[techId];
      return next;
    });
    setAnalysisReady(false);
    if (selectedTechs.length <= 1) {
      setHasAnalyzed(false);
    }
  };

  const handleAutocompleteSelect = (_: React.SyntheticEvent, tech: StackTech | null) => {
    if (tech && !selected[tech.id]) {
      handleSelect(tech.id, tech.versions[0]);
    }
    setSearchValue(null);
  };

  const handleAnalyze = () => {
    if (selectedTechs.length === 0) return;
    setHasAnalyzed(true);
    setLoading(true);
    setAnalysisReady(false);
    setTimeout(() => {
      setLoading(false);
      setAnalysisReady(true);
    }, 1500);
  };

  const handleClear = () => {
    setSelected({});
    setAnalysisReady(false);
    setHasAnalyzed(false);
  };

  return (
    <Stack direction="column" spacing={5}>
      {/* Page Header */}
      <Stack direction="column" spacing={3}>
        <Stack direction="column" spacing={1.5}>
          <Stack spacing={1.5} alignItems="center" direction="row">
            <IconifyIcon
              icon="hugeicons:search-02"
              sx={{
                color: 'primary.main',
                width: 28,
                height: 28,
                ...(mode === 'hacker' && { filter: 'drop-shadow(0 0 6px currentColor)' }),
              }}
            />
            <Typography variant="h4" fontWeight={700} color="text.primary">
              Stack Analyzer
            </Typography>
          </Stack>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600 }}>
            Select your tech stack, then run an analysis to detect vulnerabilities and attack vectors.
          </Typography>
        </Stack>

        <Autocomplete
          options={stackTechs}
          getOptionLabel={(option) => option.name}
          filterOptions={filterTechOptions}
          value={searchValue}
          onChange={handleAutocompleteSelect}
          popupIcon={<IconifyIcon icon="hugeicons:arrow-down-01" width={20} />}
          clearIcon={<IconifyIcon icon="hugeicons:cancel-01" width={18} />}
          sx={{ 
            maxWidth: 400,
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              bgcolor: mode === 'hacker' ? '#F4FFF7' : '#FFFFFF',
              color: mode === 'hacker' ? '#050505' : 'text.primary',
              transition: 'all 0.2s ease',
              p: '4px 8px',
              '& input': {
                color: mode === 'hacker' ? '#050505' : 'text.primary',
                fontWeight: 700,
              },
              '& input::placeholder': {
                color: mode === 'hacker' ? '#111111' : 'text.secondary',
                opacity: mode === 'hacker' ? 0.8 : 1,
              },
              '& .MuiAutocomplete-popupIndicator, & .MuiAutocomplete-clearIndicator': {
                color: mode === 'hacker' ? '#050505' : 'text.secondary',
              },
              '& fieldset': {
                borderColor: mode === 'hacker' ? 'primary.main' : 'divider',
                opacity: mode === 'hacker' ? 0.9 : 1,
                borderWidth: '1px',
              },
              '&:hover fieldset': {
                borderColor: 'primary.main',
                opacity: 1,
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
                borderWidth: '1px',
                boxShadow: mode === 'hacker' ? '0 0 0 3px rgba(0,255,159,0.16)' : '0 0 0 3px rgba(0, 112, 243, 0.1)',
              },
            }
          }}
          ListboxProps={{
            sx: {
              p: 1,
              bgcolor: mode === 'hacker' ? '#111111' : 'background.paper',
              boxShadow: mode === 'hacker' ? '0 8px 32px rgba(0,255,159,0.1)' : '0 10px 40px -10px rgba(0,0,0,0.1)',
              borderRadius: '12px',
              border: '1px solid',
              borderColor: mode === 'hacker' ? 'primary.main' : 'transparent',
              mt: 1,
              '& .MuiAutocomplete-option': {
                borderRadius: '8px',
                p: 1.5,
                mb: 0.5,
                transition: 'all 0.2s ease',
                '&[aria-selected="true"]': {
                  bgcolor: mode === 'hacker' ? 'primary.main' + '22' : 'action.selected',
                },
                '&[aria-selected="true"].Mui-focused': {
                  bgcolor: mode === 'hacker' ? 'primary.main' + '33' : 'action.hover',
                },
                '&:hover': {
                  bgcolor: mode === 'hacker' ? 'primary.main' + '11' : 'action.hover',
                }
              }
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              placeholder="Search tech (React, Node...)"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <>
                    <IconifyIcon
                      icon="hugeicons:search-02"
                      sx={{
                        color: mode === 'hacker' ? '#050505' : 'text.secondary',
                        ml: 1,
                        width: 22,
                        height: 22,
                      }}
                    />
                    {params.InputProps.startAdornment}
                  </>
                ),
              }}
            />
          )}
          renderOption={(props, option) => (
            <Box component="li" {...props} key={option.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <IconifyIcon icon={option.icon} sx={{ width: 24, height: 24 }} />
              <Stack direction="column" spacing={0}>
                <Typography variant="body2" fontWeight={700} color="text.primary">
                  {option.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {option.packageName} - {option.ecosystem}
                </Typography>
              </Stack>
            </Box>
          )}
        />

        {/* Selected chips */}
        {selectedTechs.length > 0 && (
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
            {selectedTechs.map((tech) => (
              <Chip
                key={tech.id}
                icon={<IconifyIcon icon={tech.icon} style={{ width: 16, height: 16 }} />}
                label={`${tech.name} v${selected[tech.id]}`}
                onDelete={() => handleDeselect(tech.id)}
                color="primary"
                variant="outlined"
                size="small"
                sx={{
                  fontWeight: 700,
                  ...(mode === 'hacker' && {
                    bgcolor: '#66FFC2',
                    borderColor: '#66FFC2',
                    color: '#050505',
                    '& .MuiChip-icon': {
                      color: '#050505',
                    },
                    '& .MuiChip-deleteIcon': {
                      color: '#050505',
                      opacity: 0.72,
                      '&:hover': {
                        color: '#000000',
                        opacity: 1,
                      },
                    },
                  }),
                }}
              />
            ))}
            <Chip
              label="Clear all"
              onClick={handleClear}
              size="small"
              variant="outlined"
              sx={{
                fontWeight: 700,
                color: mode === 'hacker' ? '#050505' : 'text.secondary',
                borderColor: mode === 'hacker' ? '#66FFC2' : 'divider',
                cursor: 'pointer',
                ...(mode === 'hacker' && {
                  '&:hover': {
                    bgcolor: '#66FFC214',
                    borderColor: '#66FFC2',
                  },
                }),
              }}
            />
          </Stack>
        )}
      </Stack>

      {/* Tech Selection Grid */}
      <Stack direction="column" spacing={3}>
        <Stack
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
        >
          <Stack direction="column" spacing={0.5}>
            <Typography variant="h5" fontWeight={700} color="text.primary">
              Select Technologies
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {selectedTechs.length} / {stackTechs.length} selected
            </Typography>
          </Stack>
          <Button
            variant="contained"
            color="primary"
            disabled={selectedTechs.length === 0 || loading}
            onClick={handleAnalyze}
            startIcon={
              loading ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <IconifyIcon icon="hugeicons:shield-user" style={{ width: 18, height: 18 }} />
              )
            }
            sx={{
              py: 1.25,
              px: 3,
              fontWeight: 800,
              width: { xs: '100%', sm: 'auto' },
              minWidth: 180,
              ...(mode === 'hacker' && {
                boxShadow: '0 0 20px #00FF9F33',
                '&:hover': {
                  boxShadow: '0 0 30px #00FF9F55',
                },
              }),
            }}
          >
            {loading ? 'Analyzing...' : 'Analyze Stack'}
          </Button>
        </Stack>

        <TechGrid
          techs={stackTechs}
          selected={selected}
          onSelect={handleSelect}
          onDeselect={handleDeselect}
        />
      </Stack>

      {/* Analyze Button */}
      <Stack alignItems="center">
        <Button
          variant="outlined"
          color="primary"
          size="large"
          disabled={selectedTechs.length === 0 || loading}
          onClick={handleAnalyze}
          startIcon={
            loading ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <IconifyIcon icon="hugeicons:shield-user" style={{ width: 18, height: 18 }} />
            )
          }
          sx={{
            borderRadius: '10px',
            py: 1.5,
            px: 6,
            fontWeight: 700,
            width: { xs: '100%', sm: 'auto' },
            minWidth: 240,
            transition: 'all 0.3s ease',
            ...(mode === 'hacker' && {
              boxShadow: '0 0 20px #00FF9F33',
              '&:hover': {
                boxShadow: '0 0 30px #00FF9F55',
              },
            }),
          }}
        >
          {loading ? 'Analyzing Stack...' : 'Analyze Stack'}
        </Button>
      </Stack>

      {/* Results Section */}
      {(hasAnalyzed || loading) && (
        <Box
          ref={resultsRef}
          sx={{
            pt: 4,
            borderTop: '1px solid',
            borderColor: 'divider',
            opacity: hasAnalyzed ? 1 : 0,
            visibility: hasAnalyzed ? 'visible' : 'hidden',
            transition: 'opacity 0.6s ease-in',
          }}
        >
          {loading && (
            <Stack minHeight={300} alignItems="center" justifyContent="center" spacing={2}>
              <CircularProgress color="primary" />
              <Typography variant="body2" color="text.secondary">
                Scanning {selectedTechs.length} technologies for vulnerabilities...
              </Typography>
            </Stack>
          )}

          {analysisReady && !loading && (
            <AnalysisOutput selectedTechs={selectedTechs} versions={selected} />
          )}
        </Box>
      )}
    </Stack>
  );
};

export default StackAnalyzer;
