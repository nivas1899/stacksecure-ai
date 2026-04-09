import { useState } from 'react';
import { MenuItem } from 'routes/sitemap';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import Collapse from '@mui/material/Collapse';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import IconifyIcon from 'components/base/IconifyIcon';

const CollapseListItem = ({ subheader, active, items, icon, isCollapsed }: MenuItem & { isCollapsed?: boolean }) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    if (isCollapsed) return; // Open logic is disabled when collapsed
    setOpen(!open);
  };

  return (
    <>
      <ListItemButton onClick={handleClick} sx={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}>
        <ListItemIcon sx={{ minWidth: isCollapsed ? 0 : 56, justifyContent: 'center' }}>
          {icon && (
            <IconifyIcon
              icon={icon}
              sx={{
                color: active ? 'text.primary' : null,
              }}
            />
          )}
        </ListItemIcon>
        {!isCollapsed && (
          <>
            <ListItemText
              primary={subheader}
              sx={{
                '& .MuiListItemText-primary': {
                  color: active ? 'text.primary' : null,
                },
                whiteSpace: 'nowrap'
              }}
            />
            <IconifyIcon
              icon="iconamoon:arrow-down-2-duotone"
              sx={{
                color: active ? 'text.primary' : 'text.disabled',
                transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease-in-out',
                ml: 1
              }}
            />
          </>
        )}
      </ListItemButton>

      {/* When collapsed, we could conceptually use a Popover, but for this task hiding it is standard */}
      {!isCollapsed && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {items?.map((route) => {
              return (
                <ListItemButton
                  key={route.pathName}
                  component={Link}
                  href={route.path}
                  sx={{ ml: 1.5, bgcolor: route.active ? 'info.main' : null }}
                >
                  <ListItemText
                    primary={route.name}
                    sx={{
                      '& .MuiListItemText-primary': {
                        color: 'text.primary',
                      },
                      whiteSpace: 'nowrap'
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Collapse>
      )}
    </>
  );
};

export default CollapseListItem;
