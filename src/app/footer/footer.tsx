"use client"
import React from 'react';
import { styled } from '@mui/system';
import Link from 'next/link';

const Footer = styled('footer')({
  display: 'flex',
  flex: '1',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'fixed',
  backgroundColor: 'inherit',
  width: '100%', // 화면 너비를 100%로 확장
  padding: '10px 0',
  color: '#fff', // 글자색
  fontSize: '14px', // 폰트 크기
  textAlign: 'center', // 텍스트 중앙 정렬,
});

export default function footerFunction() {
  return (
    <Footer>
      <Link style={{ marginBottom:'5px' }} href="/subscribe">구독하기</Link>
      <strong>
        Copyright 2024. Jihasil All rights reserved
      </strong>
    </Footer>
  );
}