"use client"
import React from 'react';
import { styled } from '@mui/system';

const Footer = styled('footer')({
  display: 'flex',
  alignItems: 'center',
});

export default function footerFunction() {
  return (
    <Footer>
      <h4>
        Copyright 2024. Jihasil All rights reserved
      </h4>
    </Footer>
  );
}