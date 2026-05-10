import { useKiosk } from '../context/KioskContext';

export function 수어영역({ 안내텍스트 }) {
  const { 접근성, 모드 } = useKiosk();

  // 배리어프리 모드 또는 쉬운주문 모드일 때 표시
  if (모드 !== '쉬운') return null;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '16px',
      padding: '10px 18px', background: '#f0f0f0',
      borderTop: '1px solid #ccc', flexShrink: 0,
    }}>
      <div style={{
        width: '140px', height: '140px', borderRadius: '12px'
      }}>
        <img src="/public/sign.png" alt="수어 안내"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{
        flex: 1, fontSize: '26px', fontWeight: 'bold',
        background: '#e0e0e0', padding: '12px 20px',
        borderRadius: '8px', textAlign: 'center', color: '#000',
      }}>
        {안내텍스트}
      </div>
    </div>
  );
}