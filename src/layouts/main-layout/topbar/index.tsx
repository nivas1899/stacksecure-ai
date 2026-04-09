import { Link as RouterLink, useLocation } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import IconifyIcon from 'components/base/IconifyIcon';
import { useThemeMode } from 'context/ThemeContext';
import paths from 'routes/paths';

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: 'hugeicons:grid-view' },
  { label: 'Analyzer', path: paths.stackAnalyzer, icon: 'hugeicons:search-02' },
  { label: 'Vulnerabilities', path: paths.vulnerabilities, icon: 'hugeicons:bug-01' },
  { label: 'Threat Feed', path: '#!', icon: 'mage:message-dots' },
  { label: 'Settings', path: paths.securitySettings, icon: 'hugeicons:settings-01' },
];

const NavLink = styled(ButtonBase)<{ active: number }>(({ theme, active }) => ({
  padding: '8px 16px',
  borderRadius: '8px',
  fontSize: theme.typography.body2.fontSize,
  fontWeight: active ? 700 : 500,
  color: active ? theme.palette.primary.main : theme.palette.text.secondary,
  backgroundColor: active ? `${theme.palette.primary.main}14` : 'transparent',
  transition: 'all 0.25s ease',
  '&:hover': {
    color: theme.palette.primary.main,
    backgroundColor: `${theme.palette.primary.main}0A`,
  },
}));

const Topbar = () => {
  const { pathname } = useLocation();
  const { mode, toggleMode } = useThemeMode();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '#!') return false;
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <Stack
      component="header"
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        px: { xs: 2, sm: 3, md: 4 },
        minHeight: 72,
        bgcolor: mode === 'hacker' ? 'rgba(17, 17, 17, 0.86)' : 'rgba(255, 255, 255, 0.86)',
        borderBottom: '1px solid',
        borderColor: 'divider',
        position: 'sticky',
        top: 0,
        zIndex: 1200,
        transition: 'background-color 0.3s ease, border-color 0.3s ease',
        backdropFilter: 'blur(16px)',
      }}
    >
      <ButtonBase
        component={RouterLink}
        to="/"
        disableRipple
        sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexShrink: 0 }}
      >
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: '8px',
            display: 'grid',
            placeItems: 'center',
            color: mode === 'hacker' ? '#06120D' : '#FFFFFF',
            bgcolor: 'primary.main',
            boxShadow: mode === 'hacker' ? '0 0 18px #00FF9F55' : '0 10px 28px rgba(37,99,235,0.22)',
          }}
        >
          <IconifyIcon icon="hugeicons:shield-key" sx={{ width: 22, height: 22 }} />
        </Box>
        <Stack direction="column" spacing={0} sx={{ display: { xs: 'none', sm: 'flex' } }}>
          <Typography
            variant="subtitle2"
            fontWeight={800}
            color="primary.main"
            lineHeight={1.1}
            sx={{
              ...(mode === 'hacker' && {
                textShadow: '0 0 10px currentColor',
              }),
            }}
          >
            DNX Command
          </Typography>
          <Typography variant="caption" color="text.secondary" lineHeight={1.2} sx={{ fontSize: '0.68rem' }}>
            Security workspace
          </Typography>
        </Stack>
      </ButtonBase>

      <Stack
        direction="row"
        spacing={0.5}
        alignItems="center"
        sx={{ display: { xs: 'none', md: 'flex' } }}
      >
        {navItems.map((item) => {
          const active = isActive(item.path);
          const linkProps = item.path === '#!'
            ? {}
            : { component: RouterLink, to: item.path };

          return (
            <NavLink
              key={item.label}
              active={active ? 1 : 0}
              {...linkProps}
              disableRipple
            >
              <IconifyIcon icon={item.icon} sx={{ width: 16, height: 16, mr: 0.75 }} />
              {item.label}
            </NavLink>
          );
        })}
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center">
        <Button
          variant="outlined"
          size="small"
          onClick={toggleMode}
          startIcon={
            <IconifyIcon
              icon={mode === 'hacker' ? 'hugeicons:terminal-01' : 'hugeicons:sun-03'}
              sx={{ width: 16, height: 16 }}
            />
          }
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.75rem',
            borderColor: 'divider',
            color: 'text.secondary',
            px: 1.5,
            py: 0.5,
            transition: 'all 0.25s ease',
            '&:hover': {
              borderColor: 'primary.main',
              color: 'primary.main',
              bgcolor: 'transparent',
            },
            ...(mode === 'hacker' && {
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': {
                boxShadow: '0 0 12px #00FF9F33',
                bgcolor: 'transparent',
              },
            }),
          }}
        >
          <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>
            {mode === 'hacker' ? 'Hacker Mode' : 'Professional'}
          </Box>
        </Button>

        <IconButton
          onClick={() => setMobileOpen(true)}
          sx={{ display: { md: 'none' }, color: 'text.primary' }}
        >
          <IconifyIcon icon="hugeicons:menu-01" />
        </IconButton>
      </Stack>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          display: { md: 'none' },
          '& .MuiDrawer-paper': {
            width: 260,
            bgcolor: 'background.paper',
            p: 2,
          },
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight={700} color="text.primary">
            Navigation
          </Typography>
          <IconButton onClick={() => setMobileOpen(false)} size="small">
            <IconifyIcon icon="hugeicons:cancel-01" sx={{ width: 18, height: 18 }} />
          </IconButton>
        </Stack>
        <List>
          {navItems.map((item) => {
            const active = isActive(item.path);
            const linkProps = item.path === '#!'
              ? { component: 'a' as const, href: '#!' }
              : { component: RouterLink, to: item.path };

            return (
              <ListItemButton
                key={item.label}
                {...linkProps}
                onClick={() => setMobileOpen(false)}
                sx={{
                  borderRadius: '8px',
                  mb: 0.5,
                  bgcolor: active ? 'primary.main' + '14' : undefined,
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <IconifyIcon
                    icon={item.icon}
                    sx={{
                      width: 20,
                      height: 20,
                      color: active ? 'primary.main' : 'text.secondary',
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    variant: 'body2',
                    fontWeight: active ? 700 : 400,
                    color: active ? 'primary.main' : 'text.primary',
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Drawer>
    </Stack>
  );
};

export default Topbar;
