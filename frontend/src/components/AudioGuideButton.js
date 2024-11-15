import React, { useState, useCallback, useEffect } from 'react';
import { VolumeUp, Pause } from '@mui/icons-material';
import { IconButton, Snackbar, Button, Tooltip, useMediaQuery } from '@mui/material';
import { useSpeak, useSpeakOnFocus } from "../hooks/useSpeak";

const AudioGuideButton = ({ pageGuideText }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPermissionRequest, setShowPermissionRequest] = useState(true);
  const { speak } = useSpeak();
  const isMobile = useMediaQuery('(max-width: 600px)'); // 모바일 감지

  // 버튼 포커스 시 음성 안내
  useSpeakOnFocus('start-guide-button', '페이지 안내를 시작합니다');
  useSpeakOnFocus('no-guide-button', '페이지 안내를 받지 않습니다');

  const playAudio = useCallback(() => {
    const speech = new SpeechSynthesisUtterance(pageGuideText);
    speech.lang = 'ko-KR';

    speech.onstart = () => setIsPlaying(true);
    speech.onend = () => setIsPlaying(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
  }, [pageGuideText]);

  const stopAudio = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  }, []);

  const toggleAudio = useCallback(() => {
    if (isPlaying) {
      stopAudio();
    } else {
      playAudio();
    }
  }, [isPlaying, stopAudio, playAudio]);

  const handlePermissionGranted = () => {
    setShowPermissionRequest(false);
    playAudio();
  };

  // 키보드 단축키 처리 (Alt + P)
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.altKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        toggleAudio();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [toggleAudio]);

  return (
    <>
      <Tooltip title={`페이지 안내 ${isPlaying ? '중지' : '시작'} (단축키: Alt + P)`} arrow>
        <IconButton
          tabIndex={-1}
          sx={{
            position: 'fixed',
            left: isMobile ? 'auto' : '20px', // 모바일에서 위치 변경
            right: isMobile ? '20px' : 'auto', // 모바일에서 오른쪽에 배치
            bottom: isMobile ? '20px' : 'auto', // 모바일에서 하단에 배치
            top: isMobile ? 'auto' : '50%', // 데스크톱에서는 중앙에 배치
            transform: isMobile ? 'none' : 'translateY(-50%)',
            backgroundColor: '#FFB74D',
            color: 'white',
            padding: isMobile ? '16px' : '12px', // 모바일에서 버튼 크기 확대
            '&:hover': {
              backgroundColor: '#ff9800',
            },
            boxShadow: 3,
            zIndex: 1300,
          }}
          onClick={toggleAudio}
        >
          {isPlaying ? <Pause /> : <VolumeUp />}
        </IconButton>
      </Tooltip>

      <Snackbar
        open={showPermissionRequest}
        message="페이지 안내를 음성으로 들으시겠습니까?"
        action={
          <>
            <Button
              id="start-guide-button"
              color="primary"
              size="small"
              onClick={handlePermissionGranted}
            >
              페이지 안내를 시작합니다
            </Button>
            <Button
              id="no-guide-button"
              color="primary"
              size="small"
              onClick={() => {
                setShowPermissionRequest(false);
                speak("페이지 안내를 받지 않습니다");
              }}
            >
              페이지 안내를 받지 않습니다
            </Button>
          </>
        }
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ mt: 2 }}
      />
    </>
  );
};

export default AudioGuideButton;
