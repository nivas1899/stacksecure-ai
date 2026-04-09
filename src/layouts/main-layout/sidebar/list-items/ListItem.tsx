import { Link as RouterLink, useLocation } from 'react-router-dom';
import { MenuItem } from 'routes/sitemap';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconifyIcon from 'components/base/IconifyIcon';

const ListItem = ({ subheader, icon, path, isCollapsed }: MenuItem & { isCollapsed?: boolean }) => {
  const { pathname } = useLocation();

  const isActive =
    path && path !== '#!'
      ? path === '/'
        ? pathname === '/'
        : pathname.startsWith(path)
      : false;

  const isExternal = !path || path === '#!';

  const linkProps = isExternal
    ? { component: 'a', href: '#!' }
    : { component: RouterLink, to: path as string };

  return (
    <ListItemButton
      {...linkProps}
      title={isCollapsed ? subheader : undefined} // Add tooltip if collapsed
      sx={{
        mb: 2.5,
        bgcolor: isActive ? 'primary.main' + '22' : undefined,
        borderLeft: isActive ? '2px solid' : '2px solid transparent',
        borderColor: isActive ? 'primary.main' : 'transparent',
        justifyContent: isCollapsed ? 'center' : 'flex-start',
        px: isCollapsed ? 1 : 2.5
      }}
    >
      <ListItemIcon sx={{ minWidth: isCollapsed ? 0 : 56, justifyContent: 'center' }}>
        {icon && (
          <IconifyIcon
            icon={icon}
            fontSize="h4.fontSize"
            sx={{ color: isActive ? 'primary.main' : 'text.secondary' }}
          />
        )}
      </ListItemIcon>
      {!isCollapsed && (
        <ListItemText
          primary={subheader}
          sx={{
            '& .MuiListItemText-primary': {
              color: isActive ? 'primary.main' : 'text.secondary',
              fontWeight: isActive ? 700 : 400,
            },
            whiteSpace: 'nowrap'
          }}
        />
      )}
    </ListItemButton>
  );
};

export default ListItem;
