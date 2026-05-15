import { useState } from 'react';
import { KioskProvider, useKiosk } from './context/KioskContext';
import { HomeScreen } from './screens/HomeScreen';
import { StoreSelectScreen } from './screens/StoreSelectScreen';
import { MenuScreen } from './screens/MenuScreen';
import { OrderConfirmScreen } from './screens/OrderConfirmScreen';
import { PaymentScreen } from './screens/PaymentScreen'; 
import { CompleteScreen } from './screens/CompleteScreen'; 
import { VolumeControl } from './components/VolumeControl'; 

function 라우터() {
  const { 화면, 접근성, 안내, 모드, set모드, 접근성업데이트 } = useKiosk();
  const [배리어프리팝업, set배리어프리팝업] = useState(false);
  const [직원호출팝업, set직원호출팝업] = useState(false);
  const [음성안내팝업, set음성안내팝업] = useState(false);
  const [음량, set음량] = useState(3);
  const [속도, set속도] = useState(1.0);

  const 배율맵 = { normal: 1, large: 1.3, xlarge: 1.6 };
  const 배율 = 배율맵[접근성?.글씨크기 || 'normal'];

  const bg = '#F5F5F5';
  const fg = '#000000';
  const yellowColor = '#CDE000';
  const brownColor = '#3E2723';
  const grayBtnColor = '#D0D0D0';

  let Screen = null;
  if (화면 === '초기') Screen = <HomeScreen />;
  else if (화면 === '매장선택') Screen = <StoreSelectScreen />;
  else if (화면 === '메뉴') Screen = <MenuScreen />;
  else if (화면 === '주문확인') Screen = <OrderConfirmScreen />;
  else if (화면 === '결제') Screen = <PaymentScreen />;
  else if (화면 === '완료') Screen = <CompleteScreen />;
  else Screen = (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100vw', height: '100vh', fontSize: '1.5em', color: 'white' }}>
      "{화면}" 화면을 찾을 수 없습니다.
    </div>
  );

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#fff', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, width: '100vw', position: 'relative', overflow: 'hidden' }}>
        {Screen}

        {/* 음량조절 버튼 - 음성안내 모드일 때만 */}
        {접근성?.음성안내 && (
          <button
            onClick={() => set음성안내팝업(true)}
            style={{
              position: 'fixed', right: '0',
              top: 접근성?.휠체어 ? '60%' : '20%',
              width: '85px', height: '120px',
              background: yellowColor,
              border: '1px solid #BBBBBB', borderRight: 'none',
              borderRadius: '20px 0 0 20px',
              boxShadow: '-3px 5px 12px rgba(0,0,0,0.2)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', zIndex: 999, padding: '0'
            }}>
            <div style={{ width: '46px', height: '46px', background: '#FFF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px', fontSize: '26px' }}>🔊</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#000', lineHeight: '1.2', textAlign: 'center' }}>음량<br/>조절</div>
          </button>
        )}

        {/* 직원호출 버튼 */}
        {화면 !== '초기' && (
          <button
            onClick={() => set직원호출팝업(true)}
            style={{
              position: 'fixed', top: 접근성?.휠체어 ? '51%' : '16px', right: '16px',
              padding: `${12 * 배율}px ${28 * 배율}px`, borderRadius: '30px',
              background: '#FF7A00', color: '#FFF',
              fontSize: `${22 * 배율}px`, fontWeight: 'bold',
              border: 'none', cursor: 'pointer', zIndex: 999,
            }}>
            직원호출
          </button>
        )}

        {/* 낮은화면일 때 배리어프리 버튼 */}
        {접근성?.휠체어 && 모드 !== '쉬운' && 화면 !== '초기' && (
          <button
            onClick={() => set배리어프리팝업(true)}
            style={{
              position: 'fixed', top: '51%', right: `calc(16px + ${22 * 배율 * 4.5}px + 80px)`,
              padding: `${12 * 배율}px ${28 * 배율}px`, borderRadius: '30px',
              background: '#FF7A00', color: '#FFF',
              fontSize: `${22 * 배율}px`, fontWeight: 'bold',
              border: 'none', cursor: 'pointer', zIndex: 999,
            }}>
            배리어프리 모드
          </button>
        )}

        {/* 일반모드 하단 왼쪽 배리어프리 버튼 */}
        {!접근성?.휠체어 && 모드 !== '쉬운' && 화면 !== '초기' && 화면 !== '매장선택' && (
          <button
            onClick={() => set배리어프리팝업(true)}
            style={{
              position: 'fixed', bottom: '20px', left: '20px',
              padding: `${14 * 배율}px ${32 * 배율}px`, borderRadius: '30px',
              background: '#FF7A00', color: '#FFF',
              fontSize: `${22 * 배율}px`, fontWeight: 'bold',
              border: 'none', cursor: 'pointer', zIndex: 999,
            }}>
            배리어프리 모드
          </button>
        )}

        {/* 음성안내 팝업 */}
        {음성안내팝업 && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 접근성?.휠체어 ? 'flex-end' : 'center', justifyContent: 'center', paddingBottom: 접근성?.휠체어 ? '5vh' : '0' }}>
            <div style={{ width: '85%', maxWidth: '360px', background: bg, borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}>
              <div style={{ background: brownColor, height: '45px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '0 16px' }}>
                <button onClick={() => set음성안내팝업(false)} style={{ background: 'transparent', border: 'none', color: '#FFF', fontSize: '32px', cursor: 'pointer', lineHeight: 1 }}>×</button>
              </div>
              <div style={{ padding: '30px 20px 20px', textAlign: 'center', color: fg }}>

                {/* 음량 조절 */}
                <h3 style={{ margin: '0 0 20px 0', fontSize: '26px', fontWeight: 'bold' }}>음량 조절</h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '40px', height: '70px' }}>
                  <button onClick={() => set음량(Math.max(1, 음량 - 1))} style={{ width: '44px', height: '44px', borderRadius: '50%', background: brownColor, color: '#FFF', fontSize: '28px', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '60px' }}>
                    {[1, 2, 3, 4, 5].map(level => (
                      <div key={level} style={{ width: '16px', height: `${24 + level * 7}px`, background: level <= 음량 ? yellowColor : '#DDDDDD', borderRadius: '8px', transition: 'background 0.2s ease' }} />
                    ))}
                  </div>
                  <button onClick={() => set음량(Math.min(5, 음량 + 1))} style={{ width: '44px', height: '44px', borderRadius: '50%', background: brownColor, color: '#FFF', fontSize: '28px', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                </div>

                {/* 속도 조절 */}
                <div style={{ background: '#FFF', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
                  <h3 style={{ margin: '0 0 12px 0', fontSize: '26px', fontWeight: 'bold' }}>속도</h3>
                  <div style={{ fontSize: '18px', color: '#666', marginBottom: '12px' }}>{속도.toFixed(1)}x</div>
                  <input
                    type="range" min="0.5" max="1.5" step="0.1"
                    value={속도}
                    onChange={e => set속도(parseFloat(e.target.value))}
                    style={{ width: '100%', marginBottom: '16px' }}
                  />
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    {[0.5, 1.0, 1.5].map(s => (
                      <button key={s} onClick={() => set속도(s)} style={{ padding: '8px 20px', borderRadius: '20px', background: 속도 === s ? brownColor : '#E0E0E0', color: 속도 === s ? '#FFF' : '#000', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
                        {s}x
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={() => set음성안내팝업(false)} style={{ background: grayBtnColor, color: '#000', border: 'none', padding: '16px 50px', borderRadius: '10px', fontSize: '22px', fontWeight: 'bold', cursor: 'pointer' }}>
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 직원호출 팝업 */}
        {직원호출팝업 && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 접근성?.휠체어 ? 'flex-end' : 'center', justifyContent: 'center', zIndex: 2000, paddingBottom: 접근성?.휠체어 ? '5vh' : '0' }}>
            <div style={{ background: '#FFF', borderRadius: '16px', width: `${500 * 배율}px`, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.4)' }}>
              <div style={{ background: '#3E2723', padding: '16px 20px', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => set직원호출팝업(false)} style={{ background: 'none', border: 'none', color: '#FFF', fontSize: `${28 * 배율}px`, cursor: 'pointer' }}>✕</button>
              </div>
              <div style={{ padding: '40px 40px 50px', textAlign: 'center' }}>
                <p style={{ fontSize: `${26 * 배율}px`, fontWeight: 'bold', marginBottom: '40px', color: '#000' }}>
                  직원을 호출하시겠습니까?
                </p>
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                  <button onClick={() => { set직원호출팝업(false); 안내('직원을 호출합니다'); }} style={{ width: `${160 * 배율}px`, height: `${80 * 배율}px`, background: '#FF7A00', border: 'none', borderRadius: '12px', fontSize: `${28 * 배율}px`, fontWeight: 'bold', cursor: 'pointer', color: '#FFF' }}>예</button>
                  <button onClick={() => set직원호출팝업(false)} style={{ width: `${160 * 배율}px`, height: `${80 * 배율}px`, background: '#D0D0D0', border: 'none', borderRadius: '12px', fontSize: `${28 * 배율}px`, fontWeight: 'bold', cursor: 'pointer' }}>아니오</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 배리어프리 팝업 */}
        {배리어프리팝업 && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 접근성?.휠체어 ? 'flex-end' : 'center', justifyContent: 'center', zIndex: 2000, paddingBottom: 접근성?.휠체어 ? '5vh' : '0' }}>
            <div style={{ background: '#FFF', borderRadius: '16px', width: `${480 * 배율}px`, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.4)' }}>
              <div style={{ background: '#3E2723', padding: '20px 24px', textAlign: 'center' }}>
                <span style={{ color: '#FFF', fontSize: `${24 * 배율}px`, fontWeight: 'bold' }}>배리어프리 모드</span>
              </div>
              <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <button
                  onClick={() => {
                    set배리어프리팝업(false);
                    set모드('쉬운');
                    접근성업데이트('음성안내', true);
                    접근성업데이트('자막', false);
                    set음성안내팝업(true);
                    안내('음성 안내 배리어프리 모드로 전환합니다');
                  }}
                  style={{ width: '100%', padding: `${20 * 배율}px`, background: '#F5F5F5', border: '1px solid #DDD', borderRadius: '12px', fontSize: `${24 * 배율}px`, fontWeight: 'bold', cursor: 'pointer', color: '#000' }}>
                  음성 안내
                </button>
                <button
                  onClick={() => {
                    set배리어프리팝업(false);
                    set모드('쉬운');
                    접근성업데이트('음성안내', false);
                    접근성업데이트('자막', true);
                    안내('수어 안내 배리어프리 모드로 전환합니다');
                  }}
                  style={{ width: '100%', padding: `${20 * 배율}px`, background: '#F5F5F5', border: '1px solid #DDD', borderRadius: '12px', fontSize: `${24 * 배율}px`, fontWeight: 'bold', cursor: 'pointer', color: '#000' }}>
                  수어 안내
                </button>
                <button
                  onClick={() => set배리어프리팝업(false)}
                  style={{ width: '100%', padding: `${14 * 배율}px`, background: '#E0E0E0', border: 'none', borderRadius: '12px', fontSize: `${20 * 배율}px`, fontWeight: 'bold', cursor: 'pointer', color: '#000' }}>
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <KioskProvider>
      <라우터 />
    </KioskProvider>
  );
}