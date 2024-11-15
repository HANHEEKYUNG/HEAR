import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import useSnackbar from "../../hooks/useSnackbar";
import useLoading from "../../hooks/useLoading";
import useElevenLabsTTS from "../../hooks/useElevenLabsTTS";
import { Typography, Container, Box, Button, Radio, RadioGroup, FormControlLabel, Select, MenuItem, Card, CardContent, Dialog, DialogActions, DialogContent, DialogContentText } from "@mui/material";

import Header from "../../components/Header";
import Breadcrumb from "../../components/BreadCrumb";
import ProfileSection from "../../components/ProfileSection";
import { fetchVoiceList, saveUserSettings, deleteVoice } from "../../api/voiceAPI";

const SettingAudio = () => {
  const navigate = useNavigate();
  const { userObject, setUserObject } = useAuth(); // setUserObject 가져오기
  const { openSnackbar, SnackbarComponent } = useSnackbar();
  const { isLoading, setIsLoading, LoadingIndicator } = useLoading("삭제 중...");
  const { saveTTSFile } = useElevenLabsTTS();

  const [voiceList, setVoiceList] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [speed, setSpeed] = useState(1.0);
  const [audioElement, setAudioElement] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const defaultVoice = ["XOjX7HuCs6jtaR1NqWIW", "CmvK4l3jURa7bBhVQAgX"];

  useEffect(() => {
    if (!userObject) return;

    const getVoices = async () => {
      try {
        const voices = await fetchVoiceList(userObject.USER_SEQ);
        setVoiceList(voices);
        
        // 저장된 EL_ID가 있는 경우, 그 값을 selectedVoice의 기본값으로 설정
        const initialVoice = userObject.EL_ID || (voices[0]?.EL_ID ?? "");
        setSelectedVoice(initialVoice);
      } catch (error) {
        console.error("Error fetching voice list:", error);
      }
    };
    getVoices();
  }, [userObject]);

  const handlePreview = async () => {
    try {
      await saveTTSFile(selectedVoice, "", "preview");
      const audioUrl = `/static/audio/preview/preview_voice_${selectedVoice}.mp3`;

      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
      const newAudio = new Audio(audioUrl);
      newAudio.playbackRate = speed;
      newAudio.play();
      setAudioElement(newAudio);
    } catch (error) {
      console.error("Error generating TTS preview:", error);
      openSnackbar("미리듣기 생성에 실패했습니다.", "error");
    }
  };

  const handleStopPreview = () => {
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }
  };

  const handleSaveSettings = async () => {
    try {
      if (!userObject) return;

      await saveUserSettings({
        user_seq: userObject.USER_SEQ,
        selectedVoice,
        speed,
      });

      // userObject 업데이트
      const updatedUser = {
        ...userObject,
        EL_ID: selectedVoice,
      };
      setUserObject(updatedUser);

      openSnackbar("설정이 저장되었습니다.", "success");
    } catch (error) {
      console.error("Error saving settings:", error);
      openSnackbar("설정 저장에 실패했습니다.", "error");
    }
  };

  const handleDeleteVoice = async () => {
    if (defaultVoice.includes(selectedVoice)) {
      openSnackbar("기본 목소리는 삭제할 수 없습니다.", "warning");
      return;
    }
    setDialogOpen(true); // 다이얼로그 열기
  };

  const confirmDeleteVoice = async () => {
    setIsLoading(true);
    try {
      await deleteVoice(selectedVoice);

      const updatedVoiceList = voiceList.filter(
        (voice) => voice.EL_ID !== selectedVoice
      );

      setVoiceList(updatedVoiceList);
      setSelectedVoice(updatedVoiceList.length > 0 ? updatedVoiceList[0].EL_ID : "");

      openSnackbar("목소리가 성공적으로 삭제되었습니다.", "success");
    } catch (error) {
      console.error("Error deleting voice:", error);
      openSnackbar("목소리 삭제에 실패했습니다.", "error");
    } finally {
      setIsLoading(false);
      setDialogOpen(false); // 다이얼로그 닫기
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
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

      <Container maxWidth="xl" sx={{ mt: 3, marginTop: '0px' }} >
        <Card
         sx={{ width: 1100, margin: 'auto', mt: 4, p: 12, borderRadius: 5, boxShadow: 10, display: "flex", alignItems: "center", bgcolor: '#FFF2ED',
          justifyContent: "center"}}
        >
          <CardContent>
            <Typography variant="h6" align="center" sx={{fontSize: "36px", marginTop: '-70px'}} >
              오디오북 설정
            </Typography>
            <Typography align="center" marginTop={'10px'}>[◐ 듣기 편한 소리로 조절해보세요 ◑]</Typography>

            <Box sx={{ mt: 2}}>
            <Typography variant="subtitle1" sx={{ mt: 3, py: 1, fontWeight: 'bold', fontSize: '24px'}} align="center">
              목소리 선택
            </Typography>
              <Select 
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                fullWidth
                sx={{bgcolor: '#FFFFFF', textAlign: 'left'}}
              >
                {voiceList.map((voice) => (
                  <MenuItem key={voice.EL_ID} value={voice.EL_ID} disabled={voice.EL_ID === defaultVoice}>
                    {voice.VL_NAME}
                  </MenuItem>
                ))}
              </Select>
              <Button onClick={handleDeleteVoice} variant="outlined" color="error" fullWidth sx={{ mt: 2 , bgcolor: '#FFFFFF', fontWeight: 'bold', fontSize: '16px',
              '&:hover': {
            bgcolor: '#D32F2F',
            color: '#FFFFFF', // 흰색 텍스트
          },}}>
                삭제
              </Button>
            </Box>

            <Typography variant="subtitle1" sx={{ mt: 3, py: 1, fontWeight: 'bold', fontSize: '24px' }} align="center">
              목소리 배속 조절
            </Typography>

            <Card
  sx={{
    bgcolor: "#ffffff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 3, // 테두리 둥글게
    padding: 3,
    py: 2,
  }}
>
  <RadioGroup
    row
    value={speed}
    onChange={(e) => setSpeed(parseFloat(e.target.value))}
    sx={{
      justifyContent: "center",
      gap: 4,
      fontWeight: "bold",
      fontSize: "24px",
    }}
  >
    <FormControlLabel
      value={0.75}
      control={<Radio sx={{ color: "#FFA6A6", "&.Mui-checked": { color: "#FFA6A6" } }} />}
      label={<Typography sx={{ fontSize: "20px", fontWeight: "bold" }}>x 0.75</Typography>}
    />
    <FormControlLabel
      value={1.0}
      control={<Radio sx={{ color: "#FFA6A6", "&.Mui-checked": { color: "#FFA6A6" } }} />}
      label={<Typography sx={{ fontSize: "20px", fontWeight: "bold" }}>x 1.0</Typography>}
    />
    <FormControlLabel
      value={1.25}
      control={<Radio sx={{ color: "#FFA6A6", "&.Mui-checked": { color: "#FFA6A6" } }} />}
      label={<Typography sx={{ fontSize: "20px", fontWeight: "bold" }}>x 1.25</Typography>}
    />
    <FormControlLabel
      value={1.5}
      control={<Radio sx={{ color: "#FFA6A6", "&.Mui-checked": { color: "#FFA6A6" } }} />}
      label={<Typography sx={{ fontSize: "20px", fontWeight: "bold" }}>x 1.5</Typography>}
    />
    <FormControlLabel
      value={2.0}
      control={<Radio sx={{ color: "#FFA6A6", "&.Mui-checked": { color: "#FFA6A6" } }} />}
      label={<Typography sx={{ fontSize: "20px", fontWeight: "bold" }}>x 2.0</Typography>}
    />
  </RadioGroup>
</Card>


<Box sx={{ display: "flex", marginBottom: "-80px", justifyContent: "center", gap: 5, mt: 4 }}>
  {isLoading ? (
    <LoadingIndicator />
  ) : (
    <>
      <Button
        variant="contained"
        onClick={handleSaveSettings}
        sx={{
          bgcolor: '#FFA6A6',
          '&:hover': {
            bgcolor: '#FF8888',
            color: '#FFFFFF', // 흰색 텍스트
          },
        }}
      >
        <Typography variant="button" fontSize="18px" fontWeight="bold">
          저장하기
        </Typography>
      </Button>

      <Button
        variant="outlined"
        onClick={handlePreview}
        sx={{
          color: '#FFA6A6',
          bgcolor: '#ffffff',
          borderColor: '#FFA6A6',
          '&:hover': {
            bgcolor: '#FFA6A6',
            color: '#FFFFFF', // 흰색 텍스트
          },
        }}
      >
        <Typography variant="button" fontSize="18px" fontWeight="bold">
          미리듣기
        </Typography>
      </Button>

      <Button
        variant="outlined"
        color="error"
        onClick={handleStopPreview}
        sx={{
          bgcolor: '#ffffff',
          '&:hover': {
            bgcolor: '#D32F2F', // Material UI의 error 색상 hover를 유지하면서 흰색 글자
            color: '#FFFFFF',
          },
        }}
      >
        <Typography variant="button" fontSize="18px" fontWeight="bold">
          미리듣기 중지
        </Typography>
      </Button>

      <Button
        variant="outlined"
        onClick={() => navigate("/setting")}
        sx={{
          color: '#FFA6A6',
          bgcolor: '#ffffff',
          borderColor: '#FFA6A6',
          '&:hover': {
            bgcolor: '#FFA6A6',
            color: '#FFFFFF', // 흰색 텍스트
          },
        }}
      >
        <Typography variant="button" fontSize="18px" fontWeight="bold">
          취소
        </Typography>
      </Button>
    </>
  )}
</Box>


          </CardContent>
        </Card>

        {/* 삭제 확인 다이얼로그 */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
          <DialogContent>
            <DialogContentText>정말로 선택한 목소리를 삭제하시겠습니까?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={confirmDeleteVoice} color="primary">네</Button>
            <Button onClick={handleCloseDialog} color="secondary">아니오</Button>
          </DialogActions>
        </Dialog>

        <SnackbarComponent anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} />
      </Container>
    </Box>
  );
};

export default SettingAudio;
