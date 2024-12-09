"use client"
import React from 'react';
import { styled } from '@mui/system';

const Footer = styled('footer')({
  display: 'grid',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%', // 화면 너비를 100%로 확장
  padding: '10px 0',
  color: '#fff', // 글자색
  fontSize: '14px', // 폰트 크기
  textAlign: 'center', // 텍스트 중앙 정렬,
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