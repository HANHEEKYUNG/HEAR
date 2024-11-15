import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
} from "@mui/material";
import { updateNotice } from "../../api/NoticeAPI.js"; // 공지사항 업데이트 API 호출

const NoticeUpdateModal = ({ open, onClose, notice, onSuccess }) => {
  const [title, setTitle] = useState(notice?.NOTICE_TITLE || '');
  const [detail, setDetail] = useState(notice?.NOTICE_DETAIL || '');

  // 모달이 열릴 때 notice 값에 따라 상태를 설정
  useEffect(() => {
    if (notice) {
      setTitle(notice.NOTICE_TITLE || '');
      setDetail(notice.NOTICE_DETAIL || '');
    }
  }, [notice, open]); // notice나 open 값이 변경될 때 실행

  const handleUpdateSubmit = async (event) => {
    event.preventDefault();

    console.log('notice', notice);
        
    const updatedData = {
      noticeSeq: notice.NOTICE_SEQ,
      title,
      detail,
    };

    try {
      await updateNotice(updatedData);
      onSuccess(); // 업데이트 성공 시 목록 새로고침
      onClose(); // 모달 닫기
    } catch (error) {
      console.error("공지사항 업데이트 실패:", error);
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
          공지사항 수정
        </Typography>
        <form onSubmit={handleUpdateSubmit}>
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
            수정 완료
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default NoticeUpdateModal;
