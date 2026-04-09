import { PropsWithChildren } from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Topbar from 'layouts/main-layout/topbar';
import AboutSection from 'components/common/AboutSection';
import Footer from 'components/common/Footer';

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <Stack
      direction="column"
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        transition: 'background-color 0.3s ease',
      }}
    >
      <Topbar />

      <Box
        component="main"
        sx={{
          flex: 1,
          width: '100%',
          maxWidth: 1280,
          mx: 'auto',
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 2.5, md: 4 },
        }}
      >
        {children}
      </Box>

      <Box
        sx={{
          width: '100%',
          maxWidth: 1280,
          mx: 'auto',
          px: { xs: 2, sm: 3, md: 4 },
          pb: { xs: 3, md: 5 },
        }}
      >
        <AboutSection />
      </Box>

      <Box
        sx={{
          borderTop: '1px solid',
          borderColor: 'divider',
          py: 2,
          px: { xs: 2, md: 4 },
          transition: 'border-color 0.3s ease',
        }}
      >
        <Footer />
      </Box>
    </Stack>
  );
};

export default MainLayout;
