import React, { useState, useRef, useEffect } from "react";
import { Box, Button, TextField, Typography, Rating, Card, CardContent, Container } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/Header";
import Breadcrumb from "../../components/BreadCrumb";
import ProfileSection from "../../components/ProfileSection";

import { submitBookReport, updateBookReport, convertSpeechToText } from "../../api/studyAPI";

const WriteReport = () => {
  const { userObject } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, report } = location.state || {}; // location.state에서 mode와 report 추출

  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [rating, setRating] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);

  useEffect(() => {
    if (report) {
      // 수정 모드일 경우, report 데이터로 필드 초기화
      setTitle(report.REPORT_TITLE || '');
      setDetail(report.REPORT_DETAIL || '');
      setRating(report.RATING || 0);
    }
  }, [report]);

  const handleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        const audioChunks = [];
        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          const file = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });

          try {
            const text = await convertSpeechToText(file);
            setDetail((prevDetail) => prevDetail + " " + text);
          } catch (error) {
            console.error("STT 변환 중 오류:", error);
          }
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Error accessing microphone:", err);
      }
    }
  };

  const speakText = () => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(detail);
    synth.speak(utterance);
  };

  const handleReportSubmit = async (event) => {
    event.preventDefault();
    const reportData = { userseq: userObject?.USER_SEQ, nickname: userObject?.NICKNAME, title, detail, rating };

    try {
      if (report) {
        // 수정 모드일 경우, updateBookReport 호출
        await updateBookReport(report.REPORT_SEQ, reportData);
      } else {
        // 새로 작성하는 경우
        await submitBookReport(reportData);
      }
      navigate('/mystudy/mybookreport');
    } catch (error) {
      console.error("독서노트 처리 실패:", error);
    }
  };

  return (
    <Box
      bgcolor="#FFFEFE"
      sx={{
        minHeight: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />
      <Breadcrumb />
      <ProfileSection />

      <Container maxWidth="xl" sx={{ mt: 3, marginTop: "0px" }}>
        <Card component="form" onSubmit={handleReportSubmit}  sx={{
            width: 1200,
            margin: "auto",
            mt: 4,
            p: 10,
            borderRadius: 5,
            boxShadow: 10,
            bgcolor: "#EAF7FF",
            mb: 10,
          }}>
<CardContent>
          <Typography variant="h6"
              gutterBottom
              align="center"
              sx={{ mb: 4, fontSize: "36px", marginTop: "-50px" }}
            >{report ? '독서노트 수정' : '독서노트 작성'}</Typography>

         {/* 사용자 정보 표시 */}
            <Typography gutterBottom>
              <Box component="span" variant="subtitle1" fontWeight="bold" sx={{ fontSize: 20}}>
                {"작성자: [   "}
              </Box>
              <Box
                component="span"
                variant="h6"
                sx={{ fontWeight: "bold", color: "#4F2F33", fontSize: "23px" }}
              >
            {userObject?.NICKNAME}
            </Box>
              <Box component="span" variant="subtitle1" fontWeight="bold">
                {"   ]"}
              </Box>
            </Typography>

          <TextField label="제목"
          fullWidth required  margin="normal" value={title}
          onChange={(e) => setTitle(e.target.value)} sx={{ bgcolor: "#FFFFFF", mb: 1 }} />

          <Box  sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mr: 1, fontSize: 20, fontWeight: 'bold' }}>평점:</Typography>
            <Rating value={rating} onChange={(e, newValue) => setRating(newValue)}
            sx={{mt: -0.2, fontSize: 26}}
            />
          </Box>

          {mode === 'voice' && (
            <>
            <Box sx={{display: 'flex', align: 'center', justifyContent: 'center', }}>
              <Button
                variant={isRecording ? "contained" : "outlined"}
                color={isRecording ? "error" : "primary"}
                onClick={handleRecording}
                sx={{ 
                  width: '100%', mb: 2,
                fontSize: "16px",
                fontWeight: "bold",
                color: '#72A8FF ',
            bgcolor: '#ffffff',
            borderColor: '#72A8FF ',
            '&:hover': {
              bgcolor: '#72A8FF ',
              borderColor: '#72A8FF ',
              color: '#FFFFFF', // 흰색 텍스트
            },
                 }}
              >
                {isRecording ? "녹음 중지" : "음성 녹음 시작"}
              </Button>
              </Box>
              <Box sx={{display: 'flex', align: 'center', justifyContent: 'center', }}>
              <Button variant="outlined" onClick={speakText} color="secondary" fullWidth sx={{ width: '100%', mb: 2,
                fontSize: "16px",
                fontWeight: "bold",
                color: '#FFB74D ',
            bgcolor: '#ffffff',
            borderColor: '#FFB74D ',
            '&:hover': {
              bgcolor: '#FFB74D ',
              borderColor: '#FFB74D ',
              color: '#FFFFFF', // 흰색 텍스트
            },
               }}>작성 중인 내용 듣기
               </Button>
               </Box>
            </>
          )}

          <TextField
            label="내용"
             variant="outlined"
            fullWidth
            required
            multiline
            rows={8}
            margin="normal"
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            sx={{ mb: 2, bgcolor: "#FFFFFF" }}
          />
 
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 10, mt: 4 }}>
            <Button type="submit" variant="outlined" fullWidth sx={{ display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    align: "center",

                    fontWeight: "bold",
                    maxWidth: 300,
                    width: "60%",
                    fontSize: "16px",
                    color: "#72A8FF",
                    bgcolor: "#FFFFFF",
                    borderColor: "#72A8FF",
                    "&:hover": {
                      backgroundColor: "#72A8FF", // hover 시 배경색 변경
                      color: "#ffffff", // hover 시 글자색 변경
                    }, }}>{report ? '수정 완료' : '작성 완료'}</Button>
            <Button variant="outlined" sx={{ 
              maxWidth: 300,
              width: '60%',
              fontSize: "16px",
              fontWeight: "bold",
              color: '#FF440D ',
          bgcolor: '#ffffff',
          borderColor: '#FF440D ',
          '&:hover': {
            bgcolor: '#FF440D ',
            color: '#FFFFFF', // 흰색 텍스트
          },
              }} onClick={() => navigate(-1)}>취소</Button>
          </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default WriteReport;
