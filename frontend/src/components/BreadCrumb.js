import React,{ useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Typography, Box, Breadcrumbs, Link } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import HeadsetIcon from '@mui/icons-material/Headset';
import PersonIcon from "@mui/icons-material/Person";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MicIcon from '@mui/icons-material/Mic';
import { IoLibrary } from "react-icons/io5";
import MailIcon from '@mui/icons-material/Mail';
import CreateIcon from '@mui/icons-material/Create';
import NotesIcon from '@mui/icons-material/Notes';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { FaPrayingHands } from "react-icons/fa";
import CommentIcon from '@mui/icons-material/Comment';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import LyricsIcon from '@mui/icons-material/Lyrics';
import FavoriteIcon from '@mui/icons-material/Favorite';
import TimelineIcon from '@mui/icons-material/Timeline';

const Breadcrumb = ({selected}) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (selected) {
      console.log(selected, "selected in useEffect");
    }
  }, [selected]);

  const pathNameMap = {
    "setting": "설정",
    "audio": "오디오북 설정",
    "user": "회원정보 수정",
    "board": "고객 게시판",
    "notice": "공지사항",
    "noticeDetail": "상세보기",
    "voice": "목소리 녹음",
    "mystudy" : "내 서재",
    "suggest" : "건의사항",
    "suggestWrite" : "건의사항 작성",
    "suggestDetail" : "상세보기",
    "library" : "도서마당",
    "book" : "책 화면",
    "mywishbook" : "희망도서 신청조회",
    'mybookreport' : '독서노트',
    'writereport' : '독서노트 작성',
    'aisummary' : 'AI 요약듣기',
    'highlight':'하이라이트',
    'history':'최근읽은기록',
    "play" : "전체듣기",
    "wishbook" : "희망도서신청",
  };

  const iconMap = {
    "setting": <SettingsIcon sx={{ verticalAlign: "middle" }} />,
    "audio": <HeadsetIcon sx={{ verticalAlign: "middle" }} />,
    "user": <PersonIcon sx={{ verticalAlign: "middle" }} />,
    "board": <SupportAgentIcon sx={{ verticalAlign: "middle" }} />,
    "notice": <NotificationsIcon sx={{ verticalAlign: "middle" }} />,
    "noticeDetail": <NotesIcon sx={{ verticalAlign: "middle" }} />,
    "voice": <MicIcon sx={{ verticalAlign: "middle" }} />,
    "mystudy": <IoLibrary style={{ verticalAlign: "middle", fontSize: "20px" }} />,
    "suggest": <MailIcon sx={{ verticalAlign: "middle" }} />,
    "suggestWrite": <CreateIcon sx={{ verticalAlign: "middle" }} />,
    "suggestDetail": <NotesIcon sx={{ verticalAlign: "middle" }} />,
    "library": <LibraryMusicIcon sx={{ verticalAlign: "middle" }} />,
    "book": <AutoStoriesIcon sx={{ verticalAlign: "middle" }} />,
    "mywishbook": <FaPrayingHands style={{ verticalAlign: "middle", fontSize: "20px" }} />,
    "mybookreport": <CommentIcon sx={{ verticalAlign: "middle" }} />,
    "writereport": <NoteAltIcon sx={{ verticalAlign: "middle" }} />,
    "aisummary": <LyricsIcon sx={{ verticalAlign: "middle" }} />,
    "highlight": <FavoriteIcon sx={{ verticalAlign: "middle" }} />,
    "history": <TimelineIcon sx={{ verticalAlign: "middle" }} />,
    "play": <LyricsIcon sx={{ verticalAlign: "middle" }} />,
    "wishbook": <FaPrayingHands style={{ verticalAlign: "middle", fontSize: "20px" }}  />,
  };

  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <Box bgcolor="rgb(237, 237, 237)" color="#000" py={1} px={2} display="flex" alignItems="center">
      <Breadcrumbs aria-label="breadcrumb" separator=">" sx={{ color: "#000" }}>
        <Link
          color="inherit"
          onClick={() => navigate("/menu")}
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            color: "#000",
            textDecoration: "none",
          }}
        >
          <HomeIcon sx={{ verticalAlign: "middle", marginLeft: '270px'}} />
          <Typography variant="body2" ml={0.5}>
            홈
          </Typography>
        </Link>

        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const displayName = pathNameMap[value] || value.toLowerCase();
          const icon = iconMap[value] || null;
          const isLast = index === pathnames.length - 1;
          const isId = !isNaN(value);

          return isLast && isId ? null : (
            isLast ? (
              <Box key={to} display="flex" alignItems="center" sx={{ color: "#000" }}>
                {icon && <Box mr={0.5}>{icon}</Box>}
                <Typography variant="body2" className="breadcrumb-text">{displayName}</Typography>
              </Box>
            ) : (
              <Link
                key={to}
                color="inherit"
                onClick={() => navigate(to,{ state: { selected: location.state?.selected } })}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  color: "#000",
                  textDecoration: "none",
                }}
              >
                {icon && <Box mr={0.5}>{icon}</Box>}
                <Typography variant="body2" className="breadcrumb-text">{displayName}</Typography>
              </Link>
            )
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default Breadcrumb;