import { useCallback, useRef, useEffect } from 'react';

// 포커스 이벤트를 처리하는 별도의 훅
export const useSpeakOnFocus = (elementId, text) => {
  const { speak } = useSpeak();

  useEffect(() => {
    const element = document.getElementById(elementId);
    if (!element) return;

    const handleFocus = () => speak(text);
    
    element.addEventListener('focus', handleFocus);
    return () => element.removeEventListener('focus', handleFocus);
  }, [elementId, text, speak]);
};

export const useSpeak = () => {
  const speechRef = useRef(null);

  const stopSpeak = useCallback(() => {
    if (speechRef.current) {
      window.speechSynthesis.cancel();
      speechRef.current = null;
    }
  }, []);

  const speak = useCallback((text) => {
    if (!text) return;

    try {
      // 이전 음성 중단
      stopSpeak();
      
      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = 'ko-KR';
      
      // 현재 음성 참조 저장
      speechRef.current = speech;

      // 음성 재생 완료 시 참조 제거
      speech.onend = () => {
        speechRef.current = null;
      };

      window.speechSynthesis.speak(speech);
    } catch (error) {
      console.error('Speech synthesis failed:', error);
    }
  }, [stopSpeak]);

  return { speak, stopSpeak };
};