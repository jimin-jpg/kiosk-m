import { useKiosk } from '../context/KioskContext';
import { COLORS } from '../components/tokens';
import { FLAGS } from '../components/Flags';
import { useState } from 'react';

const 배율맵 = { normal: 1, large: 1.3, xlarge: 1.6 };

export function HomeScreen() {
  const { set모드, set화면, 언어, set언어, 안내, 접근성, 접근성업데이트 } = useKiosk();
  const [a11yOpen, setA11yOpen] = useState(false);

  const 배율 = 배율맵[접근성.글씨크기];
  const 고대비 = 접근성.고대비;
  const 낮은화면 = 접근성.휠체어;

  const bg = 고대비 ? '#000000' : COLORS.white;
  const fg = 고대비 ? '#FFEB3B' : COLORS.black;
  const primaryColor = 고대비 ? '#FFEB3B' : COLORS.primary;

  const t = {
    normal: { ko: '일반주문', en: 'Standard', ja: '通常注文', zh: '普通订单' },
    easy: { ko: '배리어프리모드', en: 'Easy', ja: 'かんたん', zh: '简易订단' },
  };

  const 일반시작 = () => { set모드('일반'); 접근성업데이트('자막', false); set화면('매장선택'); 안내('일반 주문을 시작합니다'); };
  const 쉬운시작 = () => {
    set모드('쉬운');
    접근성업데이트('음성안내', true);
    접근성업데이트('자막', true);
    set화면('매장선택');
    setTimeout(() => 안내('배리어프리 모드입니다'), 300);
  };

  return (
    <div style={{
      width: '100vw', height: '100vh',
      display: 'flex', flexDirection: 'column',
      background: 낮은화면 ? '#000000' : bg,
      color: fg,
      overflow: 'hidden',
      boxSizing: 'border-box',
    }}>

      {/* 낮은 화면 모드: 상단 50% 검정 영역 */}
      {낮은화면 && (
        <div style={{ flex: '0 0 50%', background: '#000000', width: '100%' }} />
      )}

      {/* 실제 컨텐츠 */}
      <div style={{
        flex: 낮은화면 ? '0 0 50%' : '1',
        height: 낮은화면 ? '50vh' : 'auto',
        display: 'flex',
        flexDirection: 'column',
        background: bg,
        width: '100%',
        overflow: 'hidden',
      }}>
        <div style={{ flex: '0 0 3%' }} />

        {/* 사진 박스 */}
        <div style={{ height: 낮은화면 ? '30vh' : '62%', flexShrink: 0, overflow: 'hidden', padding: '0 0.6em', boxSizing: 'border-box' }}>          <div style={{
            width: '100%', height: '100%',
            borderRadius: '0.7em',
            background: 고대비 ? '#000000' : 'linear-gradient(135deg, #3d2818 0%, #5a3d28 50%, #8b6f47 100%)',
            border: 고대비 ? `0.25em solid ${primaryColor}` : 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}>
            <img
              src="/public/main_image.png"
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain',
                filter: 'drop-shadow(0 0.05em 0.2em rgba(0,0,0,0.5))' }}
            />
          </div>
        </div>

        {/* 일반/배리어프리 버튼 */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '1em', padding: '1em 0.6em', boxSizing: 'border-box',
        }}>
          <button onClick={일반시작} style={{
            flex: 1, height: '100%', borderRadius: '1.2em',
            background: 고대비 ? '#000000' : COLORS.white,
            color: 고대비 ? primaryColor : COLORS.black,
            fontSize: `${1.8 * 배율}em`, fontWeight: 'bold',
            border: `0.25em solid ${primaryColor}`,
            boxShadow: '0 0.1em 0.3em rgba(0,0,0,0.08)',
            cursor: 'pointer', padding: 0,
          }}>
            {t.normal[언어]}
          </button>

          <button onClick={쉬운시작} style={{
            flex: 1, height: '100%', borderRadius: '1.2em',
            background: primaryColor,
            color: 고대비 ? '#000000' : COLORS.black,
            fontSize: `${1.8 * 배율}em`, fontWeight: 'bold',
            border: 'none', boxShadow: '0 0.15em 0.4em rgba(0,0,0,0.15)',
            cursor: 'pointer', padding: 0,
          }}>
            {t.easy[언어]}
          </button>
        </div>

        {/* 갈색 하단바 */}
        <div style={{
          flex: '0 0 auto',
          background: 고대비 ? '#000000' : '#3D2418',
          borderTop: 고대비 ? `0.15em solid ${primaryColor}` : 'none',
          padding: '0.45em 0.8em',
          display: 'flex', alignItems: 'center', gap: '0.6em',
        }}>
          <button onClick={() => setA11yOpen(true)} style={{
            background: 'transparent',
            border: `0.12em solid ${고대비 ? primaryColor : COLORS.white}`,
            borderRadius: '999px', padding: '0.25em 0.8em',
            color: 고대비 ? primaryColor : COLORS.white,
            fontSize: '1.1em', minWidth: '2.5em', cursor: 'pointer',
          }} aria-label="접근성 설정">♿</button>

          <div style={{
            display: 'flex', gap: '0.25em',
            border: `0.12em solid ${고대비 ? primaryColor : COLORS.white}`,
            borderRadius: '0.45em', padding: '0.2em 0.3em',
          }}>
            {Object.entries(FLAGS).map(([code, { Component, name }]) => (
              <button key={code}
                onClick={() => { set언어(code); 안내(name); }}
                style={{
                  padding: '0.15em 0.3em', borderRadius: '0.3em',
                  background: 언어 === code
                    ? (고대비 ? 'rgba(255,235,59,0.35)' : 'rgba(209,224,0,0.35)')
                    : 'transparent',
                  border: 'none', display: 'flex', alignItems: 'center', cursor: 'pointer',
                }} aria-label={name}>
                <Component size="1.4em" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {a11yOpen && <A11yModal close={() => setA11yOpen(false)} />}
    </div>
  );
}

function A11yModal({ close }) {
  const { 접근성, 접근성업데이트, 안내 } = useKiosk();
  const 고대비 = 접근성.고대비;
  const 낮은화면 = 접근성.휠체어;

  const bg = 고대비 ? '#000000' : COLORS.white;
  const fg = 고대비 ? '#FFEB3B' : COLORS.black;
  const primaryColor = 고대비 ? '#FFEB3B' : COLORS.primary;

  const 글씨버튼스타일 = (active) => ({
    width: '140px', height: '140px', minWidth: '140px', maxWidth: '140px',
    minHeight: '140px', maxHeight: '140px', flexShrink: 0, flexGrow: 0,
    borderRadius: '16px',
    border: `5px solid ${active ? (고대비 ? primaryColor : '#A8B400') : '#9CA3AF'}`,
    background: active ? primaryColor : bg,
    color: active && 고대비 ? '#000000' : fg,
    fontWeight: 'bold', cursor: 'pointer', padding: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxSizing: 'border-box',
  });

  const 모드버튼스타일 = (active) => ({
    minWidth: '200px', height: '90px', padding: '0 24px', borderRadius: '16px',
    border: `5px solid ${active ? (고대비 ? primaryColor : '#A8B400') : '#9CA3AF'}`,
    background: active ? primaryColor : bg,
    color: active && 고대비 ? '#000000' : fg,
    fontSize: '28px', fontWeight: 'bold', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
  });

  return (
    <div onClick={close} style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex', flexDirection: 'column',
      justifyContent: 낮은화면 ? 'flex-end' : 'center',
      alignItems: 'center',
      paddingBottom: 낮은화면 ? '5vh' : '0',
      zIndex: 1000,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: bg, color: fg, padding: '40px',
        borderRadius: '24px', width: 'min(92vw, 720px)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
        border: 고대비 ? `5px solid ${primaryColor}` : 'none',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', alignItems: 'center' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 'bold', margin: 0 }}>♿ 접근성 설정</h2>
          <button onClick={close} style={{ fontSize: '36px', padding: '8px 16px', color: fg, cursor: 'pointer', background: 'transparent', border: 'none' }}>✕</button>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: 고대비 ? primaryColor : '#374151' }}>글씨 크기</div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button style={{ ...글씨버튼스타일(접근성.글씨크기 === 'normal'), fontSize: '36px' }}
              onClick={() => { 접근성업데이트('글씨크기', 'normal'); 안내('기본 글씨'); }}>가</button>
            <button style={{ ...글씨버튼스타일(접근성.글씨크기 === 'large'), fontSize: '52px' }}
              onClick={() => { 접근성업데이트('글씨크기', 'large'); 안내('큰 글씨'); }}>가</button>
            <button style={{ ...글씨버튼스타일(접근성.글씨크기 === 'xlarge'), fontSize: '70px' }}
              onClick={() => { 접근성업데이트('글씨크기', 'xlarge'); 안내('매우 큰 글씨'); }}>가</button>
          </div>
        </div>

        <div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: 고대비 ? primaryColor : '#374151' }}>화면 모드</div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button style={모드버튼스타일(접근성.고대비)}
              onClick={() => { 접근성업데이트('고대비', !접근성.고대비); 안내('고대비 모드'); }}>
              🌓 고대비
            </button>
            <button style={모드버튼스타일(접근성.휠체어)}
              onClick={() => { 접근성업데이트('휠체어', !접근성.휠체어); 안내('낮은 화면 모드'); }}>
              ♿ 낮은 화면
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}