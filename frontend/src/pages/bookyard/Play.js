import React, { useEffect, useState, useRef, useMemo } from "react";
import Breadcrumb from "../../components/BreadCrumb";
import Header from "../../components/Header";
import {
  Box,
  Button,
  Grid,
  Typography,
  IconButton,
  Card,
  CardContent,
  Slider,
  Alert,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { useNavigate, useLocation } from "react-router-dom";
import {
  fetchLibrary,
  fetchLibrarySave,
  highlight,
} from "../../api/libraryAPI";
import { useAuth } from "../../context/AuthContext";
import useMenuShortcut from "../../hooks/useMenuShortcut";
import usePlayShortcut from "../../hooks/usePlayShortcut";
import { ImportContacts, Article, Create, Share } from "@mui/icons-material";

const Play = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const lastPosition = location.state?.lastPosition || 0; // 전달받은 마지막 위치
  const [book, setBook] = useState([]);
  const [test, setTest] = useState("");
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [clickCount, setClickCount] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const { userObject } = useAuth();
  const [startPoint, setStartPoint] = useState();
  const [alertMessage, setAlertMessage] = useState();
  const audioRef = useRef(null);
  const histDiv = 2;
  const [isHighlighting, setIsHighlighting] = useState(false);


  const menuItems = useMemo(
    () => [
      { label: "1 시", path: "/library?category=200" },
      { label: "2 소설", path: "/library?category=100" },
      { label: "3 수필", path: "/library?category=300" },
      { label: "4 공유세상", path: "/library?category=400" },
    ],
    []
  );

  // 단축키 설정, 각 숫자에 대응하는 메뉴의 인덱스에 따라 이동
  useMenuShortcut({
    1: () => navigate(menuItems[0].path),
    2: () => navigate(menuItems[1].path),
    3: () => navigate(menuItems[2].path),
    4: () => navigate(menuItems[3].path),
  });

  usePlayShortcut({
    ArrowLeft: () => ArrowLeft(),
    ArrowRight: () => ArrowRight(),
    ArrowUp: () => handleClick(),
    ArrowDown: () => handleTime(),
    " ": () => togglePlayPause(),
  });

  const ArrowLeft = () => {
    audioRef.current.currentTime = Math.max(
      0,
      audioRef.current.currentTime - 5
    );
    setCurrentTime(audioRef.current.currentTime);
  };

  const ArrowRight = () => {
    audioRef.current.currentTime = Math.max(
      0,
      audioRef.current.currentTime + 5
    );
    setCurrentTime(audioRef.current.currentTime);
  };

  useEffect(() => {
    let intervalId;
    const audioElement = audioRef.current; // audioRef.current를 내부 변수에 저장
    let isAudioPlaying = false; // 재생 상태 확인 변수

    // 초기 재생 위치 설정
    const handleLoadedMetadata = () => {
      audioElement.currentTime = lastPosition;
    };

    const handlePlayPause = () => {
      if (audioElement) {
        if (audioElement.currentTime !== audioElement.duration) {
          if (!isAudioPlaying) {
            // 오디오 재생 중일 때만 저장을 진행
            intervalId = setInterval(async () => {
              console.log(
                audioElement.currentTime,
                "현재시간 : duration",
                audioElement.duration
              );

              const bookSeq = location.state.selected;
              const userSeq = userObject?.USER_SEQ;
              const time = audioElement ? audioElement.currentTime : 0;

              if (userSeq && bookSeq) {
                try {
                  const response = await fetchLibrarySave(
                    userSeq,
                    bookSeq,
                    histDiv,
                    time
                  );
                  if (response) {
                    console.log(response);
                  }
                } catch (error) {
                  console.error(
                    "사용자 책 데이터를 불러오는 중 오류가 발생했습니다.",
                    error
                  );
                }
              }
            }, 5000);
            isAudioPlaying = true; // 재생 중 상태로 설정
          }
        }
      }
    };

    if (audioElement) {
      // 초기 로드 시 마지막 재생 위치 설정
      audioElement.addEventListener("loadedmetadata", handleLoadedMetadata);
      audioElement.addEventListener("playing", handlePlayPause);
      audioElement.addEventListener("pause", () => {
        clearInterval(intervalId);
        isAudioPlaying = false; // 일시정지 시 상태 변경
      });
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener("playing", handlePlayPause);
        audioElement.removeEventListener("pause", handlePlayPause);
      }
      clearInterval(intervalId); // 클린업 시 interval 정리
    };
  }, [
    location.search,
    userObject?.USER_SEQ,
    lastPosition,
    location.state.selected,
  ]);

  useEffect(() => {
    // 책 정보 불러오기
    const fetchBookData = async () => {
      const bookSeq = location.state.selected;
      const elId = userObject?.EL_ID; // userObject에서 EL_ID를 가져옴
      const isSummary = false; // 요약 요청 여부 설정 (true로 설정 시 요약 요청)

      if (bookSeq) {
        try {
          const response = await fetchLibrary(bookSeq, elId, isSummary);
          const bookData = response.find((b) => b.BOOK_SEQ === Number(bookSeq));

          if (bookData) {
            setBook(bookData);
            setTest(bookData.test);
          } else {
            console.error("해당 책을 찾을 수 없습니다.");
          }
        } catch (error) {
          console.error("책 데이터를 불러오는 중 오류가 발생했습니다.", error);
        }
      }
    };
    fetchBookData();
  }, [location.search, userObject?.EL_ID, location.state.selected]);

  useEffect(() => {
    const audioElement = audioRef.current;

    if (test && audioElement) {
      audioElement.src = test;
      console.log(test, "오디오 경로가 설정되었습니다.");

      const handleAudioLoaded = () => {
        audioElement.play().catch((error) => {
          console.error("오디오 자동 재생 실패:", error);
        });
      };

      const handleLoadedMetadata = () => {
        if (audioElement) {
          setDuration(audioElement.duration || 0);
        }
      };

      // 100ms마다 currentTime을 업데이트하는 setInterval
      const intervalId = setInterval(() => {
        if (audioElement && !audioElement.paused) {
          setCurrentTime(audioElement.currentTime);
        }
      }, 100);

      audioElement.addEventListener("loadedmetadata", handleLoadedMetadata);
      audioElement.addEventListener("loadeddata", handleAudioLoaded);

      return () => {
        audioElement.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata
        );
        audioElement.removeEventListener("loadeddata", handleAudioLoaded);
        clearInterval(intervalId); // 컴포넌트 언마운트 시 interval 해제
      };
    }
  }, [test]);

  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      if (audio.currentTime === audio.duration) {
        // 오디오가 끝난 경우
        setCurrentTime(formatTime(0));
        setIsPlaying(false);
        console.log("멈춤");
      }
    };

    // 'timeupdate' 이벤트 리스너 추가
    audio.addEventListener("timeupdate", handleTimeUpdate);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [currentTime]);

  const handleTime = () => {
    if (audioRef.current) {
      const time = audioRef.current.currentTime;
      const percentage = Math.floor((time / duration) * 100);
      console.log(`전체 내용의 ${percentage}퍼센트를 들으셨습니다.`);
    }
  };

  const handleVolumeChange = (newValue) => {
    if (audioRef.current) {
      setVolume(newValue);
      audioRef.current.volume = newValue;
    }
  };

  const handleSliderChange = (newValue) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newValue;
      setCurrentTime(newValue);
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
      return "00:00:00";
    }

    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  const handleClick = async () => {
    if (clickCount) {
      setStartPoint(currentTime); // 홀수일 경우 startPoint 설정
      setClickCount(false);
      console.log(clickCount, "시작");
    } else {
      setClickCount(true);
      console.log(clickCount, "끝");

      const bookSeq = book.BOOK_SEQ;
      const userSeq = userObject.USER_SEQ;

      try {
        const response = await highlight(
          startPoint,
          currentTime,
          userSeq,
          bookSeq,
          test
        );
        setAlertMessage("하이라이트 저장을 완료하였습니다.");
        setTimeout(() => {
          setAlertMessage(null);
        }, 1000);
        console.log(response);
      } catch (error) {
        console.error("입력 중 오류가 발생했습니다.", error);
      }
    }
  };

  const cardStyle = {
    width: 200,
    height: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    bgcolor: "#DCEEDC",
    borderRadius: 10,
    boxShadow: 3,
    cursor: "pointer",
    transition: "0.3s",
    "&:hover": {
      boxShadow: 6,
    },
  };

  const handleHighlightClick = () => {
    setIsHighlighting((prev) => !prev); // 하이라이트 중 상태를 토글
    handleClick(); // 기존 하이라이트 기능
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

      {/* 카테고리 카드 */}
      <Box
        bgcolor="#f7f7f7"
        py={4}
        display="flex"
        justifyContent="center"
        gap={10}
      >
        <Card
          sx={cardStyle}
          onClick={() => navigate(`/library`, { state: { category: "200" } })}
        >
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <ImportContacts
                fontSize="large"
                sx={{ marginTop: "5px", color: "#246624" }}
              />
              <Typography variant="h6" sx={{ marginTop: "10px" }}>
                시
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card
          sx={cardStyle}
          onClick={() => navigate(`/library`, { state: { category: "100" } })}
        >
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Article
                fontSize="large"
                sx={{ marginTop: "5px", color: "#246624" }}
              />
              <Typography variant="h6" sx={{ marginTop: "10px" }}>
                소설
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card
          sx={cardStyle}
          onClick={() => navigate(`/library`, { state: { category: "300" } })}
        >
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Create
                fontSize="large"
                sx={{ marginTop: "5px", color: "#246624" }}
              />
              <Typography variant="h6" sx={{ marginTop: "10px" }}>
                수필
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card
          sx={cardStyle}
          onClick={() => navigate(`/library`, { state: { category: "400" } })}
        >
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Share
                fontSize="large"
                sx={{ marginTop: "5px", color: "#246624" }}
              />
              <Typography variant="h6" sx={{ marginTop: "10px" }}>
                공유세상
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* 재생 컨텐츠 */}

      <Card
        sx={{
          width: "75%",
          margin: "auto",
          bgcolor: '#F8FBF8',
          mt: 4,
          p: 12,
          borderRadius: 4,
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontSize: "24px", flexGrow: 1, textAlign: "center" }}
        >
          전 체 재 생
        </Typography>
        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
          [ {book.BOOK_NAME} ]
        </Typography>

        {/* Upper Section */}
        <Box sx={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
          {/* 이미지 자리 */}
          <Box>
            <img
              src={`/static/image/bookcover/${book.IMG_PATH}`}
              alt={"책 커버 사진 없음"}
              style={{ width: 175, height: 250, objectFit: "cover" }}
            />
          </Box>

          <Box sx={{ width: "100%" }}>
            <audio
              ref={audioRef}
              controls
              style={{ width: "100%", display: "none" }}
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                marginY: 2,
              }}
            >
              <IconButton onClick={togglePlayPause} sx={{ color: "#6AAA6A" }}>
                {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
              </IconButton>
              <Slider
                value={isNaN(currentTime) ? 0 : currentTime}
                min={0}
                max={isNaN(duration) ? 0 : duration}
                step={1}
                onChange={(e, newValue) => handleSliderChange(newValue)}
                sx={{ flexGrow: 1, color: "#6AAA6A" }}
              />
              <Typography variant="h6" fontSize="16px">
                {formatTime(currentTime)} / {formatTime(duration)}
                {""}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center", // 볼륨 조절 바와 아이콘을 중앙에 배치
                marginRight: "150px",
                gap: 1,
                mt: 2,
              }}
            >
              <VolumeUpIcon sx={{ color: "#6AAA6A" }} />
              <Slider
                value={volume}
                min={0}
                max={1}
                step={0.01}
                onChange={(event, newValue) => handleVolumeChange(newValue)}
                sx={{ width: 150, color: "#6AAA6A", alignSelf: "center" }} // 슬라이더의 너비를 줄여 중앙에 정렬되는 효과 강화
              />
            </Box>
          </Box>
        </Box>

        {/* Lower Section */}
        <Grid container spacing={4} sx={{ justifyContent: "space-evenly" }}>
          <Grid item xs={2} sx={{ padding: 1 }}>
            <Button
              fullWidth
              variant="outlined"
              sx={{
                padding: "8px",
                fontSize: 20,
                width: 200,
                height: 150,
                fontWeight: "bold",
                borderRadius: 8,
                color: "#246624",
                borderColor: "#246624",
                backgroundColor: "#DCEEDC",
                lineHeight: 1.2,
                "&:hover": {
                  backgroundColor: "#246624",
                  color: "#FFFFFF",
                  "& .hover-text": {
                    // 내부 Box 요소에 hover 효과 적용
                    color: "#FFFFFF",
                  },
                },
                display: "flex",
                flexDirection: "column",
                alignItems: "center", // 버튼 텍스트 가운데 정렬
                justifyContent: "center",
              }}
              onClick={togglePlayPause}
            >
              <Box
                component="span"
                className="hover-text"
                sx={{ color: "#000000", textAlign: "center" }} // 윗단 텍스트 검은색
              >
                일시정지
              </Box>
              <Box
                component="span"
                className="hover-text"
                sx={{ color: "#246624", textAlign: "center", mb: -0.5 }} // 아랫단 텍스트 기존 색상
              >
                <br /> [ SPACE + . ]
              </Box>
            </Button>
          </Grid>

          <Grid item xs={2} sx={{ padding: 1 }}>
            <Button
              fullWidth
              variant="outlined"
              sx={{
                padding: "8px",
                fontSize: 20,
                width: 200,
                height: 150,
                fontWeight: "bold",
                borderRadius: 8,
                color: "#246624",
                borderColor: "#246624",
                backgroundColor: "#DCEEDC",
                lineHeight: 1.2,
                "&:hover": {
                  backgroundColor: "#246624",
                  color: "#FFFFFF",
                  "& .hover-text": {
                    // hover 시 내부 텍스트를 흰색으로
                    color: "#FFFFFF",
                  },
                },
                display: "flex",
                flexDirection: "column",
                alignItems: "center", // 가운데 정렬
                justifyContent: "center",
              }}
              onClick={() => {
                audioRef.current.currentTime = Math.max(
                  0,
                  audioRef.current.currentTime - 5
                );
                setCurrentTime(audioRef.current.currentTime);
              }}
            >
              <Box
                component="span"
                className="hover-text" // hover 적용될 클래스
                sx={{ color: "#000000", textAlign: "center" }}
              >
                5초 뒤로
              </Box>
              <Box
                component="span"
                className="hover-text" // hover 적용될 클래스
                sx={{ color: "#246624", textAlign: "center", mb: -0.5 }}
              >
                <br /> [ 방향키 왼쪽 + . ]
              </Box>
            </Button>
          </Grid>

          <Grid item xs={2} sx={{ padding: 1 }}>
            <Button
              fullWidth
              variant="outlined"
              sx={{
                padding: "8px",
                fontSize: 20,
                width: 200,
                height: 150,
                fontWeight: "bold",
                borderRadius: 8,
                color: "#246624",
                borderColor: "#246624",
                backgroundColor: "#DCEEDC",
                lineHeight: 1.2,
                "&:hover": {
                  backgroundColor: "#246624",
                  color: "#FFFFFF",
                  "& .hover-text": {
                    // 내부 Box 요소에 hover 효과 적용
                    color: "#FFFFFF",
                  },
                },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => {
                audioRef.current.currentTime = Math.max(
                  0,
                  audioRef.current.currentTime + 5
                );
                setCurrentTime(audioRef.current.currentTime);
              }}
            >
              <Box
                component="span"
                className="hover-text"
                sx={{
                  color: "#000000",
                  textAlign: "center",
                }}
              >
                5초 앞으로
              </Box>
              <Box
                component="span"
                className="hover-text"
                sx={{
                  color: "#246624",
                  textAlign: "center",
                  mb: -0.5,
                }}
              >
                <br /> [ 방향키 오른쪽 + . ]
              </Box>
            </Button>
          </Grid>

          <Grid item xs={2} sx={{ padding: 1 }}>
  <Button
    fullWidth
    variant="outlined"
    sx={{
      padding: "8px",
      fontSize: 20,
      width: 200,
      height: 150,
      fontWeight: "bold",
      borderRadius: 8,
      color: isHighlighting ? "#FFFFFF" : "#246624", // 녹음 중일 때 색상 변경
      borderColor: "#246624",
      backgroundColor: isHighlighting ? "#246624" : "#DCEEDC", // 녹음 중일 때 배경 변경
      lineHeight: 1.2,
      "&:hover": {
        backgroundColor: "#246624",
        color: "#FFFFFF",
        "& .hover-text": {
          color: "#FFFFFF",
        },
      },
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}
    onClick={handleHighlightClick} // 상태 토글 핸들러로 변경
  >
    <Box
      component="span"
      className="hover-text"
      sx={{ color: isHighlighting ? "#FFFFFF" : "#000000", textAlign: "center" }}
    >
      {isHighlighting ?
      <Box>
      <Box>하이라이트</Box>
      <Box> <br/> [ 녹음 중 ]</Box>
      </Box> : "하이라이트"}
    </Box>
    <Box
      component="span"
      className="hover-text"
      sx={{ color: isHighlighting ? "#FFFFFF" : "#246624", textAlign: "center", mb: -0.5 }}
    >
      {isHighlighting ? "" : <Box
                component="span"
                className="hover-text" // hover 시 적용될 클래스
                sx={{ color: "#246624", textAlign: "center", mt: 0.5 }}
              >
                <br /> [ 방향키 위쪽 + . ]
              </Box>}
    </Box>
  </Button>
</Grid>


          <Grid item xs={2} sx={{ padding: 1 }}>
            <Button
              fullWidth
              variant="outlined"
              sx={{
                padding: "8px",
                fontSize: 20,
                width: 200,
                height: 150,
                fontWeight: "bold",
                borderRadius: 8,
                color: "#246624",
                borderColor: "#246624",
                backgroundColor: "#DCEEDC",
                lineHeight: 1.2,
                "&:hover": {
                  backgroundColor: "#246624",
                  color: "#FFFFFF",
                  "& .hover-text": {
                    // hover 시 모든 텍스트를 흰색으로
                    color: "#FFFFFF",
                  },
                },
                display: "flex",
                flexDirection: "column",
                alignItems: "center", // 가운데 정렬
                justifyContent: "center",
              }}
              onClick={handleTime}
            >
              <Box
                component="span"
                className="hover-text" // hover 시 적용될 클래스
                sx={{ color: "#000000", textAlign: "center" }}
              >
                현재 재생시간
              </Box>
              <Box
                component="span"
                className="hover-text" // hover 시 적용될 클래스
                sx={{ color: "#246624", textAlign: "center", mb: -0.5 }}
              >
                <br /> [ 방향키 아래쪽 + . ]
              </Box>
            </Button>
          </Grid>
        </Grid>
      </Card>
      <Box sx={{ position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", width: "90%", maxWidth: "600px", zIndex: 999 }}>
        {alertMessage && (
          <Alert variant="filled" severity="success" sx={{ mb: 4 }}>
            {alertMessage}
          </Alert>
        )}
      </Box>
    </Box>
  );
};

export default Play;
