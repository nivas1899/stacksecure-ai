import cors from 'cors';
import express from 'express';
import { pathToFileURL } from 'node:url';

const app = express();
const PORT = process.env.PORT || 4000;
const OSV_QUERY_URL = 'https://api.osv.dev/v1/query';
const cache = new Map();

app.use(cors());
app.use(express.json());

const ATTACK_KB = [
  {
    attack: 'XSS',
    keywords: ['script', 'xss', 'cross-site scripting', 'cross site scripting'],
    description:
      'Cross-site scripting can execute attacker-controlled JavaScript in a victim browser context.',
    impact: 'Session theft, account takeover, and client-side data exfiltration are possible.',
    firstAction: 'Sanitize rendered HTML and apply strict output encoding.',
  },
  {
    attack: 'Injection',
    keywords: ['injection', 'sqli', 'command injection', 'code injection', 'template injection'],
    description:
      'Injection flaws allow untrusted input to alter command or query behavior at runtime.',
    impact: 'Unauthorized data access, data tampering, and remote command execution can occur.',
    firstAction: 'Use parameterized queries and validate untrusted input paths.',
  },
  {
    attack: 'Auth Bypass',
    keywords: ['auth', 'authentication bypass', 'authorization bypass', 'privilege escalation'],
    description:
      'Authentication bypass lets an attacker skip identity checks and access protected routes.',
    impact: 'Privilege escalation and unauthorized access to sensitive workflows are possible.',
    firstAction: 'Re-check auth middleware order and token/session validation rules.',
  },
  {
    attack: 'Path Traversal',
    keywords: ['path traversal', '../', 'directory traversal', 'path'],
    description:
      'Path traversal can expose files outside intended directories through crafted file paths.',
    impact: 'Configuration disclosure and access to secrets or private files may happen.',
    firstAction: 'Normalize and constrain file paths to trusted root directories.',
  },
];

const defaultFixes = ['Update to latest version', 'Sanitize inputs'];

const buildSourceQueries = ({
  techId,
  packageName,
  ecosystem,
  version,
}) => {
  const queries = [
    {
      source: 'OSV',
      packageName,
      ecosystem,
      version,
      note: 'Primary ecosystem query',
    },
  ];

  // Node.js runtime vulnerabilities are better represented as Debian package advisories in OSV.
  if (techId === 'nodejs' || packageName === 'node') {
    queries.push({
      source: 'OSV',
      packageName: 'nodejs',
      ecosystem: 'Debian',
      version,
      note: 'Node.js runtime fallback',
    });
  }

  return queries;
};

const getSeverity = (vuln) => {
  const dbSeverity =
    vuln.database_specific?.severity || vuln.ecosystem_specific?.severity || null;
  if (typeof dbSeverity === 'string' && dbSeverity.trim()) {
    return dbSeverity;
  }

  if (Array.isArray(vuln.severity) && vuln.severity.length > 0) {
    const cvss = vuln.severity[0].score;
    const cvssDerivedSeverity = deriveSeverityFromCvss(cvss);
    if (cvssDerivedSeverity) {
      return cvssDerivedSeverity;
    }
    return cvss || vuln.severity[0].type || 'UNKNOWN';
  }

  return vuln.withdrawn || 'UNKNOWN';
};

const roundUpOneDecimal = (value) => Math.ceil(value * 10) / 10;

const deriveSeverityFromCvss = (cvssVector) => {
  if (typeof cvssVector !== 'string' || !cvssVector.startsWith('CVSS:3.')) {
    return null;
  }

  const parts = cvssVector.split('/');
  const metrics = {};
  for (const part of parts.slice(1)) {
    const [key, value] = part.split(':');
    if (key && value) metrics[key] = value;
  }

  const AV = { N: 0.85, A: 0.62, L: 0.55, P: 0.2 }[metrics.AV];
  const AC = { L: 0.77, H: 0.44 }[metrics.AC];
  const UI = { N: 0.85, R: 0.62 }[metrics.UI];
  const S = metrics.S;
  const C = { H: 0.56, L: 0.22, N: 0 }[metrics.C];
  const I = { H: 0.56, L: 0.22, N: 0 }[metrics.I];
  const A = { H: 0.56, L: 0.22, N: 0 }[metrics.A];

  if (
    AV === undefined ||
    AC === undefined ||
    UI === undefined ||
    (S !== 'U' && S !== 'C') ||
    C === undefined ||
    I === undefined ||
    A === undefined
  ) {
    return null;
  }

  const PR =
    S === 'U'
      ? { N: 0.85, L: 0.62, H: 0.27 }[metrics.PR]
      : { N: 0.85, L: 0.68, H: 0.5 }[metrics.PR];
  if (PR === undefined) {
    return null;
  }

  const exploitability = 8.22 * AV * AC * PR * UI;
  const iscBase = 1 - (1 - C) * (1 - I) * (1 - A);
  const impact =
    S === 'U'
      ? 6.42 * iscBase
      : 7.52 * (iscBase - 0.029) - 3.25 * (iscBase - 0.02) ** 15;

  const rawScore =
    impact <= 0
      ? 0
      : S === 'U'
        ? Math.min(impact + exploitability, 10)
        : Math.min(1.08 * (impact + exploitability), 10);
  const score = roundUpOneDecimal(rawScore);

  if (score === 0) return 'LOW';
  if (score < 4) return 'LOW';
  if (score < 7) return 'MEDIUM';
  if (score < 9) return 'HIGH';
  return 'CRITICAL';
};

const getAttackMatches = (summary = '') => {
  const normalizedSummary = summary.toLowerCase();
  return ATTACK_KB.filter(({ keywords }) =>
    keywords.some((keyword) => normalizedSummary.includes(keyword)),
  );
};

const getAttackTypes = (vulnerabilities) => {
  const attacks = new Set();

  vulnerabilities.forEach((vuln) => {
    getAttackMatches(vuln.summary).forEach(({ attack }) => attacks.add(attack));
  });

  return Array.from(attacks);
};

const getAttackInsights = (vulnerabilities) => {
  const vulnerabilitiesByAttack = new Map();

  vulnerabilities.forEach((vuln) => {
    getAttackMatches(vuln.summary).forEach(({ attack }) => {
      const existing = vulnerabilitiesByAttack.get(attack) || [];
      vulnerabilitiesByAttack.set(attack, [...existing, vuln]);
    });
  });

  return ATTACK_KB.filter(({ attack }) => vulnerabilitiesByAttack.has(attack)).map(
    ({ attack, description, impact, firstAction }) => {
      const evidence = (vulnerabilitiesByAttack.get(attack) || [])
        .slice(0, 3)
        .map((vuln) => ({
          id: vuln.id,
          summary: vuln.summary,
        }));

      return {
        attack,
        description,
        impact,
        firstAction,
        evidence,
      };
    },
  );
};

const getFixes = (attacks) => {
  const fixes = new Set(defaultFixes);

  if (attacks.includes('XSS')) {
    fixes.add('Escape output and sanitize rendered HTML');
  }
  if (attacks.includes('Injection')) {
    fixes.add('Use parameterized queries and validate user input');
  }
  if (attacks.includes('Auth Bypass')) {
    fixes.add('Review authentication middleware and session handling');
  }
  if (attacks.includes('Path Traversal')) {
    fixes.add('Normalize file paths and restrict access to trusted directories');
  }

  return Array.from(fixes);
};

const queryOsv = async (packageName, version, ecosystem) => {
  const response = await fetch(OSV_QUERY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      package: {
        name: packageName,
        ecosystem,
      },
      version,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OSV request failed with ${response.status}: ${errorText}`);
  }

  return response.json();
};

const toVulnerabilities = (osvData) =>
  (osvData.vulns || []).map((vuln) => ({
    id: vuln.id || 'UNKNOWN',
    summary: vuln.summary || 'No summary available',
    severity: getSeverity(vuln),
  }));

const mergeVulnerabilities = (vulnerabilityGroups) => {
  const unique = new Map();

  vulnerabilityGroups.flat().forEach((vuln) => {
    const key = `${vuln.id}::${vuln.summary}`;
    if (!unique.has(key)) {
      unique.set(key, vuln);
    }
  });

  return Array.from(unique.values());
};

app.get(['/health', '/api/health'], (_req, res) => {
  res.json({
    status: 'ok',
    service: 'StackSecure AI API',
  });
});

app.post(['/analyze', '/api/analyze'], async (req, res) => {
  const { tech, techId, version, packageName, ecosystem = 'npm' } = req.body;

  if (!tech || !version || typeof tech !== 'string' || typeof version !== 'string') {
    return res.status(400).json({
      error: 'Invalid request body',
      message: 'Send JSON with "tech" and "version" string fields.',
    });
  }

  const osvPackageName = typeof packageName === 'string' && packageName.trim() ? packageName : tech;
  const osvEcosystem = typeof ecosystem === 'string' && ecosystem.trim() ? ecosystem : 'npm';
  const cacheKey = `${techId || 'unknown'}:${osvEcosystem}:${osvPackageName.toLowerCase()}@${version}`;

  if (cache.has(cacheKey)) {
    return res.json({
      ...cache.get(cacheKey),
      cached: true,
    });
  }

  try {
    const sourceQueries = buildSourceQueries({
      techId: typeof techId === 'string' ? techId : '',
      packageName: osvPackageName,
      ecosystem: osvEcosystem,
      version,
    });

    const sourceResults = await Promise.all(
      sourceQueries.map(async (query) => {
        const osvData = await queryOsv(query.packageName, query.version, query.ecosystem);
        return {
          source: query.source,
          packageName: query.packageName,
          ecosystem: query.ecosystem,
          note: query.note,
          vulnerabilities: toVulnerabilities(osvData),
        };
      }),
    );

    const vulnerabilities = mergeVulnerabilities(
      sourceResults.map((result) => result.vulnerabilities),
    );

    const attacks = getAttackTypes(vulnerabilities);
    const attackDetails = getAttackInsights(vulnerabilities);
    const fixes = getFixes(attacks);

    const result = {
      vulnerabilities,
      attacks,
      attackDetails,
      fixes,
      dataSources: sourceResults.map((result) => ({
        source: result.source,
        packageName: result.packageName,
        ecosystem: result.ecosystem,
        note: result.note,
        count: result.vulnerabilities.length,
      })),
      message:
        vulnerabilities.length === 0
          ? 'No known vulnerabilities found for this package version.'
          : 'Vulnerabilities found and mapped to security insights.',
    };

    cache.set(cacheKey, result);
    return res.json(result);
  } catch (error) {
    return res.status(502).json({
      error: 'Vulnerability analysis failed',
      message: 'Unable to fetch vulnerability data right now. Please try again later.',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  app.listen(PORT, () => {
    console.log(`StackSecure AI API running on http://localhost:${PORT}`);
  });
}

export default app;
