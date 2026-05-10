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
  const { 화면, 접근성, 접근성업데이트, 안내, 모드, set모드 } = useKiosk();
  const [배리어프리팝업, set배리어프리팝업] = useState(false);

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
        <VolumeControl />

        {/* 직원호출 버튼 - 홈화면 제외 */}
        {화면 !== '초기' && (
          <button
            onClick={() => 안내('직원을 호출합니다')}
            style={{
              position: 'fixed',  top: 접근성?.휠체어 ? '52%' : '16px', right: '16px',
              padding: '12px 28px', borderRadius: '30px',
              background: '#FF7A00', color: '#FFF',
              fontSize: '22px', fontWeight: 'bold',
              border: 'none', cursor: 'pointer', zIndex: 999,
            }}>
            직원호출
          </button>
        )}

        {/* 배리어프리 버튼 - 배리어프리/쉬운모드/홈화면일 때 숨김 */}
        {!접근성?.휠체어 && 모드 !== '쉬운' && 화면 !== '초기' && (
          <button
            onClick={() => set배리어프리팝업(true)}
            style={{
              position: 'fixed', bottom: '20px', left: '20px',
              padding: '14px 32px', borderRadius: '30px',
              background: '#FF7A00', color: '#FFF',
              fontSize: '22px', fontWeight: 'bold',
              border: 'none', cursor: 'pointer', zIndex: 999,
            }}>
            배리어프리 모드
          </button>
        )}

        {배리어프리팝업 && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
            <div style={{ background: '#FFF', borderRadius: '16px', width: '500px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.4)' }}>
              <div style={{ background: '#3E2723', padding: '16px 20px', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => set배리어프리팝업(false)} style={{ background: 'none', border: 'none', color: '#FFF', fontSize: '28px', cursor: 'pointer' }}>✕</button>
              </div>
              <div style={{ padding: '40px 40px 50px', textAlign: 'center' }}>
                <p style={{ fontSize: '26px', fontWeight: 'bold', marginBottom: '40px', color: '#000' }}>
                  배리어프리 모드로<br/>이동하시겠습니까?
                </p>
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                  <button
                    onClick={() => {
                      set배리어프리팝업(false);
                      set모드('쉬운');
                      안내('배리어프리 모드로 전환합니다');
                    }}
                    style={{ width: '160px', height: '80px', background: '#CDE000', border: 'none', borderRadius: '12px', fontSize: '28px', fontWeight: 'bold', cursor: 'pointer' }}>
                    예
                  </button>
                  <button
                    onClick={() => set배리어프리팝업(false)}
                    style={{ width: '160px', height: '80px', background: '#D0D0D0', border: 'none', borderRadius: '12px', fontSize: '28px', fontWeight: 'bold', cursor: 'pointer' }}>
                    아니오
                  </button>
                </div>
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