export type ThreatType = 'xss' | 'bruteforce' | 'exposure' | 'injection' | 'ddos';

export interface Threat {
  id: number;
  icon: string;
  message: string;
  country: string;
  flag: string;
  type: ThreatType;
  time: string;
}

export const threatPool: Threat[] = [
  {
    id: 1,
    icon: 'hugeicons:alert-02',
    message: 'Reflected XSS attempt detected in /api/comments',
    country: 'USA',
    flag: 'US',
    type: 'xss',
    time: '',
  },
  {
    id: 2,
    icon: 'hugeicons:database-01',
    message: 'Storage exposure linked to a public bucket policy',
    country: 'Germany',
    flag: 'DE',
    type: 'exposure',
    time: '',
  },
  {
    id: 3,
    icon: 'hugeicons:login-03',
    message: 'Credential stuffing spike on /auth/login',
    country: 'India',
    flag: 'IN',
    type: 'bruteforce',
    time: '',
  },
  {
    id: 4,
    icon: 'hugeicons:code-square',
    message: 'SQL injection probe blocked in search parameter',
    country: 'Russia',
    flag: 'RU',
    type: 'injection',
    time: '',
  },
  {
    id: 5,
    icon: 'hugeicons:flash',
    message: 'Traffic flood detected on CDN edge route',
    country: 'China',
    flag: 'CN',
    type: 'ddos',
    time: '',
  },
  {
    id: 6,
    icon: 'hugeicons:alert-02',
    message: 'Stored XSS payload blocked in profile bio field',
    country: 'Brazil',
    flag: 'BR',
    type: 'xss',
    time: '',
  },
  {
    id: 7,
    icon: 'hugeicons:file-01',
    message: 'Crawler attempted access to exposed .env file',
    country: 'UK',
    flag: 'GB',
    type: 'exposure',
    time: '',
  },
  {
    id: 8,
    icon: 'hugeicons:login-03',
    message: 'SSH brute force pattern crossed alert threshold',
    country: 'Nigeria',
    flag: 'NG',
    type: 'bruteforce',
    time: '',
  },
  {
    id: 9,
    icon: 'hugeicons:code-square',
    message: 'NoSQL injection operator bypass attempt blocked',
    country: 'Ukraine',
    flag: 'UA',
    type: 'injection',
    time: '',
  },
  {
    id: 10,
    icon: 'hugeicons:flash',
    message: 'API abuse rule challenged 10k requests in 60 seconds',
    country: 'Netherlands',
    flag: 'NL',
    type: 'ddos',
    time: '',
  },
  {
    id: 11,
    icon: 'hugeicons:alert-02',
    message: 'Script injection pattern found in rich text payload',
    country: 'Canada',
    flag: 'CA',
    type: 'xss',
    time: '',
  },
  {
    id: 12,
    icon: 'hugeicons:database-01',
    message: 'MongoDB port scan blocked at perimeter firewall',
    country: 'France',
    flag: 'FR',
    type: 'exposure',
    time: '',
  },
];

export const getInitialThreats = (): (Threat & { liveId: number })[] =>
  threatPool.slice(0, 6).map((t, i) => ({
    ...t,
    liveId: i,
    time: getRelativeTime(i),
  }));

const getRelativeTime = (index: number): string => {
  if (index === 0) return 'just now';
  if (index === 1) return '2m ago';
  if (index === 2) return '5m ago';
  if (index === 3) return '8m ago';
  return `${index * 3}m ago`;
};

export const formatLiveTime = (): string => {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now
    .getMinutes()
    .toString()
    .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
};
