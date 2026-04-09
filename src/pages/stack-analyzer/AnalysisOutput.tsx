import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { styled } from '@mui/material/styles';
import { keyframes } from '@mui/system';
import IconifyIcon from 'components/base/IconifyIcon';
import { StackTech } from 'data/stackTechs';

interface AnalysisOutputProps {
  selectedTechs: StackTech[];
  versions: Record<string, string>;
}

interface ApiVulnerability {
  id: string;
  summary: string;
  severity: string;
}

interface ApiAttackInsight {
  attack: string;
  description: string;
  impact: string;
  firstAction: string;
  evidence?: Array<{ id: string; summary: string }>;
}

interface ApiAnalysis {
  vulnerabilities: ApiVulnerability[];
  attacks: string[];
  attackDetails?: ApiAttackInsight[];
  fixes: string[];
  message: string;
  cached?: boolean;
}

interface Finding extends ApiVulnerability {
  tech: string;
  version: string;
  ecosystem: string;
}

const API_BASE_URLS = [
  import.meta.env.VITE_API_BASE_URL,
  '/api',
  'http://127.0.0.1:4000/api',
  'http://localhost:4000/api',
].filter(Boolean) as string[];

const attackMatchers = [
  { keyword: 'script', attack: 'XSS' },
  { keyword: 'injection', attack: 'Injection' },
  { keyword: 'auth', attack: 'Auth Bypass' },
  { keyword: 'path', attack: 'Path Traversal' },
];

const attackDetails: Record<
  string,
  { description: string; impact: string; firstAction: string; color: 'error' | 'warning' | 'info' | 'success' }
> = {
  XSS: {
    description:
      'Cross-site scripting can execute attacker-controlled JavaScript in a victim browser context.',
    impact: 'Session theft, account takeover, and client-side data exfiltration are possible.',
    firstAction: 'Sanitize rendered HTML and apply strict output encoding.',
    color: 'error',
  },
  Injection: {
    description:
      'Injection flaws allow untrusted input to alter command or query behavior at runtime.',
    impact: 'Unauthorized data access, data tampering, and remote command execution can occur.',
    firstAction: 'Use parameterized queries and validate untrusted input paths.',
    color: 'error',
  },
  'Auth Bypass': {
    description:
      'Authentication bypass lets an attacker skip identity checks and access protected routes.',
    impact: 'Privilege escalation and unauthorized access to sensitive workflows are possible.',
    firstAction: 'Re-check auth middleware order and token/session validation rules.',
    color: 'warning',
  },
  'Path Traversal': {
    description:
      'Path traversal can expose files outside intended directories through crafted file paths.',
    impact: 'Configuration disclosure and access to secrets or private files may happen.',
    firstAction: 'Normalize and constrain file paths to trusted root directories.',
    color: 'warning',
  },
};

const defaultFixes = ['Update to latest version', 'Sanitize inputs'];

const getAttackTypes = (vulnerabilities: ApiVulnerability[]) => {
  const attacks = new Set<string>();
  vulnerabilities.forEach((vuln) => {
    const summary = (vuln.summary || '').toLowerCase();
    attackMatchers.forEach(({ keyword, attack }) => {
      if (summary.includes(keyword)) attacks.add(attack);
    });
  });
  return Array.from(attacks);
};

const getFixes = (attacks: string[]) => {
  const fixes = new Set(defaultFixes);
  if (attacks.includes('XSS')) fixes.add('Escape output and sanitize rendered HTML');
  if (attacks.includes('Injection')) fixes.add('Use parameterized queries and validate user input');
  if (attacks.includes('Auth Bypass')) fixes.add('Review authentication middleware and session handling');
  if (attacks.includes('Path Traversal')) fixes.add('Normalize file paths and restrict access to trusted directories');
  return Array.from(fixes);
};

const fetchFromOsvDirect = async (
  body: {
    packageName: string;
    ecosystem: string;
    version: string;
  },
  signal: AbortSignal,
) => {
  const response = await fetch('https://api.osv.dev/v1/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      package: {
        name: body.packageName,
        ecosystem: body.ecosystem,
      },
      version: body.version,
    }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`OSV direct query returned ${response.status}`);
  }

  const raw = (await response.json()) as { vulns?: Array<{ id?: string; summary?: string; severity?: Array<{ score?: string; type?: string }>; database_specific?: { severity?: string } }> };
  const vulnerabilities: ApiVulnerability[] = (raw.vulns || []).map((vuln) => ({
    id: vuln.id || 'UNKNOWN',
    summary: vuln.summary || 'No summary available',
    severity:
      (Array.isArray(vuln.severity) && vuln.severity.length > 0 && (vuln.severity[0].score || vuln.severity[0].type)) ||
      vuln.database_specific?.severity ||
      'UNKNOWN',
  }));
  const attacks = getAttackTypes(vulnerabilities);
  const fixes = getFixes(attacks);

  return {
    vulnerabilities,
    attacks,
    fixes,
    message:
      vulnerabilities.length === 0
        ? 'No known vulnerabilities found for this package version.'
        : 'Vulnerabilities found and mapped to security insights.',
  } as ApiAnalysis;
};

const postAnalyze = async (
  body: {
    techId?: string;
    tech: string;
    packageName: string;
    ecosystem: string;
    version: string;
  },
  signal: AbortSignal,
) => {
  const errors: string[] = [];

  for (const baseUrl of API_BASE_URLS) {
    try {
      const response = await fetch(`${baseUrl}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal,
      });

      if (!response.ok) {
        errors.push(`${baseUrl}/analyze returned ${response.status}`);
        continue;
      }

      return (await response.json()) as ApiAnalysis;
    } catch (error) {
      if (signal.aborted) {
        throw error;
      }
      errors.push(`${baseUrl}/analyze failed`);
    }
  }

  try {
    return await fetchFromOsvDirect(
      {
        packageName: body.packageName,
        ecosystem: body.ecosystem,
        version: body.version,
      },
      signal,
    );
  } catch (error) {
    errors.push('Direct OSV fallback failed');
    throw new Error(errors.join('; '));
  }
};

const fadeInSlideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const FixCard = styled(Box)(({ theme }) => ({
  padding: '16px 20px',
  borderRadius: '8px',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: `${theme.palette.success.main}08`,
  borderLeft: `4px solid ${theme.palette.success.main}`,
  transition: 'transform 0.2s, box-shadow 0.2s',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 4px 12px ${theme.palette.success.main}22`,
  },
}));

const VulnItem = styled(Box)(({ theme }) => ({
  padding: '16px 20px',
  borderRadius: '8px',
  border: `1px solid ${theme.palette.error.main}33`,
  backgroundColor: `${theme.palette.error.main}08`,
  transition: 'all 0.3s ease',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  '&:hover': {
    borderColor: theme.palette.error.main,
    backgroundColor: `${theme.palette.error.main}11`,
    boxShadow: `0 0 15px -3px ${theme.palette.error.main}44`,
  },
}));

const normalizeSeverity = (severity: string) => {
  const value = severity.toUpperCase();

  if (value.includes('CRITICAL') || value.includes('9.') || value.includes('10.')) return 'Critical';
  if (value.includes('HIGH') || value.includes('7.') || value.includes('8.')) return 'High';
  if (value.includes('MEDIUM') || value.includes('MODERATE') || value.includes('5.') || value.includes('6.')) return 'Medium';
  if (value.includes('LOW')) return 'Low';
  return 'Unknown';
};

const getSeverityColor = (severity: string) => {
  const normalized = normalizeSeverity(severity);
  if (normalized === 'Critical' || normalized === 'High') return 'error';
  if (normalized === 'Medium') return 'warning';
  if (normalized === 'Low') return 'success';
  return 'default';
};

const AnalysisOutput = ({ selectedTechs, versions }: AnalysisOutputProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [results, setResults] = useState<Record<string, ApiAnalysis>>({});

  useEffect(() => {
    const controller = new AbortController();

    const runAnalysis = async () => {
      setLoading(true);
      setError('');

      try {
        const responses = await Promise.allSettled(
          selectedTechs.map(async (tech) => {
            const data = await postAnalyze(
              {
                techId: tech.id,
                tech: tech.packageName,
                packageName: tech.packageName,
                ecosystem: tech.ecosystem,
                version: versions[tech.id] || tech.versions[0],
              },
              controller.signal,
            );
            return [tech.id, data] as const;
          }),
        );

        const successfulResponses = responses
          .filter((response): response is PromiseFulfilledResult<readonly [string, ApiAnalysis]> => response.status === 'fulfilled')
          .map((response) => response.value);

        if (successfulResponses.length === 0) {
          const failedReason = responses
            .map((response) => (response.status === 'rejected' ? response.reason : null))
            .filter(Boolean)
            .join('; ');

          throw new Error(failedReason || 'No API requests completed successfully.');
        }

        setResults(Object.fromEntries(successfulResponses));
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof Error
              ? err.message
              : 'Unable to connect to the StackSecure AI backend.',
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    runAnalysis();

    return () => controller.abort();
  }, [selectedTechs, versions]);

  const findings = useMemo<Finding[]>(
    () =>
      selectedTechs.flatMap((tech) =>
        (results[tech.id]?.vulnerabilities || []).map((vuln) => ({
          ...vuln,
          tech: tech.name,
          version: versions[tech.id] || tech.versions[0],
          ecosystem: tech.ecosystem,
        })),
      ),
    [results, selectedTechs, versions],
  );

  const attacks = useMemo(
    () => Array.from(new Set(Object.values(results).flatMap((result) => result.attacks))),
    [results],
  );

  const fixes = useMemo(
    () => Array.from(new Set(Object.values(results).flatMap((result) => result.fixes))),
    [results],
  );

  const attackInsights = useMemo(
    () => {
      const apiInsightsByAttack = new Map<string, ApiAttackInsight>();

      Object.values(results)
        .flatMap((result) => result.attackDetails || [])
        .forEach((insight) => {
          const existing = apiInsightsByAttack.get(insight.attack);
          if (!existing) {
            apiInsightsByAttack.set(insight.attack, insight);
            return;
          }
          const mergedEvidence = [
            ...(existing.evidence || []),
            ...(insight.evidence || []),
          ].filter(
            (item, index, arr) =>
              arr.findIndex((other) => other.id === item.id && other.summary === item.summary) === index,
          );
          apiInsightsByAttack.set(insight.attack, {
            ...existing,
            evidence: mergedEvidence,
          });
        });

      return attacks.map((attack) => {
        const fallbackKeyword =
          attack === 'XSS'
            ? 'script'
            : attack === 'Injection'
              ? 'injection'
              : attack === 'Auth Bypass'
                ? 'auth'
                : 'path';

        const fallbackRelatedFindings = findings
          .filter((finding) => finding.summary.toLowerCase().includes(fallbackKeyword))
          .slice(0, 3)
          .map((finding) => `${finding.id} (${finding.tech})`);

        const apiInsight = apiInsightsByAttack.get(attack);
        const relatedFindings =
          apiInsight?.evidence && apiInsight.evidence.length > 0
            ? apiInsight.evidence.slice(0, 3).map((item) => item.id)
            : fallbackRelatedFindings;

        return {
          attack,
          details: {
            ...(attackDetails[attack] || {
              description: 'Potential attack path detected from vulnerability metadata.',
              impact: 'Review matched advisories to estimate exploitability and blast radius.',
              firstAction: 'Patch vulnerable versions and harden validation controls.',
              color: 'info' as const,
            }),
            description: apiInsight?.description || attackDetails[attack]?.description || 'Potential attack path detected from vulnerability metadata.',
            impact:
              apiInsight?.impact ||
              attackDetails[attack]?.impact ||
              'Review matched advisories to estimate exploitability and blast radius.',
            firstAction:
              apiInsight?.firstAction ||
              attackDetails[attack]?.firstAction ||
              'Patch vulnerable versions and harden validation controls.',
          },
          relatedFindings,
        };
      });
    },
    [attacks, findings, results],
  );

  const summary = {
    critical: findings.filter((finding) => normalizeSeverity(finding.severity) === 'Critical').length,
    high: findings.filter((finding) => normalizeSeverity(finding.severity) === 'High').length,
    medium: findings.filter((finding) => normalizeSeverity(finding.severity) === 'Medium').length,
    low: findings.filter((finding) => normalizeSeverity(finding.severity) === 'Low').length,
  };

  if (loading) {
    return (
      <Stack minHeight={260} alignItems="center" justifyContent="center" spacing={2}>
        <CircularProgress color="primary" />
        <Typography variant="body2" color="text.secondary">
          Fetching real OSV vulnerability data for {selectedTechs.length} technologies...
        </Typography>
      </Stack>
    );
  }

  if (error) {
    return (
      <Alert severity="warning" sx={{ borderRadius: '8px' }}>
        Could not fetch vulnerability data. Run <strong>npm run dev</strong> to start both
        frontend and backend, or run <strong>npm run api</strong> in a second terminal. {error}
      </Alert>
    );
  }

  return (
    <Stack direction="column" spacing={5} height={1} sx={{ animation: `${fadeInSlideUp} 0.5s ease-out forwards`, pb: 4 }}>
      <Stack spacing={2.5}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              p: 1.25,
              borderRadius: '8px',
              bgcolor: 'error.main' + '11',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <IconifyIcon icon="hugeicons:bug-01" sx={{ color: 'error.main', width: 22, height: 22 }} />
          </Box>
          <Typography variant="h6" fontWeight={700} color="text.primary">
            Real OSV Analysis Results
          </Typography>
        </Stack>

        <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: 'repeat(4, 1fr)' }} gap={2}>
          {[
            ['Critical', summary.critical, 'error.main'],
            ['High', summary.high, 'error.main'],
            ['Medium', summary.medium, 'warning.main'],
            ['Low', summary.low, 'success.main'],
          ].map(([label, count, color]) => (
            <Paper key={label} sx={{ p: 3, textAlign: 'center', borderRadius: '8px', border: '1px solid', borderColor: `${color}44` }}>
              <Typography variant="h3" color={color as string} fontWeight={700} mb={0.5}>
                {count}
              </Typography>
              <Typography variant="body2" fontWeight={600} color="text.secondary">
                {label}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Stack>

      <Divider sx={{ borderColor: 'divider' }} />

      <Stack spacing={2.5}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <IconifyIcon icon="hugeicons:shield-cross" sx={{ color: 'text.secondary', width: 22, height: 22 }} />
          <Typography variant="h6" fontWeight={700} color="text.primary">
            Vulnerabilities Found
          </Typography>
        </Stack>

        {findings.length === 0 ? (
          <Paper sx={{ p: 4, borderRadius: '8px', border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle1" color="text.primary" fontWeight={800}>
              No known OSV vulnerabilities found for the selected versions.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, lineHeight: 1.7 }}>
              This means OSV did not return public advisories for these exact package/version pairs.
            </Typography>
          </Paper>
        ) : (
          <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(2, 1fr)' }} gap={2.5}>
            {findings.map((vuln) => (
              <VulnItem key={`${vuln.tech}-${vuln.id}`}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2} spacing={2}>
                  <Stack direction="column" spacing={0.5}>
                    <Typography variant="subtitle2" fontWeight={700} color="text.primary">
                      {vuln.id}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {vuln.tech} v{vuln.version} - {vuln.ecosystem}
                    </Typography>
                  </Stack>
                  <Chip
                    label={normalizeSeverity(vuln.severity)}
                    color={getSeverityColor(vuln.severity)}
                    size="small"
                    sx={{ fontSize: '0.65rem', fontWeight: 700, flexShrink: 0 }}
                  />
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, flex: 1 }}>
                  {vuln.summary}
                </Typography>
              </VulnItem>
            ))}
          </Box>
        )}
      </Stack>

      <Divider sx={{ borderColor: 'divider' }} />

      <Stack spacing={2.5}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <IconifyIcon icon="hugeicons:sword-01" sx={{ color: 'error.main', width: 22, height: 22 }} />
            <Typography variant="h6" fontWeight={700} color="text.primary">
              Possible Attack Types
            </Typography>
          </Stack>
          <Stack direction="row" flexWrap="wrap" gap={1.5}>
            {attacks.length === 0 ? (
              <Chip label="No mapped attack types returned" variant="outlined" />
            ) : (
              attacks.map((attack) => (
                <Chip key={attack} label={attack} color="error" variant="outlined" sx={{ fontWeight: 700 }} />
              ))
            )}
          </Stack>
          {attackInsights.length > 0 && (
            <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(2, 1fr)' }} gap={2}>
              {attackInsights.map((item) => (
                <Paper
                  key={item.attack}
                  sx={{
                    p: 2.5,
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: `${item.details.color}.main`,
                    bgcolor: `${item.details.color}.main` + '08',
                  }}
                >
                  <Stack spacing={1.25}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle1" fontWeight={800} color="text.primary">
                        {item.attack}
                      </Typography>
                      <Chip
                        size="small"
                        label={item.relatedFindings.length > 0 ? `${item.relatedFindings.length} matched` : 'mapped'}
                        color={item.details.color}
                        variant="outlined"
                      />
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {item.details.description}
                    </Typography>
                    <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.7 }}>
                      <strong>Likely impact:</strong> {item.details.impact}
                    </Typography>
                    <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.7 }}>
                      <strong>First action:</strong> {item.details.firstAction}
                    </Typography>
                    {item.relatedFindings.length > 0 && (
                      <Typography variant="caption" color="text.secondary">
                        Evidence: {item.relatedFindings.join(', ')}
                      </Typography>
                    )}
                  </Stack>
                </Paper>
              ))}
            </Box>
          )}
        </Stack>
      </Stack>

      <Divider sx={{ borderColor: 'divider' }} />

      <Stack spacing={2.5}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <IconifyIcon icon="hugeicons:wrench-01" sx={{ color: 'success.main', width: 22, height: 22 }} />
          <Typography variant="h6" fontWeight={700} color="text.primary">
            Recommended Fixes
          </Typography>
        </Stack>
        <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(2, 1fr)' }} gap={2.5}>
          {fixes.map((fix) => (
            <FixCard key={fix}>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, flex: 1 }}>
                {fix}
              </Typography>
            </FixCard>
          ))}
        </Box>
      </Stack>
    </Stack>
  );
};

export default AnalysisOutput;
