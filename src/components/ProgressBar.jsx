import { COLORS } from './tokens';

const STEPS = ['메뉴선택', '주문확인', '결제', '완료'];

export function ProgressBar({ currentStep = 1, 고대비 = false }) {
  const primaryColor = 고대비 ? '#FFEB3B' : COLORS.primary;
  const brownColor = 고대비 ? '#FFEB3B' : '#3D2418';

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px 24px', gap: '8px',
    }}>
      {STEPS.map((step, idx) => {
        const stepNum = idx + 1;
        const isActive = stepNum === currentStep;
        const isPast = stepNum < currentStep;

        return (
          <div key={step} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: 1 }}>
              <div style={{
                width: '50px', height: '50px', borderRadius: '50%',
                background: isActive
                  ? primaryColor
                  : isPast
                    ? (고대비 ? '#FFEB3B' : brownColor)
                    : (고대비 ? '#000000' : '#FFFFFF'),
                border: `3px solid ${고대비 ? '#FFEB3B' : (isActive ? primaryColor : brownColor)}`,
                color: isActive
                  ? '#000000'
                  : isPast
                    ? (고대비 ? '#000000' : '#FFFFFF')  // 👈 고대비: 검정글씨
                    : (고대비 ? '#FFEB3B' : brownColor), // 👈 고대비: 노란글씨
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '22px', fontWeight: 'bold',
              }}>
                {stepNum}
              </div>
              <div style={{
                fontSize: '14px',
                fontWeight: isActive ? 'bold' : 'normal',
                color: 고대비
                  ? '#FFEB3B'           // 👈 고대비: 모든 라벨 노란색
                  : (isActive ? brownColor : '#777'),
              }}>
                {step}
              </div>
            </div>

            {idx < STEPS.length - 1 && (
              <div style={{
                flex: 1, height: '3px',
                background: isPast
                  ? (고대비 ? '#FFEB3B' : brownColor)
                  : (고대비 ? '#444444' : '#DDD'), // 👈 고대비: 미래 연결선 어둡게
                marginBottom: '24px', marginLeft: '-10px', marginRight: '-10px',
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}