export const initializeSSE = (setNotifications) => {
  const eventSource = new EventSource('http://localhost:5000/api/notification/stream');
  eventSource.onmessage = (event) => {
    console.log('New SSE event:', event.data);
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      event.data,
    ]);
  };

  return eventSource; // 반환하여 필요 시 외부에서 연결 해제 가능
};