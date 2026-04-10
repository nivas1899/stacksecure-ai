import cors from 'cors';
import express from 'express';
import { pathToFileURL } from 'node:url';
import aiService from './aiService.js';

const app = express();
const PORT = process.env.PORT || 4000;
const OSV_QUERY_URL = 'https://api.osv.dev/v1/query';
const cache = new Map();

const TECH_SIGNATURES = [
  { id: 'react', name: 'React', category: 'JavaScript libraries', type: 'html', pattern: /react/i, observation: 'React.js signature found in script/DOM' },
  { id: 'nextjs', name: 'Next.js', category: 'Web frameworks', type: 'html', pattern: /_next\/static/i, observation: 'Next.js static assets detected' },
  { id: 'nextjs', name: 'Next.js', category: 'Web frameworks', type: 'header', key: 'x-powered-by', value: /next.js/i, observation: 'X-Powered-By header indicates Next.js' },
  { id: 'vue', name: 'Vue.js', category: 'JavaScript libraries', type: 'html', pattern: /v-attr|v-bind|vue.js/i, observation: 'Vue.js directives or library detected' },
  { id: 'angular', name: 'Angular', category: 'Web frameworks', type: 'html', pattern: /ng-version|ng-app/i, observation: 'Angular versioning or app attributes detected' },
  { id: 'jquery', name: 'jQuery', category: 'JavaScript libraries', type: 'html', pattern: /jquery/i, observation: 'jQuery library scripts found' },
  { id: 'wordpress', name: 'WordPress', category: 'CMS', type: 'html', pattern: /wp-content|wp-includes/i, observation: 'WordPress content/includes paths detected' },
  { id: 'wordpress', name: 'WordPress', category: 'CMS', type: 'header', key: 'x-powered-by', value: /wordpress/i, observation: 'X-Powered-By header indicates WordPress' },
  { id: 'laravel', name: 'Laravel', category: 'Web frameworks', type: 'header', key: 'set-cookie', value: /laravel_session/i, observation: 'Laravel session cookie found' },
  { id: 'laravel', name: 'Laravel', category: 'Web frameworks', type: 'header', key: 'x-powered-by', value: /laravel/i, observation: 'X-Powered-By header indicates Laravel' },
  { id: 'django', name: 'Django', category: 'Web frameworks', type: 'header', key: 'set-cookie', value: /csrftoken/i, observation: 'Django CSRF token found' },
  { id: 'django', name: 'Django', category: 'Web frameworks', type: 'header', key: 'server', value: /gunicorn|wsgi/i, observation: 'Django-compatible server (Gunicorn/WSGI) detected' },
  { id: 'express', name: 'Express', category: 'Web frameworks', type: 'header', key: 'x-powered-by', value: /express/i, observation: 'X-Powered-By header indicates Express' },
  { id: 'nodejs', name: 'Node.js', category: 'Server environments', type: 'header', key: 'x-powered-by', value: /nodejs|node.js/i, observation: 'X-Powered-By header indicates Node.js' },
  { id: 'rails', name: 'Ruby on Rails', category: 'Web frameworks', type: 'header', key: 'x-powered-by', value: /rails/i, observation: 'X-Powered-By header indicates Rails' },
  { id: 'rails', name: 'Ruby on Rails', category: 'Web frameworks', type: 'header', key: 'set-cookie', value: /_rails_session/i, observation: 'Rails session cookie detected' },
];

app.use(cors());
app.use(express.json());

// DETECTION ENDPOINT
app.post(['/detect', '/api/detect'], async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    const targetUrl = url.startsWith('http') ? url : `https://${url}`;
    console.log(`Detecting technologies for: ${targetUrl}`);
    
    // First, try whatweb if available (silent fail if not)
    let whatWebOutput = '';
    try {
      const { exec } = await import('child_process');
      const util = await import('util');
      const execAsync = util.promisify(exec);
      // Run whatweb but suppress errors
      const { stdout } = await execAsync(`whatweb --quiet --no-errors ${targetUrl}`);
      whatWebOutput = stdout;
    } catch (e) {
      console.log('whatweb CLI not available or failed, falling back to heuristic/AI detection.');
    }

    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), 6000);

    const response = await fetch(targetUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
      signal: abortController.signal
    });
    clearTimeout(timeoutId);

    const html = await response.text();
    const headers = Object.fromEntries(response.headers.entries());
    const detected = new Map();

    // 1. Signature Matching
    TECH_SIGNATURES.forEach(sig => {
      if (sig.type === 'html' && sig.pattern.test(html)) {
        detected.set(sig.id, { id: sig.id, name: sig.name, category: sig.category || 'Miscellaneous', observation: sig.observation, confidence: 100 });
      }
      if (sig.type === 'header' && headers[sig.key] && sig.value.test(headers[sig.key])) {
        detected.set(sig.id, { id: sig.id, name: sig.name, category: sig.category || 'Miscellaneous', observation: sig.observation, confidence: 100 });
      }
    });

    // 2. AI Discovery Expansion (WhatWeb Style)
    try {
      const cleanedHtml = html.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
                              .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, '')
                              .slice(0, 10000);
      const aiResults = await aiService.detectTechnologiesFromSource(cleanedHtml, JSON.stringify(headers));
      aiResults.forEach(res => {
        // Only add if not already extremely confident from static signature, or if AI gives a generic ID match, merge properties
        if (!detected.has(res.id)) {
          detected.set(res.id, { 
            id: res.id, 
            name: res.name || res.id, 
            category: res.category || 'Miscellaneous',
            observation: res.observation || 'AI heuristic analysis', 
            confidence: res.confidence || 80,
            version: res.version
          });
        }
      });
    } catch(e) {
      console.log('AI extension error', e);
    }

    const techResults = Array.from(detected.values());

    res.json({ 
      url: targetUrl, 
      techs: techResults,
      techIds: techResults.map(t => t.id),
      status: 'success' 
    });
  } catch (error) {
    res.status(502).json({ 
      error: 'Discovery failed', 
      message: error.message 
    });
  }
});

const ATTACK_KB = [
  {
    attack: 'XSS',
    keywords: ['script', 'xss', 'cross-site scripting', 'cross site scripting'],
    description: 'Cross-site scripting can execute attacker-controlled JavaScript in a victim browser context.',
    impact: 'Session theft, account takeover, and client-side data exfiltration are possible.',
    firstAction: 'Sanitize rendered HTML and apply strict output encoding.',
  },
  {
    attack: 'SQL Injection',
    keywords: ['sql', 'sqli', 'injection', 'database'],
    description: 'SQL injection allows attackers to interfere with queries that an application makes to its database.',
    impact: 'Unauthorized access to sensitive data, data tampering, and potential administrative control over the DB.',
    firstAction: 'Use parameterized queries/prepared statements for all database interactions.',
  },
  {
    attack: 'SSRF',
    keywords: ['ssrf', 'server-side request forgery', 'request forgery'],
    description: 'SSRF allows an attacker to induce the server-side application to make requests to an unintended location.',
    impact: 'Access to internal services, cloud metadata services (IMDS), and internal network scanning.',
    firstAction: 'Implement strict allow-lists for destination URLs and disable unused protocols.',
  },
  {
    attack: 'CSRF',
    keywords: ['csrf', 'cross-site request forgery', 'xsrf'],
    description: 'CSRF trick a victim into submitting a malicious request to a web application where they are authenticated.',
    impact: 'Unintended actions performed on behalf of the user (e.g., password changes, data deletion).',
    firstAction: 'Implement anti-CSRF tokens and SameSite cookie attributes.',
  },
  {
    attack: 'IDOR',
    keywords: ['idor', 'insecure direct object reference', 'access control'],
    description: 'Insecure Direct Object Reference occurs when an application provides direct access to objects based on user-supplied input.',
    impact: 'Unauthorized access to other users\' private data or system resources.',
    firstAction: 'Implement robust object-level access control checks for every request.',
  },
  {
    attack: 'LFI/RFI',
    keywords: ['lfi', 'rfi', 'file inclusion', 'local file', 'remote file'],
    description: 'File inclusion allows an attacker to include local or remote files into the application output.',
    impact: 'Information disclosure (e.g., /etc/passwd) or Remote Code Execution (RCE).',
    firstAction: 'Avoid passing user input directly to filesystem APIs; use a mapping or allow-list.',
  },
  {
    attack: 'RCE',
    keywords: ['rce', 'remote code execution', 'command execution', 'eval', 'shell'],
    description: 'Remote Code Execution allows an attacker to execute arbitrary code on the server.',
    impact: 'Full system compromise, data exfiltration, and lateral movement within the network.',
    firstAction: 'Evade dangerous functions like eval(), exec(), or child_process; use secure sandboxes.',
  },
  {
    attack: 'Prototype Pollution',
    keywords: ['prototype pollution', '_proto_', 'constructor'],
    description: 'Prototype pollution allows attackers to inject properties into existing JavaScript object prototypes.',
    impact: 'Logic bypass, Denial of Service (DoS), and in some cases, RCE.',
    firstAction: 'Validate input schemas and use Object.create(null) for data objects.',
  },
  {
    attack: 'XXE',
    keywords: ['xxe', 'xml external entity', 'entity injection'],
    description: 'XML External Entity injection occurs when an XML parser processes external entity references in user-supplied XML.',
    impact: 'Information disclosure, SSRF, and potential DoS.',
    firstAction: 'Disable DTD and external entity processing in XML parsers.',
  },
  {
    attack: 'Insecure Deserialization',
    keywords: ['deserialization', 'serialize', 'unmarshal'],
    description: 'Insecure deserialization allows an attacker to manipulate serialized objects to execute code or bypass auth.',
    impact: 'Remote Code Execution and privilege escalation.',
    firstAction: 'Avoid deserializing untrusted data; use safer formats like JSON instead.',
  },
  {
    attack: 'GraphQL Injection',
    keywords: ['graphql', 'introspection', 'query injection'],
    description: 'Attacks targeting GraphQL endpoints, including introspection abuse and query depth exhaustion.',
    impact: 'Information disclosure and DoS.',
    firstAction: 'Disable introspection in production and implement query depth/complexity limits.',
  },
  {
    attack: 'Open Redirect',
    keywords: ['open redirect', 'redirect'],
    description: 'Open redirect occurs when an application takes a user-supplied URL and redirects the user to it without validation.',
    impact: 'Phishing attacks and credential theft.',
    firstAction: 'Use an allow-list of trusted redirect destinations.',
  },
  {
    attack: 'Information Disclosure',
    keywords: ['disclosure', 'leak', 'sensitive data', 'debug'],
    description: 'Accidental exposure of sensitive information (e.g., logs, environment variables, source code).',
    impact: 'Assistance in further attacks by revealing system internals.',
    firstAction: 'Review error handling and logging to ensure no secrets are exposed.',
  },
  {
    attack: 'Security Misconfiguration',
    keywords: ['configuration', 'headers', 'cors', 'hsts', 'csp'],
    description: 'Vulnerabilities arising from insecure default settings or incomplete configurations.',
    impact: 'Increased attack surface and bypass of security controls.',
    firstAction: 'Use automated scanners to audit configurations and follow hardening guides.',
  },
  {
    attack: 'Broken Access Control',
    keywords: ['access control', 'privilege', 'permission'],
    description: 'Failure to enforce properly restricted access to data or functions.',
    impact: 'Horizontal or vertical privilege escalation.',
    firstAction: 'Adopt a deny-by-default policy and verify access on every request.',
  },
  {
    attack: 'CRLF Injection',
    keywords: ['crlf', 'header injection', 'newline'],
    description: 'Injecting Carriage Return and Line Feed characters to manipulate headers or response bodies.',
    impact: 'HTTP response splitting and cross-site scripting.',
    firstAction: 'Strip CR and LF characters from user-supplied input before using it in headers.',
  },
  {
    attack: 'Host Header Injection',
    keywords: ['host header', 'x-forwarded-host'],
    description: 'Manipulating the Host header to influence server-side logic (e.g., password reset links).',
    impact: 'Web cache poisoning and phishing.',
    firstAction: 'Validate the Host header against a whitelist or use absolute URLs in links.',
  },
  {
    attack: 'Cache Poisoning',
    keywords: ['cache poisoning', 'web cache'],
    description: 'Storing malicious responses in a web cache so they are served to other users.',
    impact: 'Mass XSS and redirection of users to malicious sites.',
    firstAction: 'Only cache responses that are independent of unkeyed inputs (like headers).',
  },
  {
    attack: 'Clickjacking',
    keywords: ['clickjacking', 'iframe', 'ui redress'],
    description: 'Tricking a user into clicking on something different from what they perceive.',
    impact: 'Unauthorized actions performed by the user on a victim site.',
    firstAction: 'Use Frame-Options: DENY or Content-Security-Policy: frame-ancestors \'none\'.',
  },
  {
    attack: 'Improper Session Management',
    keywords: ['session', 'cookie', 'token', 'fixation'],
    description: 'Weaknesses in how an application manages user sessions (e.g., predictable IDs).',
    impact: 'Account takeover and session hijacking.',
    firstAction: 'Use secure, HTTPOnly, and SameSite cookie flags; rotate IDs on login.',
  },
  {
    attack: 'OAuth Misconfiguration',
    keywords: ['oauth', 'oidc', 'redirect_uri', 'state'],
    description: 'Insecure implementation of OAuth or OpenID Connect flows.',
    impact: 'Account takeover via token theft.',
    firstAction: 'Strictly validate redirect_uris and use the \'state\' parameter to prevent CSRF.',
  }
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

const getAttackInsights = async (vulnerabilities) => {
  const vulnerabilitiesByAttack = new Map();

  vulnerabilities.forEach((vuln) => {
    getAttackMatches(vuln.summary).forEach(({ attack }) => {
      const existing = vulnerabilitiesByAttack.get(attack) || [];
      vulnerabilitiesByAttack.set(attack, [...existing, vuln]);
    });
  });

  const insights = await Promise.all(
    ATTACK_KB.filter(({ attack }) => vulnerabilitiesByAttack.has(attack)).map(
      async ({ attack, description, impact, firstAction }) => {
        const evidence = (vulnerabilitiesByAttack.get(attack) || [])
          .slice(0, 3)
          .map((vuln) => ({
            id: vuln.id,
            summary: vuln.summary,
          }));

        // Generate dynamic tips via AI
        const aiTips = await aiService.generateBugBountyTips(attack, evidence[0]?.summary || '');

        return {
          attack,
          description,
          impact,
          firstAction,
          reproTip: aiTips.reproTip,
          recommendation: aiTips.recommendation,
          isAiGenerated: true,
          evidence,
        };
      },
    ),
  );

  return insights;
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

const getSafeValidationSteps = (attacks) => {
  const steps = new Set([
    'Confirm the exact deployed package version from the lockfile, SBOM, or build artifact.',
    'Check whether the version is inside a published affected range and whether the risky feature is in use.',
    'Review the code path that exercises the package and validate whether compensating controls reduce exposure.',
    'Apply the patch in staging first, then rerun dependency, smoke, and regression checks before production rollout.',
  ]);

  if (attacks.includes('XSS')) {
    steps.add('Inspect rendering sinks and verify sanitization or output encoding on every user-controlled path.');
  }
  if (attacks.includes('Injection')) {
    steps.add('Audit query, command, and template boundaries to ensure untrusted input is parameterized or blocked.');
  }
  if (attacks.includes('Auth Bypass')) {
    steps.add('Trace auth middleware and token or session validation for every protected route using the component.');
  }
  if (attacks.includes('Path Traversal')) {
    steps.add('Review file access handlers and verify normalized paths cannot escape approved directories.');
  }

  return Array.from(steps);
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
  const { tech, techId, techName, version, packageName, ecosystem = 'npm' } = req.body;

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

    let vulnerabilities = mergeVulnerabilities(
      sourceResults.map((result) => result.vulnerabilities),
    );

    let scanMode = 'LIVE_DATABASE';

    // TRIGGER FALLBACK IF NO RESULTS
    if (vulnerabilities.length === 0) {
      scanMode = 'AI_EDUCATIONAL_SCAN';
      const aiVulns = await aiService.generateEducationalVulnerabilities(techName || osvPackageName, version);
      
      // Combine AI gen with frontend fallback metadata
      const frontendFallbacks = (req.body.fallbackVulns || []).map(v => ({
        id: v.cve || v.id || `EDU-${Math.random().toString(36).substr(2, 5)}`,
        summary: v.type || v.summary,
        severity: v.severity.toUpperCase()
      }));

      vulnerabilities = [...frontendFallbacks, ...aiVulns];
    }

    const attacks = getAttackTypes(vulnerabilities);
    const attackDetails = await getAttackInsights(vulnerabilities);
    const fixes = getFixes(attacks);
    const safeValidationSteps = getSafeValidationSteps(attacks);

    const result = {
      vulnerabilities,
      attacks,
      attackDetails,
      fixes,
      safeValidationSteps,
      scanMode,
      dataSources: sourceResults.map((result) => ({
        source: result.source,
        packageName: result.packageName,
        ecosystem: result.ecosystem,
        note: result.note,
        count: result.vulnerabilities.length,
      })),
      message:
        scanMode === 'AI_EDUCATIONAL_SCAN'
          ? 'Deep Scan Mode: OSV database returned 0 results. Showing AI-generated educational risks and documented stack weaknesses.'
          : 'Vulnerabilities found in OSV database and mapped to security insights.',
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
