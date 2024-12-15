import { Box, Fade, Modal } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  outline: 'none',
  boxSizing: 'none',
};

export default function PostView(props:  {open: boolean, handleClose: () => void, image: string }) {
  const { open, handleClose, image } = props;

  return (
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
            alt={image}
            loading="lazy"
            style={{
              display: 'block',
              maxWidth: '70vw',
              border: '5px solid #fff', // 흰색 경계 추가
              borderRadius: '8px', // 경계에 둥근 모서리 추가
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)', // 부드러운 그림자 효과 추가
            }}
          />
        </Fade>
      </Box>
    </Modal>);
}