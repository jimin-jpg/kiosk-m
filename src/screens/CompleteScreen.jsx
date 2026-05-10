import React, { useEffect } from 'react';
import { useKiosk } from '../context/KioskContext';
import { ProgressBar } from '../components/ProgressBar';
import { 수어영역 } from '../components/Signlanguage';

export function CompleteScreen() {
  const { 처음으로, 접근성, 장바구니, 장바구니제거 } = useKiosk();
  const 고대비 = 접근성?.고대비 || false;
  const 낮은화면 = 접근성?.휠체어 || false;

  const bg = 고대비 ? '#000000' : '#E6E6E6'; 
  const fg = 고대비 ? '#FFEB3B' : '#000000';
  const brownColor = 고대비 ? '#FFEB3B' : '#3E2723'; 
  const yellowColor = 고대비 ? '#FFEB3B' : '#CDE000'; 

  const handleGoHome = () => {
    장바구니.forEach(item => 장바구니제거(item.uid));
    처음으로();
  };

  useEffect(() => {
    const timer = setTimeout(() => handleGoHome(), 5000);
    return () => clearTimeout(timer);
  }, [처음으로, 장바구니, 장바구니제거]);

  const orderNumber = Math.floor(Math.random() * 99) + 1;

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', background: 낮은화면 ? '#000000' : bg, color: fg, overflow: 'hidden' }}>

      {/* 낮은화면: 상단 50% 검정 */}
      {낮은화면 && <div style={{ flex: '0 0 50%', background: '#000000' }} />}

      <div style={{ flex: 낮은화면 ? '0 0 50%' : '1', display: 'flex', flexDirection: 'column', background: bg, overflow: 'hidden' }}>

        {/* ===== 낮은화면 레이아웃 ===== */}
        {낮은화면 ? (
          <>
            <div style={{ height: '60px', display: 'flex', alignItems: 'center', padding: '0 30px', background: '#FFFFFF', flexShrink: 0 }}>
              <button onClick={handleGoHome} style={{ fontSize: '32px', background: 'transparent', border: 'none', cursor: 'pointer', padding: '0', color: '#000' }}>🏠</button>
            </div>

            <수어영역 안내텍스트="주문이 완료되었습니다." />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: '20px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 10px 0', color: fg }}>주문이 완료되었습니다.</h2>
              <p style={{ fontSize: '18px', color: 고대비 ? '#FFF' : '#555', margin: '0 0 30px 0' }}>영수증과 주문번호를 확인해주세요.</p>
              <div style={{ width: '280px', background: '#FFF', borderRadius: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px 0', border: 고대비 ? `2px solid ${yellowColor}` : 'none' }}>
                <div style={{ fontSize: '18px', color: '#666', marginBottom: '10px' }}>주문번호</div>
                <div style={{ fontSize: '60px', fontWeight: 'bold', color: brownColor }}>{orderNumber}</div>
              </div>
              <button onClick={handleGoHome} style={{ marginTop: '30px', padding: '16px 50px', fontSize: '22px', fontWeight: 'bold', background: yellowColor, color: '#000', border: 'none', borderRadius: '30px', cursor: 'pointer' }}>
                처음 화면으로
              </button>
            </div>
          </>

        ) : (

        /* ===== 일반 레이아웃 ===== */
          <>
            <div style={{ height: '80px', display: 'flex', alignItems: 'center', padding: '0 40px', background: '#FFFFFF', flexShrink: 0 }}>
              <button onClick={handleGoHome} style={{ fontSize: '44px', background: 'transparent', border: 'none', cursor: 'pointer', padding: '0', color: '#000' }}>🏠</button>
            </div>

            <div style={{ padding: '30px 0', background: bg, flexShrink: 0 }}>
              <ProgressBar currentStep={4} 고대비={고대비} />
            </div>
            <수어영역 안내텍스트="주문이 완료되었습니다." />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <h2 style={{ fontSize: '48px', fontWeight: 'bold', margin: '0 0 20px 0', color: fg }}>주문이 완료되었습니다.</h2>
              <p style={{ fontSize: '24px', color: 고대비 ? '#FFF' : '#555', margin: '0 0 50px 0' }}>영수증과 주문번호를 확인해주세요.</p>
              <div style={{ width: '400px', background: '#FFF', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '50px 0', border: 고대비 ? `2px solid ${yellowColor}` : 'none' }}>
                <div style={{ fontSize: '24px', color: '#666', marginBottom: '10px' }}>주문번호</div>
                <div style={{ fontSize: '80px', fontWeight: 'bold', color: brownColor }}>{orderNumber}</div>
              </div>
              <button onClick={handleGoHome} style={{ marginTop: '60px', padding: '20px 60px', fontSize: '28px', fontWeight: 'bold', background: yellowColor, color: '#000', border: 'none', borderRadius: '40px', cursor: 'pointer' }}>
                처음 화면으로
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}