'use client';

import { AppBar, Toolbar, IconButton, Button, Box } from '@mui/material';
import { styled } from '@mui/system';
import Link from 'next/link';
import './header.css';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'inherit',
  transition: 'background-color 0.3s ease',
}));

const LogoImage = styled('img')({
  height: '30px',
  width: 'auto',
});

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '1rem 2rem',
});

const NavigationButton = styled(Button)(({ theme }) => ({
  color: '#ffffff',
  fontWeight: 600,
  padding: '8px 24px',
  borderRadius: '25px',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    transform: 'translateY(-2px)',
  },
}));

const TransparentHeader = () => {
  return (
      <StyledAppBar>
        <StyledToolbar>
          <IconButton
            edge="start"
            aria-label="home"
            sx={{ padding: 0 }}
          >
            <Link
              href="/">
              <LogoImage
                src="/jihasil_logo.svg"
                alt="Logo"
              />
            </Link>
          </IconButton>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <NavigationButton
              aria-label="about page"
            >
              <Link
                href="/about"
              >
                About
              </Link>
            </NavigationButton>
          </Box>
        </StyledToolbar>
      </StyledAppBar>
  );
};

export default TransparentHeader;