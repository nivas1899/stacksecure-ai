export const rootPaths = {
  root: '/',
  pageRoot: 'pages',
  authRoot: 'authentication',
  errorRoot: 'error',
};

export default {
  dashboard: `/${rootPaths.pageRoot}/dashboard`,
  stackAnalyzer: `/${rootPaths.pageRoot}/stack-analyzer`,
  vulnerabilities: `/${rootPaths.pageRoot}/vulnerabilities`,
  threatFeed: `/${rootPaths.pageRoot}/threat-feed`,
  securitySettings: `/${rootPaths.pageRoot}/security-settings`,

  signin: `/${rootPaths.authRoot}/signin`,
  signup: `/${rootPaths.authRoot}/signup`,
  forgotPassword: `/${rootPaths.authRoot}/forgot-password`,
  404: `/${rootPaths.errorRoot}/404`,
};
