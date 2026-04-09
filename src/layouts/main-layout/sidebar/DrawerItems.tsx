import sitemap from 'routes/sitemap';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import CollapseListItem from './list-items/CollapseListItem';
import ListItem from './list-items/ListItem';
import Image from 'components/base/Image';
import LogoImg from 'assets/images/Logo.png';

import Box from '@mui/material/Box';
import IconifyIcon from 'components/base/IconifyIcon';

const DrawerItems = ({ isCollapsed = false, setIsCollapsed }: { isCollapsed?: boolean; setIsCollapsed?: React.Dispatch<React.SetStateAction<boolean>> }) => {
  return (
    <>
      <Stack
        position="sticky"
        top={0}
        pt={3.5}
        pb={2.5}
        alignItems="center"
        bgcolor="background.paper"
        borderBottom="1px solid"
        borderColor="divider"
        zIndex={1000}
      >
        <Stack direction="row" alignItems="center" justifyContent={isCollapsed ? 'center' : 'flex-start'} width="100%" px={isCollapsed ? 1 : 2.5}>
          <Box 
            onClick={(e) => {
              e.preventDefault();
              setIsCollapsed?.((prev) => !prev);
            }} 
            sx={{ 
              cursor: 'pointer', 
              display: 'flex', 
              color: 'text.secondary', 
              mr: isCollapsed ? 0 : 1.5, 
              p: 0.5,
              borderRadius: 1,
              transition: 'color 0.2s',
              '&:hover': { color: 'text.primary', bgcolor: 'action.hover' } 
            }}
          >
            <IconifyIcon icon="hugeicons:menu-01" width={22} height={22} />
          </Box>
          {!isCollapsed && (
            <ButtonBase component={Link} href="/" disableRipple sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
              <Image src={LogoImg} alt="logo" height={36} width={36} />
              <Stack direction="column" spacing={0} alignItems="flex-start" sx={{ whiteSpace: 'nowrap' }}>
                <Typography variant="subtitle1" fontWeight={800} color="primary.main" lineHeight={1.1}>
                  StackSecure
                </Typography>
                <Typography variant="caption" color="text.secondary" letterSpacing={2} lineHeight={1.2}>
                  AI
                </Typography>
              </Stack>
            </ButtonBase>
          )}
        </Stack>
      </Stack>

      <List component="nav" sx={{ mt: 4, mb: 4, px: 0 }}>
        {sitemap.map((route) =>
          route.items ? (
            <CollapseListItem key={route.id} {...route} isCollapsed={isCollapsed} />
          ) : (
            <ListItem key={route.id} {...route} isCollapsed={isCollapsed} />
          ),
        )}
      </List>

    </>
  );
};

export default DrawerItems;
