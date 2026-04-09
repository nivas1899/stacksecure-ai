export interface Vulnerability {
  id: number;
  tech: string;
  version: string;
  icon: string;
  vuln: string;
  severity: 'Critical' | 'Medium' | 'Low';
  cve?: string;
}

export const vulnerabilities: Vulnerability[] = [
  {
    id: 1,
    tech: 'React',
    version: 'v18.2.0',
    icon: 'logos:react',
    vuln: 'XSS via dangerouslySetInnerHTML',
    severity: 'Critical',
    cve: 'CVE-2024-1234',
  },
  {
    id: 2,
    tech: 'Node.js',
    version: 'v18.16.0',
    icon: 'logos:nodejs-icon',
    vuln: 'Path traversal in fs module',
    severity: 'Critical',
    cve: 'CVE-2023-9876',
  },
  {
    id: 3,
    tech: 'MongoDB',
    version: 'v6.0.5',
    icon: 'logos:mongodb-icon',
    vuln: 'NoSQL injection via $where',
    severity: 'Medium',
    cve: 'CVE-2023-5432',
  },
  {
    id: 4,
    tech: 'Express',
    version: 'v4.18.2',
    icon: 'simple-icons:express',
    vuln: 'Open redirect vulnerability',
    severity: 'Medium',
    cve: 'CVE-2024-2200',
  },
  {
    id: 5,
    tech: 'Next.js',
    version: 'v14.0.3',
    icon: 'logos:nextjs-icon',
    vuln: 'Server-side request forgery (SSRF)',
    severity: 'Critical',
    cve: 'CVE-2024-3310',
  },
  {
    id: 6,
    tech: 'Firebase',
    version: 'v10.7.0',
    icon: 'logos:firebase',
    vuln: 'Insecure Firestore rules',
    severity: 'Low',
    cve: undefined,
  },
  {
    id: 7,
    tech: 'Webpack',
    version: 'v5.88.0',
    icon: 'logos:webpack',
    vuln: 'Prototype pollution in loader',
    severity: 'Medium',
    cve: 'CVE-2023-7788',
  },
  {
    id: 8,
    tech: 'npm',
    version: 'v9.8.0',
    icon: 'logos:npm-icon',
    vuln: 'Dependency confusion attack',
    severity: 'Critical',
    cve: 'CVE-2024-4455',
  },
];
