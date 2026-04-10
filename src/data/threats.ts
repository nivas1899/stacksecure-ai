export type ThreatType =
  | 'xss'
  | 'bruteforce'
  | 'exposure'
  | 'injection'
  | 'ddos'
  | 'csrf'
  | 'ssrf'
  | 'rce'
  | 'lfi'
  | 'idor'
  | 'xxe'
  | 'deserialization'
  | 'supply-chain'
  | 'jwt'
  | 'oauth'
  | 'clickjacking'
  | 'mitm'
  | 'prototype-pollution'
  | 'race-condition'
  | 'open-redirect';

export interface Threat {
  id: number;
  icon: string;
  message: string;
  country: string;
  flag: string;
  type: ThreatType;
  severity: 'critical' | 'high' | 'medium' | 'low';
  endpoint?: string;
  time: string;
}

export const threatPool: Threat[] = [
  // XSS
  {
    id: 1,
    icon: 'hugeicons:alert-02',
    message: 'Reflected XSS attempt detected in /api/comments',
    country: 'USA',
    flag: '🇺🇸',
    type: 'xss',
    severity: 'critical',
    endpoint: '/api/comments',
    time: '',
  },
  {
    id: 2,
    icon: 'hugeicons:alert-02',
    message: 'Stored XSS payload blocked in profile bio field',
    country: 'Brazil',
    flag: '🇧🇷',
    type: 'xss',
    severity: 'critical',
    endpoint: '/user/profile',
    time: '',
  },
  {
    id: 3,
    icon: 'hugeicons:alert-02',
    message: 'DOM-based XSS via location.hash manipulation detected',
    country: 'France',
    flag: '🇫🇷',
    type: 'xss',
    severity: 'high',
    endpoint: '/dashboard',
    time: '',
  },

  // Brute Force
  {
    id: 4,
    icon: 'hugeicons:login-03',
    message: 'Credential stuffing spike on /auth/login — 4.2k hits/min',
    country: 'India',
    flag: '🇮🇳',
    type: 'bruteforce',
    severity: 'critical',
    endpoint: '/auth/login',
    time: '',
  },
  {
    id: 5,
    icon: 'hugeicons:login-03',
    message: 'SSH brute force pattern crossed alert threshold (port 22)',
    country: 'Nigeria',
    flag: '🇳🇬',
    type: 'bruteforce',
    severity: 'high',
    endpoint: ':22',
    time: '',
  },
  {
    id: 6,
    icon: 'hugeicons:login-03',
    message: 'Admin panel enumeration via /wp-admin detected from botnet',
    country: 'Romania',
    flag: '🇷🇴',
    type: 'bruteforce',
    severity: 'medium',
    endpoint: '/wp-admin',
    time: '',
  },

  // Exposure
  {
    id: 7,
    icon: 'hugeicons:database-01',
    message: 'Storage exposure linked to a public bucket policy (S3)',
    country: 'Germany',
    flag: '🇩🇪',
    type: 'exposure',
    severity: 'critical',
    endpoint: 's3://prod-assets',
    time: '',
  },
  {
    id: 8,
    icon: 'hugeicons:file-01',
    message: 'Crawler attempted access to exposed .env file at root',
    country: 'UK',
    flag: '🇬🇧',
    type: 'exposure',
    severity: 'critical',
    endpoint: '/.env',
    time: '',
  },
  {
    id: 9,
    icon: 'hugeicons:database-01',
    message: 'MongoDB port 27017 scan blocked at perimeter firewall',
    country: 'France',
    flag: '🇫🇷',
    type: 'exposure',
    severity: 'high',
    endpoint: ':27017',
    time: '',
  },

  // Injection
  {
    id: 10,
    icon: 'hugeicons:code-square',
    message: 'SQL injection probe blocked in search parameter (UNION SELECT)',
    country: 'Russia',
    flag: '🇷🇺',
    type: 'injection',
    severity: 'critical',
    endpoint: '/api/search',
    time: '',
  },
  {
    id: 11,
    icon: 'hugeicons:code-square',
    message: 'NoSQL injection operator bypass attempt via $where or $gt',
    country: 'Ukraine',
    flag: '🇺🇦',
    type: 'injection',
    severity: 'critical',
    endpoint: '/api/users',
    time: '',
  },
  {
    id: 12,
    icon: 'hugeicons:code-square',
    message: 'Command injection attempt in filename upload parameter',
    country: 'China',
    flag: '🇨🇳',
    type: 'injection',
    severity: 'critical',
    endpoint: '/api/upload',
    time: '',
  },
  {
    id: 13,
    icon: 'hugeicons:code-square',
    message: 'LDAP injection string detected in login form field',
    country: 'Iran',
    flag: '🇮🇷',
    type: 'injection',
    severity: 'high',
    endpoint: '/auth/login',
    time: '',
  },

  // DDoS
  {
    id: 14,
    icon: 'hugeicons:flash',
    message: 'Traffic flood detected on CDN edge route — 1.8M req/s',
    country: 'China',
    flag: '🇨🇳',
    type: 'ddos',
    severity: 'critical',
    endpoint: '/cdn-edge',
    time: '',
  },
  {
    id: 15,
    icon: 'hugeicons:flash',
    message: 'API abuse rule challenged 10k requests in 60 seconds',
    country: 'Netherlands',
    flag: '🇳🇱',
    type: 'ddos',
    severity: 'high',
    endpoint: '/api/v1',
    time: '',
  },
  {
    id: 16,
    icon: 'hugeicons:flash',
    message: 'HTTP/2 Rapid Reset DDoS pattern detected on gateway',
    country: 'South Korea',
    flag: '🇰🇷',
    type: 'ddos',
    severity: 'critical',
    endpoint: '/gateway',
    time: '',
  },

  // CSRF
  {
    id: 17,
    icon: 'hugeicons:shield-block',
    message: 'CSRF token mismatch on /api/transfer — request blocked',
    country: 'Poland',
    flag: '🇵🇱',
    type: 'csrf',
    severity: 'high',
    endpoint: '/api/transfer',
    time: '',
  },
  {
    id: 18,
    icon: 'hugeicons:shield-block',
    message: 'Cross-site request detected from untrusted origin domain',
    country: 'Turkey',
    flag: '🇹🇷',
    type: 'csrf',
    severity: 'medium',
    endpoint: '/account/settings',
    time: '',
  },

  // SSRF
  {
    id: 19,
    icon: 'hugeicons:arrow-move-up-right',
    message: 'SSRF attempt via URL parameter targeting internal 169.254.x.x',
    country: 'Vietnam',
    flag: '🇻🇳',
    type: 'ssrf',
    severity: 'critical',
    endpoint: '/api/fetch',
    time: '',
  },
  {
    id: 20,
    icon: 'hugeicons:arrow-move-up-right',
    message: 'SSRF probe targeting AWS metadata endpoint (169.254.169.254)',
    country: 'Indonesia',
    flag: '🇮🇩',
    type: 'ssrf',
    severity: 'critical',
    endpoint: '/api/webhook',
    time: '',
  },

  // RCE
  {
    id: 21,
    icon: 'hugeicons:terminal-01',
    message: 'RCE attempt via Log4Shell payload in User-Agent header',
    country: 'North Korea',
    flag: '🇰🇵',
    type: 'rce',
    severity: 'critical',
    endpoint: '/api/log',
    time: '',
  },
  {
    id: 22,
    icon: 'hugeicons:terminal-01',
    message: 'Remote code execution via deserialized Java object payload',
    country: 'Belarus',
    flag: '🇧🇾',
    type: 'rce',
    severity: 'critical',
    endpoint: '/api/deserialize',
    time: '',
  },

  // LFI
  {
    id: 23,
    icon: 'hugeicons:folder-open',
    message: 'Local file inclusion attempt with ../../../etc/passwd',
    country: 'Algeria',
    flag: '🇩🇿',
    type: 'lfi',
    severity: 'critical',
    endpoint: '/api/file?name=',
    time: '',
  },
  {
    id: 24,
    icon: 'hugeicons:folder-open',
    message: 'Path traversal probe detected targeting server config files',
    country: 'Pakistan',
    flag: '🇵🇰',
    type: 'lfi',
    severity: 'high',
    endpoint: '/static',
    time: '',
  },

  // IDOR
  {
    id: 25,
    icon: 'hugeicons:user-shield-02',
    message: 'IDOR: User accessing /api/orders/99102 (not their account)',
    country: 'Mexico',
    flag: '🇲🇽',
    type: 'idor',
    severity: 'high',
    endpoint: '/api/orders/99102',
    time: '',
  },
  {
    id: 26,
    icon: 'hugeicons:user-shield-02',
    message: 'Horizontal privilege escalation via sequential ID enumeration',
    country: 'Argentina',
    flag: '🇦🇷',
    type: 'idor',
    severity: 'high',
    endpoint: '/api/users/id',
    time: '',
  },

  // XXE
  {
    id: 27,
    icon: 'hugeicons:xml',
    message: 'XXE payload detected in XML upload — DOCTYPE entity used',
    country: 'Spain',
    flag: '🇪🇸',
    type: 'xxe',
    severity: 'critical',
    endpoint: '/api/import',
    time: '',
  },

  // Deserialization
  {
    id: 28,
    icon: 'hugeicons:package-01',
    message: 'Unsafe deserialization of user-controlled pickle data (Python)',
    country: 'Italy',
    flag: '🇮🇹',
    type: 'deserialization',
    severity: 'critical',
    endpoint: '/api/session',
    time: '',
  },

  // Supply Chain
  {
    id: 29,
    icon: 'hugeicons:box-01',
    message: 'Dependency confusion attack via typosquatted npm package',
    country: 'USA',
    flag: '🇺🇸',
    type: 'supply-chain',
    severity: 'critical',
    endpoint: 'npm registry',
    time: '',
  },
  {
    id: 30,
    icon: 'hugeicons:box-01',
    message: 'Malicious package update detected in lodash-utils@4.17.21',
    country: 'Canada',
    flag: '🇨🇦',
    type: 'supply-chain',
    severity: 'critical',
    endpoint: 'npm registry',
    time: '',
  },

  // JWT
  {
    id: 31,
    icon: 'hugeicons:key-01',
    message: 'JWT "alg:none" bypass attempt on /api/admin endpoint',
    country: 'Sweden',
    flag: '🇸🇪',
    type: 'jwt',
    severity: 'critical',
    endpoint: '/api/admin',
    time: '',
  },
  {
    id: 32,
    icon: 'hugeicons:key-01',
    message: 'Weak JWT secret brute-forced — HS256 token forged',
    country: 'Finland',
    flag: '🇫🇮',
    type: 'jwt',
    severity: 'critical',
    endpoint: '/auth/token',
    time: '',
  },

  // OAuth
  {
    id: 33,
    icon: 'hugeicons:connect',
    message: 'OAuth redirect_uri manipulation to steal authorization code',
    country: 'Japan',
    flag: '🇯🇵',
    type: 'oauth',
    severity: 'high',
    endpoint: '/oauth/callback',
    time: '',
  },

  // Clickjacking
  {
    id: 34,
    icon: 'hugeicons:cursor-01',
    message: 'Clickjacking attempt — page embedded in cross-origin iframe',
    country: 'Australia',
    flag: '🇦🇺',
    type: 'clickjacking',
    severity: 'medium',
    endpoint: '/checkout',
    time: '',
  },

  // MitM
  {
    id: 35,
    icon: 'hugeicons:wifi-signal-no-network',
    message: 'Man-in-the-Middle: TLS downgrade attack forced to TLS 1.0',
    country: 'Czech Republic',
    flag: '🇨🇿',
    type: 'mitm',
    severity: 'critical',
    endpoint: '/api/*',
    time: '',
  },

  // Prototype Pollution
  {
    id: 36,
    icon: 'hugeicons:bug-01',
    message: 'Prototype pollution via __proto__ merge in JSON parsing',
    country: 'Denmark',
    flag: '🇩🇰',
    type: 'prototype-pollution',
    severity: 'high',
    endpoint: '/api/merge',
    time: '',
  },

  // Race Condition
  {
    id: 37,
    icon: 'hugeicons:clock-01',
    message: 'Race condition exploit on /api/withdraw — double spend attempt',
    country: 'Switzerland',
    flag: '🇨🇭',
    type: 'race-condition',
    severity: 'critical',
    endpoint: '/api/withdraw',
    time: '',
  },

  // Open Redirect
  {
    id: 38,
    icon: 'hugeicons:link-01',
    message: 'Open redirect used to phish users via trusted domain URL',
    country: 'Portugal',
    flag: '🇵🇹',
    type: 'open-redirect',
    severity: 'medium',
    endpoint: '/redirect?url=',
    time: '',
  },
];

export const getInitialThreats = (): (Threat & { liveId: number })[] =>
  threatPool.slice(0, 8).map((t, i) => ({
    ...t,
    liveId: i,
    time: getRelativeTime(i),
  }));

const getRelativeTime = (index: number): string => {
  if (index === 0) return 'just now';
  if (index === 1) return '18s ago';
  if (index === 2) return '45s ago';
  if (index === 3) return '1m ago';
  if (index === 4) return '2m ago';
  if (index === 5) return '4m ago';
  if (index === 6) return '6m ago';
  return `${index * 2}m ago`;
};

export const formatLiveTime = (): string => {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now
    .getMinutes()
    .toString()
    .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
};
