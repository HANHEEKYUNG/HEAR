import { useEffect, useState } from 'react';

const usePlayShortcut = (shortcuts) => {
    const [keyBuffer, setKeyBuffer] = useState('');

useEffect(() => {
    const handleKeyDown = (event) => {
      // 방향키 왼쪽 또는 오른쪽이 눌리면 buffer에 저장
      if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp',' '].includes(event.key)) {
        // 이 블록 안에서 해당 키가 눌렸을 때의 동작 처리
        setKeyBuffer(event.key);
    } else if (event.key === '.' && keyBuffer) {
        const action = shortcuts[keyBuffer];
        if (action) {
          action(); // navigate 함수를 전달하여 라우팅 처리
        }
        setKeyBuffer(''); // buffer 초기화
      } else {
        setKeyBuffer(''); // 다른 키 입력 시 buffer 초기화
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
  
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [keyBuffer, shortcuts]);
  
  return null;
};

export default usePlayShortcut;


