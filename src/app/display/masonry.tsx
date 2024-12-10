'use client';
import Masonry from '@mui/lab/Masonry';
import * as React from 'react';
import { Box, Fade, Modal } from '@mui/material';
import { useEffect } from 'react';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  border: '2px solid #000',
};

export default function ImageMasonry() {
  const [open, setOpen] = React.useState(false);
  const [imageData, setImageData] = React.useState<string[]>([]);
  const [image, setImage] = React.useState('');
  const handleClose = () => setOpen(false);
  const handleImage = (value: string) => {
    setImage(value);
    setOpen(true);
  };

  // useEffect 내에서 비동기 함수 호출
  useEffect(() => {
    const response = fetch('/api/fetchS3');
    response
      .then(async response => {
        if (response.ok) {
          const data: string[] = await response.json();
          setImageData(data);  // 응답 받은 데이터를 상태에 저장
        }
      })
      .catch(err => {
        console.error(err)
      });
  }, []);  // 빈 배열을 의존성 배열로 사용하여 최초 렌더링 시 한 번만 호출

  return (
    <Masonry columns={{ xs: 3, sm: 4, md: 5 }} spacing={2}>
      {imageData.map((item: string, index: number) => (
        <div key={index}>
          <img
            onClick={() => handleImage(item)}
            src={`${item}`}
            alt={item}
            loading="lazy"
            style={{
              borderRadius: 4,
              display: 'block',
              width: '100%',
            }}
          />
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Fade in={open} timeout={500}>
                <img
                  src={`${image}`}
                  alt={item}
                  loading="lazy"
                  style={{
                    display: 'block',
                    width: '100%',
                    border: '5px solid #fff', // 흰색 경계 추가
                    borderRadius: '8px', // 경계에 둥근 모서리 추가
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)', // 부드러운 그림자 효과 추가
                  }}
                />
              </Fade>
            </Box>
          </Modal>
        </div>
      ))}
    </Masonry>
  );
}