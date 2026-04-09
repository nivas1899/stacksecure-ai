import paths from './paths';

export interface SubMenuItem {
  name: string;
  pathName: string;
  path: string;
  icon?: string;
  active?: boolean;
  items?: SubMenuItem[];
}

export interface MenuItem {
  id: string;
  subheader: string;
  path?: string;
  icon?: string;
  avatar?: string;
  active?: boolean;
  items?: SubMenuItem[];
}

const sitemap: MenuItem[] = [
  {
    id: 'dashboard',
    subheader: 'Dashboard',
    path: '/',
    icon: 'hugeicons:grid-view',
    active: true,
  },
  {
    id: 'stackAnalyzer',
    subheader: 'Stack Analyzer',
    path: paths.stackAnalyzer,
    icon: 'hugeicons:search-02',
  },
  {
    id: 'vulnerabilities',
    subheader: 'Vulnerabilities',
    path: paths.vulnerabilities,
    icon: 'hugeicons:bug-01',
  },
  {
    id: 'threatFeed',
    subheader: 'Threat Feed',
    path: '#!',
    icon: 'mage:message-dots',
  },
  {
    id: 'securitySettings',
    subheader: 'Security Settings',
    path: paths.securitySettings,
    icon: 'hugeicons:settings-01',
  },
  {
    id: 'authentication',
    subheader: 'Authentication',
    icon: 'mynaui:lock-password',
    active: true,
    items: [
      {
        name: 'Sign In',
        pathName: 'signin',
        icon: '',
        path: paths.signin,
      },
      {
        name: 'Sign Up',
        pathName: 'signup',
        icon: '',
        path: paths.signup,
      },
    ],
  },
];

export default sitemap;
