import React, { useState, useEffect } from 'react';
import { useKiosk } from '../context/KioskContext';

const PAID_OPTIONS = [
  { name: '샷 추가', price: 500 },
  { name: '우유 추가', price: 500 },
  { name: '헤이즐넛 시럽 추가', price: 500 },
  { name: '바닐라 시럽 추가', price: 500 },
  { name: '카라멜 시럽 추가', price: 500 },
  { name: '펄 추가', price: 1000 },
  { name: '휘핑 추가', price: 1000 },
];

const FREE_OPTIONS = ['연하게', '덜달게', '얼음적게', '얼음많이'];

export function OptionModal({ menu, onClose, onAddToCart, 고대비, initialCartItem }) {
  const { 접근성 } = useKiosk();
  const 낮은화면 = 접근성?.휠체어 || false;

  const [view, setView] = useState('main');
  const [temp, setTemp] = useState('ICE');
  const [freeOpts, setFreeOpts] = useState([]);
  const [paidOpts, setPaidOpts] = useState({});

  const yellowColor = 고대비 ? '#FFEB3B' : '#CDE000';
  const brownColor = 고대비 ? '#FFEB3B' : '#3E2723';
  const bg = 고대비 ? '#000000' : '#FFFFFF';
  const fg = 고대비 ? '#FFEB3B' : '#000000';
  const modalBg = 고대비 ? '#000000' : '#E6E6E6';
  const borderStyle = 고대비 ? '2px solid #FFEB3B' : 'none';

  useEffect(() => {
    if (initialCartItem && Array.isArray(initialCartItem.options)) {
      if (initialCartItem.options.includes('따뜻한(HOT)')) setTemp('HOT');
      else setTemp('ICE');

      const initialFree = initialCartItem.options.filter(o => FREE_OPTIONS.includes(o));
      setFreeOpts(initialFree);

      const initialPaid = {};
      initialCartItem.options.forEach(opt => {
        const match = opt.match(/(.*?)\((\d+)\)/);
        if (match && PAID_OPTIONS.find(p => p.name === match[1])) {
          initialPaid[match[1]] = parseInt(match[2], 10);
        }
      });
      setPaidOpts(initialPaid);
    }
  }, [initialCartItem]);

  const toggleFreeOpt = (opt) => {
    let nextOpts = [...freeOpts];
    if (nextOpts.includes(opt)) {
      nextOpts = nextOpts.filter(o => o !== opt);
    } else {
      if (opt === '연하게') nextOpts = nextOpts.filter(o => o !== '덜달게');
      if (opt === '덜달게') nextOpts = nextOpts.filter(o => o !== '연하게');
      if (opt === '얼음적게') nextOpts = nextOpts.filter(o => o !== '얼음많이');
      if (opt === '얼음많이') nextOpts = nextOpts.filter(o => o !== '얼음적게');
      nextOpts.push(opt);
    }
    setFreeOpts(nextOpts);
  };

  const updatePaidOpt = (name, delta) => {
    setPaidOpts(prev => {
      const current = prev[name] || 0;
      const next = current + delta;
      if (next < 0) return prev;
      return { ...prev, [name]: next };
    });
  };

  const handleAddToCart = () => {
    try {
      const optionsArray = [
        temp === 'ICE' ? '차가운(ICE)' : '따뜻한(HOT)',
        ...freeOpts
      ];
      let optionPriceTotal = 0;
      Object.entries(paidOpts || {}).forEach(([name, qty]) => {
        if (qty > 0) {
          optionsArray.push(`${name}(${qty})`);
          const optData = PAID_OPTIONS.find(o => o.name === name);
          if (optData) optionPriceTotal += optData.price * qty;
        }
      });
      onAddToCart({
        uid: initialCartItem ? initialCartItem.uid : undefined,
        menuId: menu.id,
        qty: initialCartItem ? initialCartItem.qty : 1,
        options: optionsArray,
        optionPrice: optionPriceTotal
      });
    } catch (e) {
      console.error("옵션 추가 중 오류 발생:", e);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 낮은화면 ? 'flex-end' : 'center', // 👈 낮은화면이면 아래로
      justifyContent: 'center',
      paddingBottom: 낮은화면 ? '10px' : '0', // 👈 살짝 여백
      zIndex: 1000
    }}>
      <div style={{
        width: '85%', maxWidth: '600px',
        background: modalBg,
        border: borderStyle,
        borderRadius: '12px', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', maxHeight: '90vh'
      }}>
        <div style={{ background: 고대비 ? '#111111' : brownColor, padding: '15px 20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 고대비 ? '#FFEB3B' : '#FFF', fontSize: '28px', cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', background: bg }}>
          {view === 'main' ? (
            <div style={{ padding: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                <div style={{ width: '120px', height: '120px', border: `1px solid ${고대비 ? '#FFEB3B' : '#CCC'}`, borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', background: 고대비 ? '#111' : '#FFF' }}>
                  <img src={menu.image} alt={menu.name} style={{ maxWidth: '80%', maxHeight: '80%' }} />
                  <div style={{ position: 'absolute', top: 5, right: 5, fontSize: '24px' }}>{temp === 'ICE' ? '❄️' : '♨️'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '10px', color: fg }}>{menu.name}</div>
                  <div style={{ display: 'flex', gap: '15px', color: 고대비 ? '#FFEB3B' : '#555', fontSize: '14px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}><span style={{ fontSize: '24px' }}>🥛</span> 우유</div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}><span style={{ fontSize: '24px' }}>☕</span> 커피</div>
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', color: fg }}>옵션</div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
                <button onClick={() => setTemp('HOT')} style={{
                  flex: 1, height: '100px', borderRadius: '12px', fontSize: '20px', fontWeight: 'bold',
                  background: temp === 'HOT' ? yellowColor : (고대비 ? '#111' : '#FFF'),
                  color: temp === 'HOT' && 고대비 ? '#000' : fg,
                  border: temp === 'HOT' ? `2px solid ${brownColor}` : `1px solid ${고대비 ? '#555' : '#CCC'}`,
                  cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}>
                  <span style={{ fontSize: '32px' }}>☕</span> 뜨거운(HOT)
                </button>
                <button onClick={() => setTemp('ICE')} style={{
                  flex: 1, height: '100px', borderRadius: '12px', fontSize: '20px', fontWeight: 'bold',
                  background: temp === 'ICE' ? yellowColor : (고대비 ? '#111' : '#FFF'),
                  color: temp === 'ICE' && 고대비 ? '#000' : fg,
                  border: temp === 'ICE' ? `2px solid ${brownColor}` : `1px solid ${고대비 ? '#555' : '#CCC'}`,
                  cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}>
                  <span style={{ fontSize: '32px' }}>🧊</span> 차가운(ICE)
                </button>
              </div>

              <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', color: fg }}>무료옵션</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '30px' }}>
                {FREE_OPTIONS.map(opt => {
                  const active = freeOpts.includes(opt);
                  return (
                    <button key={opt} onClick={() => toggleFreeOpt(opt)} style={{
                      height: '50px', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold',
                      background: active ? yellowColor : (고대비 ? '#111' : '#FFF'),
                      color: active && 고대비 ? '#000' : fg,
                      border: active ? `2px solid ${brownColor}` : `1px solid ${고대비 ? '#555' : '#CCC'}`,
                      cursor: 'pointer'
                    }}>
                      {opt}
                    </button>
                  );
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: fg }}>유료옵션</div>
                <button onClick={() => setView('paid')} style={{
                  padding: '10px 30px', borderRadius: '8px',
                  border: `1px solid ${고대비 ? '#FFEB3B' : '#CCC'}`,
                  background: 고대비 ? '#111' : '#FFF',
                  color: fg, fontSize: '18px', fontWeight: 'bold', cursor: 'pointer'
                }}>추가 〉</button>
              </div>
            </div>
          ) : (
            <div style={{ padding: '30px' }}>
              <div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', marginBottom: '30px', color: fg }}>{menu.name} {temp === 'ICE' ? '❄️' : '♨️'}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {PAID_OPTIONS.map(opt => {
                  const qty = paidOpts[opt.name] || 0;
                  return (
                    <div key={opt.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '20px', color: fg }}>
                      <div>+ {opt.name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <span style={{ fontWeight: 'bold' }}>₩ {opt.price.toLocaleString()}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <button onClick={() => updatePaidOpt(opt.name, -1)} style={{ width: '32px', height: '32px', borderRadius: '50%', background: 고대비 ? '#FFEB3B' : brownColor, color: 고대비 ? '#000' : '#FFF', border: 'none', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer' }}>−</button>
                          <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: 'bold', color: fg }}>{qty}</span>
                          <button onClick={() => updatePaidOpt(opt.name, 1)} style={{ width: '32px', height: '32px', borderRadius: '50%', background: 고대비 ? '#FFEB3B' : brownColor, color: 고대비 ? '#000' : '#FFF', border: 'none', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer' }}>+</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: '40px', textAlign: 'center' }}>
                <button onClick={() => setView('main')} style={{
                  padding: '12px 40px', borderRadius: '30px',
                  border: `1px solid ${고대비 ? '#FFEB3B' : '#CCC'}`,
                  background: 고대비 ? '#111' : '#FFF',
                  color: fg, fontSize: '18px', fontWeight: 'bold', cursor: 'pointer'
                }}>〈 뒤로 가기</button>
              </div>
            </div>
          )}
        </div>

        <div style={{
          background: modalBg, padding: '20px',
          display: 'flex', justifyContent: 'center', gap: '15px',
          borderTop: 고대비 ? '1px solid #FFEB3B' : 'none'
        }}>
          <button onClick={onClose} style={{
            padding: '15px 40px', borderRadius: '8px', border: 'none',
            background: 고대비 ? '#333' : '#C4C4C4',
            color: 고대비 ? '#FFEB3B' : '#000',
            fontSize: '22px', fontWeight: 'bold', cursor: 'pointer'
          }}>취소</button>
          <button onClick={handleAddToCart} style={{
            padding: '15px 40px', borderRadius: '8px', border: 'none',
            background: yellowColor, color: '#000',
            fontSize: '22px', fontWeight: 'bold', cursor: 'pointer'
          }}>
            {initialCartItem ? '변경 완료' : '주문 담기'}
          </button>
        </div>
      </div>
    </div>
  );
}