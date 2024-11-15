import React, { useState, useRef } from 'react';
import { useAuth } from "../../context/AuthContext"; // AuthContext에서 useAuth 가져오기
import { Typography, Box, Button, Container, Card, TextField, Modal } from '@mui/material';
import Header from '../../components/Header';
import Breadcrumb from '../../components/BreadCrumb';
import ProfileSection from "../../components/ProfileSection";
import { uploadAndAddVoice } from '../../api/voiceAPI';
import useLoading from '../../hooks/useLoading';
import useSnackbar from '../../hooks/useSnackbar'; // useSnackbar 훅 가져오기

const SettingVoice = () => {
  const { userObject } = useAuth(); // 전역 사용자 정보 가져오기
  const [isRecording, setIsRecording] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioURL, setAudioURL] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);
  const [voiceName, setVoiceName] = useState('');
  const { isLoading, setIsLoading, LoadingIndicator } = useLoading("목소리를 저장 중입니다..."); // 로딩 훅 사용
  const { openSnackbar, SnackbarComponent } = useSnackbar(); // useSnackbar 훅 사용
  const mediaRecorderRef = useRef(null);
  const intervalRef = useRef(null);

  const handleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsModalOpen(false); // 녹음 중지 시 모달 닫기
      clearInterval(intervalRef.current);
      setRecordingTime(0);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
  
        const audioChunks = [];
        let startTime = null;
  
        mediaRecorder.onstart = () => {
          startTime = Date.now(); // 녹음 시작 시간 기록
          setIsModalOpen(true); // 녹음 시작 시 모달 열기
          setRecordingTime(0); // 시간 초기화
          intervalRef.current = setInterval(() => {
            setRecordingTime((prev) => prev + 1);
          }, 1000); // 1초마다 증가
        };
  
        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };
  
        mediaRecorder.onstop = () => {
          const endTime = Date.now(); // 녹음 종료 시간 기록
          const duration = (endTime - startTime) / 1000; // 초 단위로 변환
          console.log("녹음 시간(초):", duration);

          clearInterval(intervalRef.current);
          
          // 녹음 시간이 10초 미만이면 사용자에게 알림
          if (duration < 10) {
            openSnackbar("녹음 시간이 너무 짧습니다. 최소 10초 이상 녹음해주세요.", "warning");
            return;
          }
  
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          const audioURL = URL.createObjectURL(audioBlob);
          setAudioBlob(audioBlob);
          setAudioURL(audioURL);
          setIsModalOpen(false); // 녹음 중지 시 모달 닫기
        };
  
        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Error accessing microphone:', err);
      }
    }
  };

  const handlePlayback = () => {
    if (audioURL) {
      const audio = new Audio(audioURL);
      audio.play();
    }
  };

  const handleSave = async () => {
    if (!userObject || !userObject.USER_SEQ) {
      openSnackbar("사용자 정보가 없습니다.", "error");
      return;
    }

    if (audioBlob && voiceName.trim() !== '') {
      try {
        setIsLoading(true); // 로딩 상태 시작
        // 서버에 파일 업로드하고 ElevenLabs에 추가
        const formData = new FormData();
        formData.append('file', audioBlob);
        formData.append('voiceName', voiceName);
        formData.append('userSeq', userObject.USER_SEQ);
        const response = await uploadAndAddVoice(formData);
        if (response.message === "Voice added successfully") {
          openSnackbar("목소리가 성공적으로 추가되었습니다.", "success");
        }
      } catch (error) {
        console.error("Failed to save voice:", error);
        openSnackbar("목소리를 저장하는 중에 오류가 발생했습니다.", "error");
      } finally {
        setIsLoading(false); // 로딩 상태 종료
      }
    } else {
      openSnackbar("목소리 이름을 입력해주세요.", "warning");
    }
  };

  const handleModalClose = () => {
    if (isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsModalOpen(false);
      clearInterval(intervalRef.current);
      setRecordingTime(0);
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

      <Card
         sx={{ width: 1100, margin: 'auto', mt: 4, p: 12, borderRadius: 5, boxShadow: 10, display: "flex", alignItems: "center", bgcolor: '#FFF2ED', marginTop: '50px',
          justifyContent: "center"}}
        >
      <Box flexGrow={1} display="flex" justifyContent="center" py={8} bgcolor="#FFF2ED"
      
      >
        {/* 모달 코드 */}
        <Modal open={isModalOpen} onClose={handleModalClose}>
          <Box sx={{ width: 400, margin: 'auto', marginTop: '15%', p: 4, bgcolor: 'white', borderRadius: 2 }}>
            <Typography variant="h6" align="center" gutterBottom>
              예문을 읽어주세요
            </Typography>
            <Typography variant="body1" align="center" gutterBottom>
              "가령 네가  오후 네 시에 온다면 나는 세 시부터 행복해질 거야. 시간이 가면 갈수록 그만큼 나는 더 행복해질 거야. 네 시가 되면 이미 나는 불안해지고 안절부절못하게 될 거야. 난 행복의 대가가 무엇인지 알게 되는 거야..."
            </Typography>
            <Typography variant="h6" align="center" color="textSecondary">
            녹음 시간: {recordingTime}초
            </Typography>
            <Button
              variant="contained"
              color="error"
              fullWidth
              onClick={handleModalClose}
              sx={{ mt: 2 }}
            >
              녹음 중지
            </Button>
          </Box>
        </Modal>
        <Container maxWidth="sm" >
          <Typography variant="h6" gutterBottom align="center" sx={{fontSize: "36px", marginTop: '-100px'}}>
            목소리 녹음하기
          </Typography>
          <Typography variant="body1" align="center" gutterBottom >
            본인의 목소리를 녹음해서 TTS로 사용할 수 있습니다.
            </Typography>
            <Typography variant="body1" align="center" marginTop='10px'
            gutterBottom >
            [녹음 버튼을 누르고 '최소 10초에서 1분 정도' 녹음해주세요.]
          </Typography>
          <Box  marginTop='30px'></Box>
          <TextField
            fullWidth
            label="목소리 이름"
            value={voiceName}
            onChange={(e) => setVoiceName(e.target.value)}
            variant="outlined"
            margin="normal"
            sx={{bgcolor: '#FFFFFF'}}
          />
          {isLoading ? (
            <LoadingIndicator /> // 로딩 중에는 LoadingIndicator 표시
          ) : (
            <Box display="flex"
             gap={5}
             marginTop='10px'
            marginBottom = '-80px'
            justifyContent="space-around" mt={4}>
              <Button
                variant={isRecording ? "outlined" : "contained"}
                color={isRecording ? "error" : "primary"}
                onClick={handleRecording}
                sx={{                   
                  padding: 1,
                   marginTop: '20px',
                  borderRadius: '50%',
                  width: '120px',
                  height: '120px',
                  bgcolor: isRecording ? 'transparent' : '#FF4C4C',
                  color: isRecording ? 'error.main' : '#FFFFFF',
                  '&:hover': {
                    bgcolor: '#FFFFFF',
                    color: '#FF4C4C',
                  }
                 }}
              >
                <Typography variant="subtitle1" gutterBottom align="center" sx={{fontWeight: 'bold', fontSize: "18px", marginTop: '15px'}}>
                {isRecording ? "녹음 중지" : "녹음 시작"}
                </Typography>
              </Button>
              
              <Button
                variant="contained"
                color="secondary"
                onClick={handlePlayback}
                disabled={!audioURL}
                sx={{ padding: 1,
                  bgcolor: '#FFA324',
                  marginTop: '20px',
                  borderRadius: '50%',
                  width: '120px',
                  height: '120px',
                '&:hover': {
                    bgcolor: '#FFFFFF',
                    color: '#FFA324',
                  }
                 }}
              >
                <Typography variant="subtitle1" gutterBottom align="center" sx={{fontWeight: 'bold', fontSize: "18px", marginTop: '15px'}}>
                들어보기
                </Typography>
              </Button>
              
              <Button
                variant="contained"
                color="success"
                onClick={handleSave}
                disabled={!audioBlob}
                sx={{ padding: 1,
                  bgcolor: '#00AB53',
                  marginTop: '20px',
                  borderRadius: '50%',
                  width: '120px',
                  height: '120px',
                '&:hover': {
                    bgcolor: '#FFFFFF',
                    color: '#00AB53',
                  }
                }}
              >
                <Typography variant="subtitle1" gutterBottom align="center" sx={{fontWeight: 'bold', fontSize: "18px", marginTop: '15px'}}>
                목소리 저장
                </Typography>
              </Button>
            </Box>
          )}
        </Container>
      </Box>

      <SnackbarComponent />
      </Card>
    </Box>
  );
};

export default SettingVoice;