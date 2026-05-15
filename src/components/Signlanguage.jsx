import { useKiosk } from '../context/KioskContext';

export function 수어영역({ 안내텍스트 }) {
  const { 접근성, 모드 } = useKiosk();
  const 배율맵 = { normal: 1.2, large: 1.5, xlarge: 1.7 };
  const 낮은화면배율맵 = { normal: 1.0, large: 1.3, xlarge: 1.6 };

  const 낮은화면 = 접근성?.휠체어 || false;
  const 배율 = 낮은화면
    ? 낮은화면배율맵[접근성?.글씨크기 || 'normal']
    : 배율맵[접근성?.글씨크기 || 'normal'];

  const 고대비 = 접근성?.고대비 || false;

  // 쉬운 모드이고 자막(수어안내)이 켜져있을 때만 표시
  if (모드 !== '쉬운' || !접근성?.자막) return null;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '16px',
      padding: '10px 18px',
      background: 고대비 ? '#000000' : '#f0f0f0',
      borderTop: 고대비 ? '1px solid #FFEB3B' : '1px solid #ccc',
      flexShrink: 0,
    }}>
      <div style={{ width: `${140 * 배율}px`, height: `${140 * 배율}px`, borderRadius: '12px' }}>
        <img src="/public/sign.png" alt="수어 안내"
          style={{ width: '150%', height: '150%', objectFit: 'contain' }} />
      </div>
      <div style={{
        flex: 1, fontSize: `${26 * 배율}px`, fontWeight: 'bold',
        background: 고대비 ? '#111111' : '#e0e0e0',
        padding: `${12 * 배율}px ${20 * 배율}px`,
        borderRadius: '8px', textAlign: 'center',
        color: 고대비 ? '#FFEB3B' : '#000',
      }}>
        {안내텍스트}
      </div>
    </div>
  );
}