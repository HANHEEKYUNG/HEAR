import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
} from "@mui/material";
import { fetchNoticeWrite } from "../../api/NoticeAPI.js"; // 작성 API 임포트

const NoticeWriteModal = ({ open, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');

  const handleWriteSubmit = async (event) => {
    event.preventDefault();

    const postData = {
      userseq: 2, // 관리자 사용자 ID로 가정
      nickname: '관리자',
      title,
      detail,
    };

    try {
      await fetchNoticeWrite(postData);
      setTitle("");
      setDetail("");
      onSuccess(); // 성공 시 상위 컴포넌트에서 다시 데이터 로드
      onClose(); // 모달 닫기
    } catch (error) {
      console.error("게시글 작성 실패:", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          공지사항 작성
        </Typography>
        <form onSubmit={handleWriteSubmit}>
          <TextField
            label="제목"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            label="내용"
            variant="outlined"
            fullWidth
            required
            multiline
            rows={6}
            margin="normal"
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            작성 완료
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default NoticeWriteModal;
