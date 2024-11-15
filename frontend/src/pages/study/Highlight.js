import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Accordion, AccordionSummary, AccordionDetails, Box, Card, CardContent, Container, IconButton, Typography, Button, Dialog, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { PlayArrow as PlayArrowIcon, Pause as PauseIcon, Edit as EditIcon, Delete as DeleteIcon} from "@mui/icons-material";
import Header from "../../components/Header";
import Breadcrumb from "../../components/BreadCrumb";
import ProfileSection from "../../components/ProfileSection";
import { fetchHighlight, fetchHighlightAudio, updateHighlightComment, deleteHighlight } from "../../api/studyAPI";
import { useNavigate } from "react-router-dom";

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `0:${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
};

const Highlight = () => {
  const { userObject } = useAuth();
  const [groupedHighlights, setGroupedHighlights] = useState({});
  const [audioStates, setAudioStates] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedComment, setEditedComment] = useState("");
  const [selectedHighlightId, setSelectedHighlightId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (userObject && userObject.USER_SEQ) {
      const userSeq = userObject.USER_SEQ;
      fetchHighlight(userSeq).then((data) => {
        const grouped = data.reduce((acc, highlight) => {
          const bookName = highlight.BOOK_NAME || "Unknown Title";
          console.log('highlight', highlight);
          
          if (!acc[bookName]) acc[bookName] = { cover: highlight.IMG_PATH, author: highlight.AUTHOR, highlights: [] };
          acc[bookName].highlights.push(highlight);
          return acc;
        }, {});

        setGroupedHighlights(grouped);
      });
    }
  }, [userObject]);

  const handlePlayPause = async (highlightId, initialDuration) => {
    try {
      const audioUrl = await fetchHighlightAudio(highlightId);
      const durationInSeconds = convertDurationToSeconds(initialDuration);

      if (!audioStates[highlightId]?.audioRef) {
        const audioRef = new Audio(audioUrl);

        setAudioStates((prevState) => ({
          ...prevState,
          [highlightId]: {
            audioRef,
            isPlaying: true,
            currentDisplayTime: durationInSeconds,
          },
        }));

        audioRef.play();

        // 1초마다 currentDisplayTime을 감소시키기 위한 setInterval 설정
        const intervalId = setInterval(() => {
          setAudioStates((prevState) => {
            const currentTime = prevState[highlightId]?.currentDisplayTime ?? 0;
            if (currentTime > 0) {
              return {
                ...prevState,
                [highlightId]: {
                  ...prevState[highlightId],
                  currentDisplayTime: currentTime - 1,
                },
              };
            } else {
              clearInterval(intervalId);
              return prevState;
            }
          });
        }, 1000);

        audioRef.onpause = () => clearInterval(intervalId);
        audioRef.onended = () => {
          clearInterval(intervalId);
          setAudioStates((prevState) => ({
            ...prevState,
            [highlightId]: {
              ...prevState[highlightId],
              isPlaying: false,
              currentDisplayTime: durationInSeconds,
            },
          }));
        };
      } else {
        const currentAudioState = audioStates[highlightId];
        if (currentAudioState.isPlaying) {
          currentAudioState.audioRef.pause();
        } else {
          currentAudioState.audioRef.play();
        }

        setAudioStates((prevState) => ({
          ...prevState,
          [highlightId]: {
            ...currentAudioState,
            isPlaying: !currentAudioState.isPlaying,
          },
        }));
      }
    } catch (error) {
      console.error("Failed to play audio:", error);
    }
  };

  const convertDurationToSeconds = (duration) => {
    const parts = duration.split(":").map(Number);
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  };

  const handleEditClick = (highlightId, currentComment) => {
    setEditingCommentId(highlightId);
    setEditedComment(currentComment);
  };

  const handleCommentChange = (e) => {
    setEditedComment(e.target.value);
  };

  const handleCommentSave = async (highlightId) => {
    if (editedComment.trim()) {
      const updated = await updateHighlightComment(highlightId, editedComment);
      if (updated) {
        // 저장 성공 시, 편집 모드 해제 및 하이라이트 목록 업데이트
        setGroupedHighlights((prev) => {
          const updatedHighlights = { ...prev };
          Object.keys(updatedHighlights).forEach((bookName) => {
            updatedHighlights[bookName].highlights = updatedHighlights[bookName].highlights.map((highlight) =>
              highlight.HL_SEQ === highlightId ? { ...highlight, HL_COMMENT: editedComment } : highlight
            );
          });
          return updatedHighlights;
        });
        setEditingCommentId(null);
      }
    } else {
      setEditingCommentId(null); // 빈 값일 경우 편집 모드 해제
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedHighlightId) {
      const deleted = await deleteHighlight(selectedHighlightId);
      if (deleted) {
        setGroupedHighlights((prev) => {
          const updatedHighlights = { ...prev };
          Object.keys(updatedHighlights).forEach((bookName) => {
            updatedHighlights[bookName].highlights = updatedHighlights[bookName].highlights.filter(
              (highlight) => highlight.HL_SEQ !== selectedHighlightId
            );
            // 책의 모든 하이라이트가 삭제되면 책 정보를 제거
            if (updatedHighlights[bookName].highlights.length === 0) {
              delete updatedHighlights[bookName];
            }
          });
          return updatedHighlights;
        });
      }
      handleCloseDialog();
    }
  };

  const handleOpenDialog = (highlightId) => {
    setSelectedHighlightId(highlightId);
    setDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedHighlightId(null);
  };

  const handleLibrary = () => {
    navigate("/library");
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
 <Card component="form"  sx={{ width: 1200, margin: 'auto', mt: 5, p: 12, mb: 10, borderRadius: 5, boxShadow: 10, alignItems: "center", bgcolor: '#EAF7FF',
          justifyContent: "center"}}>

<Box sx={{ mb: 4, marginTop: '-30px', }}>
        <Typography variant="h6" gutterBottom align="center" sx={{fontSize: "36px", mb: -1 }}>
          하이라이트
        </Typography>
            </Box>
      <CardContent>

      {Object.keys(groupedHighlights).length > 0 ? (
       
       
       <Box
       sx={{
         p: 2,
         maxWidth: 1000,
         margin: "0 auto",
         display: "flex",
         flexWrap: "wrap",
         gap: 2,
         justifyContent: "flex-start"
       }}
     >
       {Object.keys(groupedHighlights).map((bookName, index, arr) => {
         const { cover, author, highlights } = groupedHighlights[bookName];
         return (
           <Box key={bookName} sx={{ width: "calc(50% - 8px)" }}> {/* 항상 동일한 너비 설정 */}
             <Accordion sx={{ mb: 3, bgcolor: '#A5DCFF' }}>
               <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`${bookName}-content`} id={`${bookName}-header`}>
                 <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", width: "100%" }}>
                   <Box sx={{ mr: 2 }}>
                     <img
                       src={`/static/image/bookcover/${cover}`}
                       alt={bookName}
                       style={{ width: 100, height: 150, objectFit: "cover" }}
                     />
                   </Box>
                   <Box>
                     <Typography variant="h6">{bookName}</Typography>
                     <Typography variant="subtitle2" color="text.secondary">{author || "Unknown Author"}</Typography>
                   </Box>
                 </Box>
               </AccordionSummary>
               <AccordionDetails>
                 <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 5, justifyContent: "center", textAlign: "center" }}>
                   {highlights.map((highlight) => (
                     <Card key={highlight.HL_SEQ} sx={{ display: "flex", maxWidth: 500, width: "90%", margin: "0 auto", gap: 2 }}>
                       <Box sx={{ display: "flex", flexDirection: "column", flex: "1 0 auto" }}>
                         <CardContent>
                           {editingCommentId === highlight.HL_SEQ ? (
                             <input
                               type="text"
                               value={editedComment}
                               onChange={handleCommentChange}
                               onBlur={() => handleCommentSave(highlight.HL_SEQ)}
                               onKeyDown={(e) => {
                                 if (e.key === "Enter") {
                                   handleCommentSave(highlight.HL_SEQ);
                                 }
                               }}
                               autoFocus
                               style={{ fontSize: "1rem", width: "100%" }}
                             />
                           ) : (
                             <Typography
                               component="div"
                               variant="body1"
                               onClick={() => handleEditClick(highlight.HL_SEQ, highlight.HL_COMMENT || "No Comment")}
                             >
                               {highlight.HL_COMMENT || "No Comment"}
                             </Typography>
                           )}
                           <Typography variant="body2" color="text.secondary" component="div">
                             {audioStates[highlight.HL_SEQ]?.currentDisplayTime !== undefined
                               ? formatTime(audioStates[highlight.HL_SEQ].currentDisplayTime)
                               : highlight.HL_Duration}
                           </Typography>
                         </CardContent>
                         <Box sx={{ display: "flex", alignItems: "center", justifyContent: 'center', pl: 1, pb: 1, mt: -1 }}>
                           <IconButton aria-label="play/pause" onClick={() => handlePlayPause(highlight.HL_SEQ, highlight.HL_Duration)}>
                             {audioStates[highlight.HL_SEQ]?.isPlaying ? <PauseIcon sx={{ height: 32, width: 32 }} /> : <PlayArrowIcon sx={{ height: 32, width: 32 }} />}
                           </IconButton>
                           <IconButton aria-label="edit" onClick={() => handleEditClick(highlight.HL_SEQ, highlight.HL_COMMENT || "No Comment")}>
                             <EditIcon sx={{ height: 32, width: 32 }} />
                           </IconButton>
                           <IconButton aria-label="delete" onClick={() => handleOpenDialog(highlight.HL_SEQ)}>
                             <DeleteIcon sx={{ height: 32, width: 32 }} />
                           </IconButton>
                         </Box>
                       </Box>
                     </Card>
                   ))}
                 </Box>
               </AccordionDetails>
             </Accordion>
           </Box>
         );
       })}
     </Box>
     
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            아직 남겨 놓은 하이라이트가 없습니다. 하이라이트를 남기러 가보시겠어요?
          </Typography>
          <Button onClick={handleLibrary} variant="contained" sx={{
        mr: 1,
        mt: 5,
        bgcolor: '#72A8FF',
        color: '#000000',
        fontSize: '16px',
        fontWeight: 'bold',
        padding: '6px 12px', // 내부 여백 증가
        minWidth: '100px', // 최소 너비 설정
        minHeight: '30px', // 최소 높이 설정
        "&:hover": {
          bgcolor: '#FFFFFF',
          color: '#72A8FF',
          borderColor: '#72A8FF',
          border: '1px solid'
        }
      }}>
            도서마당으로 이동
          </Button>
        </Box>
      )}
    <Dialog open={dialogOpen} onClose={handleCloseDialog}>
      <DialogContent>
        <DialogContentText>정말로 이 하이라이트를 삭제하시겠습니까?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDeleteConfirm}
        sx={{color: '#72A8FF'}}
        >네</Button>
        <Button onClick={handleCloseDialog}
        sx={{color: '#999999'}}
        >아니오</Button>
      </DialogActions>
    </Dialog>
    </CardContent>
    </Card>
</Container>
    </Box>
  );
};

export default Highlight;
