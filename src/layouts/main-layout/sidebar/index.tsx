import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import DrawerItems from './DrawerItems';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsClosing: React.Dispatch<React.SetStateAction<boolean>>;
  isCollapsed?: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = ({ mobileOpen, setMobileOpen, setIsClosing, isCollapsed = false, setIsCollapsed }: SidebarProps) => {
  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  return (
    <Box
      component="nav"
      width={{ lg: isCollapsed ? 88 : 252 }}
      sx={{ transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
      flexShrink={{ lg: 0 }}
      display={{ xs: 'none', lg: 'block' }}
      zIndex={1300}
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onTransitionEnd={handleDrawerTransitionEnd}
        onClose={handleDrawerClose}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', lg: 'none' }, '& .MuiDrawer-paper': { width: 252 } }}
      >
        <DrawerItems />
      </Drawer>

      <Drawer 
        variant="permanent" 
        sx={{ 
          display: { xs: 'none', lg: 'block' },
          '& .MuiDrawer-paper': { 
            width: isCollapsed ? 88 : 252, 
            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            overflowX: 'hidden'
          }
        }} 
        open
      >
        <DrawerItems isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </Drawer>
    </Box>
  );
};

export default Sidebar;
