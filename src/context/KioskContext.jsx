import { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

const KioskContext = createContext();

export function KioskProvider({ children }) {
  const [모드, set모드] = useState('일반');
  const [언어, set언어] = useState('ko');
  const [화면, set화면] = useState('초기');
  const [매장구분, set매장구분] = useState(null);
  const [장바구니, set장바구니] = useState([]);

  const [접근성, set접근성] = useState({
    글씨크기: 'normal',
    고대비: false,
    휠체어: false,
    음성안내: false,
    수어모드: false,
    자막: false,
    음량: 1.0,
    속도: 0.9,
  });

  const 마지막텍스트 = useRef('');
  const [현재자막, set현재자막] = useState('');

  // ⭐ 핵심: setter를 인라인으로 — 함수형 업데이트
  const 접근성업데이트 = useCallback((key, value) => {
    set접근성(prev => ({ ...prev, [key]: value }));
  }, []);

  const 안내 = useCallback((텍스트) => {
    마지막텍스트.current = 텍스트;
    set현재자막(텍스트);
    if (접근성.음성안내) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(텍스트);
      u.lang = 'ko-KR';
      u.rate = 접근성.속도;
      u.volume = 접근성.음량;
      window.speechSynthesis.speak(u);
    }
    setTimeout(() => set현재자막(prev => prev === 텍스트 ? '' : prev), 5000);
  }, [접근성.음성안내, 접근성.속도, 접근성.음량]);

  const 다시듣기 = () => { if (마지막텍스트.current) 안내(마지막텍스트.current); };
  const 음성중지 = () => { window.speechSynthesis.cancel(); set현재자막(''); };

  const 장바구니추가 = (item) => set장바구니(p => [...p, { ...item, uid: Date.now() }]);
  const 장바구니수정 = (uid, qty) => set장바구니(p =>
    qty <= 0 ? p.filter(i => i.uid !== uid) : p.map(i => i.uid === uid ? { ...i, qty } : i)
  );
  const 장바구니제거 = (uid) => set장바구니(p => p.filter(i => i.uid !== uid));
  const 장바구니초기화 = () => set장바구니([]);

  const [방향, set방향] = useState(
    typeof window !== 'undefined' && window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
  );
  const [전체화면, set전체화면] = useState(false);

  useEffect(() => {
    const 핸들러 = () => {
      set방향(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
      set전체화면(!!document.fullscreenElement);
    };
    window.addEventListener('resize', 핸들러);
    document.addEventListener('fullscreenchange', 핸들러);
    const 우클릭차단 = (e) => e.preventDefault();
    document.addEventListener('contextmenu', 우클릭차단);
    return () => {
      window.removeEventListener('resize', 핸들러);
      document.removeEventListener('fullscreenchange', 핸들러);
      document.removeEventListener('contextmenu', 우클릭차단);
    };
  }, []);

  const 전체화면토글 = async () => {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    } catch (e) { console.warn(e); }
  };

  const 처음으로 = () => {
    set화면('초기'); set매장구분(null); set모드('일반'); 접근성업데이트('휠체어', false); 접근성업데이트('음성안내', false); 장바구니초기화(); 음성중지();
  };

  return (
    <KioskContext.Provider value={{
      모드, set모드, 언어, set언어, 화면, set화면,
      매장구분, set매장구분, 장바구니, 장바구니추가, 장바구니수정, 장바구니제거, 장바구니초기화,
      접근성, 접근성업데이트,
      안내, 다시듣기, 음성중지, 현재자막,
      방향, 전체화면, 전체화면토글, 처음으로,
    }}>
      {children}
    </KioskContext.Provider>
  );
}

export const useKiosk = () => useContext(KioskContext);