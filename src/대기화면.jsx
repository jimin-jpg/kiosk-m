import { useA11y } from './useA11y';

export function 대기화면({ 시작하기 }) {
  const { 모드 } = useA11y();

  const 글씨크기맵 = { normal: '1em', large: '1.4em', xlarge: '1.8em' };
  const 배율 = 글씨크기맵[모드.글씨크기];

  return (
    <div
      onClick={시작하기}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 모드.휠체어 ? 'flex-end' : 'center',
        paddingBottom: 모드.휠체어 ? '15vh' : '0',
        background: 모드.고대비 ? '#000' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 모드.고대비 ? '#ffeb3b' : 'white',
        cursor: 'pointer',
        fontSize: 배율,
        transition: 'all 0.3s',
      }}
    >
      <div style={{ fontSize: `calc(8em * ${배율})`, marginBottom: '40px' }}>☕</div>
      <h1 style={{ fontSize: `calc(4em * ${배율})`, marginBottom: '20px' }}>
        어서오세요
      </h1>
      <p style={{ fontSize: `calc(2em * ${배율})`, marginBottom: '60px' }}>
        화면을 터치해서 시작하세요
      </p>
      <div style={{
        padding: '24px 60px',
        background: 모드.고대비 ? '#ffeb3b' : 'white',
        color: 모드.고대비 ? '#000' : '#764ba2',
        borderRadius: '20px',
        fontSize: `calc(2.4em * ${배율})`,
        fontWeight: 'bold',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
      }}>
        주문 시작하기
      </div>
    </div>
  );
}