import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import Sidebar from './Sidebar';

const LayoutRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%',
  paddingTop: 64,
}));

export const MainLayout = (props:any) => {
  const { children } = props;
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
    <Sidebar
      onClose={() => setSidebarOpen(false)}
      open={isSidebarOpen}
      />
      <LayoutRoot>
        <Box
          sx={{
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
            width: '100%'
          }}
        >
          {children}
        </Box>
      </LayoutRoot>
      </>
  );
};
