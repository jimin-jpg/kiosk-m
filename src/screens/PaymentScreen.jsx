import React, { useState, useEffect } from 'react';
import { useKiosk } from '../context/KioskContext';
import { ProgressBar } from '../components/ProgressBar';
import { 수어영역 } from '../components/Signlanguage';

export function PaymentScreen() {
  const { 처음으로, 접근성, set화면 } = useKiosk();
  const 고대비 = 접근성?.고대비 || false;
  const 낮은화면 = 접근성?.휠체어 || false;
  const 배율맵 = { normal: 1.3, large: 1.8, xlarge: 2.3 };
  const 배율 = 배율맵[접근성?.글씨크기 || 'normal'];
  const [payStep, setPayStep] = useState('select');

  const bg = 고대비 ? '#000000' : '#E6E6E6';
  const fg = 고대비 ? '#FFEB3B' : '#000000';
  const cardBg = 고대비 ? '#000000' : '#FFFFFF';
  const cardBorder = 고대비 ? '2px solid #FFEB3B' : 'none';
  const cardShadow = 고대비 ? 'none' : '0 4px 12px rgba(0,0,0,0.1)';

  useEffect(() => {
    let timer;
    if (payStep === 'card' || payStep === 'easy') {
      timer = setTimeout(() => set화면('완료'), 5000);
    }
    return () => { if (timer) clearTimeout(timer); };
  }, [payStep, set화면]);

  const 결제수단선택 = (수단) => {
    if (수단 === '카드') setPayStep('card');
    else if (수단 === '간편결제') setPayStep('easy');
  };

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', background: 낮은화면 ? '#000000' : bg, color: fg, overflow: 'hidden' }}>

      {낮은화면 && <div style={{ flex: '0 0 50%', background: '#000000' }} />}

      <div style={{ flex: 낮은화면 ? '0 0 50%' : '1', display: 'flex', flexDirection: 'column', background: bg, overflow: 'hidden' }}>

        <div style={{ height: 낮은화면 ? '60px' : `${80 * 배율}px`, display: 'flex', alignItems: 'center', padding: '0 30px', background: 고대비 ? '#000000' : '#FFFFFF', flexShrink: 0 }}>
          <button onClick={처음으로} style={{ fontSize: 낮은화면 ? '32px' : `${44 * 배율}px`, background: 'transparent', border: 'none', cursor: 'pointer', padding: '0', color: '#000' }}>🏠</button>
        </div>

        {!낮은화면 && (
          <div style={{ padding: '30px 0', background: bg, flexShrink: 0 }}>
            <ProgressBar currentStep={3} 고대비={고대비} 배율={배율} />
          </div>
        )}

        <수어영역 안내텍스트="결제수단을 선택해주세요." />

        {payStep === 'select' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: '40px' }}>
            <h2 style={{ fontSize: 낮은화면 ? '24px' : `${36 * 배율}px`, fontWeight: 'bold', marginBottom: 낮은화면 ? '30px' : '60px', color: fg }}>결제수단을 선택해주세요.</h2>
            <div style={{ display: 'flex', gap: '30px', width: '100%', justifyContent: 'center', padding: '0 20px' }}>
              <button onClick={() => 결제수단선택('카드')} style={{ flex: 1, maxWidth: '280px', height: 낮은화면 ? '180px' : `${280 * 배율}px`, background: cardBg, borderRadius: '16px', border: cardBorder, boxShadow: cardShadow, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', cursor: 'pointer' }}>
                <div style={{ fontSize: 낮은화면 ? '50px' : `${80 * 배율}px` }}>💳</div>
                <span style={{ fontSize: 낮은화면 ? '20px' : `${28 * 배율}px`, fontWeight: 'bold', color: fg }}>카드결제, 삼성페이</span>
              </button>
              <button onClick={() => 결제수단선택('간편결제')} style={{ flex: 1, maxWidth: '280px', height: 낮은화면 ? '180px' : `${280 * 배율}px`, background: cardBg, borderRadius: '16px', border: cardBorder, boxShadow: cardShadow, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', cursor: 'pointer' }}>
                <div style={{ fontSize: 낮은화면 ? '50px' : `${80 * 배율}px` }}>📱</div>
                <span style={{ fontSize: 낮은화면 ? '20px' : `${28 * 배율}px`, fontWeight: 'bold', color: fg }}>간편결제</span>
              </button>
            </div>
          </div>
        )}

        {payStep === 'card' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: '20px' }}>
            <h2 style={{ fontSize: 낮은화면 ? '26px' : `${42 * 배율}px`, fontWeight: 'bold', marginBottom: '40px', color: fg }}>카드를 투입구에 넣어주세요.</h2>
            <div onClick={() => set화면('완료')} style={{ width: 낮은화면 ? '200px' : '320px', height: 낮은화면 ? '140px' : '220px', background: '#333333', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', boxShadow: '0 10px 20px rgba(0,0,0,0.2)', border: '2px solid #555', cursor: 'pointer' }}>
              <div style={{ display: 'flex', gap: '30px', marginTop: '40px', color: '#FFFFFF', textAlign: 'center', fontWeight: 'bold' }}>
                <div><div style={{ fontSize: '20px' }}>카드</div><div style={{ fontSize: '10px', color: '#AAAAAA' }}>CARD</div></div>
                <div style={{ fontSize: '20px', color: '#888888', fontWeight: 'normal' }}>|</div>
                <div><div style={{ fontSize: '20px' }}>명세표</div><div style={{ fontSize: '10px', color: '#AAAAAA' }}>RECEIPT</div></div>
              </div>
              <div style={{ width: '200px', height: '50px', background: '#111111', borderRadius: '10px', marginTop: '30px', position: 'relative', display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '110px', height: '90px', background: '#3b82f6', borderRadius: '8px', position: 'absolute', top: '15px', border: '1px solid #2563eb' }} />
              </div>
            </div>
            <button onClick={() => setPayStep('select')} style={{ marginTop: '50px', padding: '16px 60px', background: '#777', color: '#FFF', fontSize: `${24 * 배율}px`, fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>이전</button>
          </div>
        )}

        {payStep === 'easy' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: '20px' }}>
            <h2 style={{ fontSize: 낮은화면 ? '24px' : `${36 * 배율}px`, fontWeight: 'bold', marginBottom: '40px', textAlign: 'center', lineHeight: 1.5, color: fg }}>
              큐알코드, 바코드를 아래 위치에<br/>인식시켜 주세요.
            </h2>
            <div onClick={() => set화면('완료')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
              <div style={{ width: '220px', height: '320px', background: '#555555', borderRadius: '12px', border: '4px solid #333', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}></div>
              <div style={{ width: '220px', height: '70px', background: '#E0E0E0', borderRadius: '8px', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', border: '1px solid #CCC' }}>
                <div style={{ width: '28px', height: '28px', background: '#111', borderRadius: '50%', border: '4px solid #999' }}></div>
                <div style={{ width: '60px', height: '8px', background: '#222', borderRadius: '4px' }}></div>
              </div>
            </div>
            <button onClick={() => setPayStep('select')} style={{ marginTop: '40px', padding: '16px 60px', background: '#777', color: '#FFF', fontSize: `${24 * 배율}px`, fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>이전</button>
          </div>
        )}

        <div style={{ height: '120px', background: 고대비 ? '#000000' : '#FFFFFF', flexShrink: 0 }}></div>
      </div>
    </div>
  );
}