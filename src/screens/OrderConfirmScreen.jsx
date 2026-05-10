import React, { useState } from 'react';
import { useKiosk } from '../context/KioskContext';
import { ProgressBar } from '../components/ProgressBar';
import { menus, formatPrice } from '../data';
import { OptionModal } from './OptionModal';
import { 수어영역 } from '../components/Signlanguage';

export function OrderConfirmScreen() {
  const { 처음으로, 안내, 접근성, set화면, 장바구니, 장바구니추가, 장바구니수정, 장바구니제거 } = useKiosk();
  const 고대비 = 접근성?.고대비 || false;
  const 낮은화면 = 접근성?.휠체어 || false;

  const [modalConfig, setModalConfig] = useState({ isOpen: false, menu: null, cartItem: null });

  const bg = 고대비 ? '#000000' : '#E6E6E6'; 
  const fg = 고대비 ? '#FFEB3B' : '#000000';
  const brownColor = 고대비 ? '#FFEB3B' : '#3E2723'; 
  const yellowColor = 고대비 ? '#FFEB3B' : '#CDE000'; 
  const grayBtnColor = 고대비 ? '#FFEB3B' : '#D0D0D0';
  const primaryColor = 고대비 ? '#FFEB3B' : '#CDE000';
  const btnTextColor = 고대비 ? '#000000' : '#FFFFFF';

  const 옵션변경클릭 = (cartItem) => {
    const menu = menus.find(m => m.id === cartItem.menuId);
    if (menu) setModalConfig({ isOpen: true, menu, cartItem });
  };

  const handleModalConfirm = (data) => {
    if (data.uid) {
      const targetItem = 장바구니.find(item => item.uid === data.uid);
      if (targetItem) {
        targetItem.options = data.options;
        targetItem.optionPrice = data.optionPrice;
        장바구니수정(data.uid, targetItem.qty); 
      }
      setModalConfig({ isOpen: false, menu: null, cartItem: null });
      안내('옵션이 변경되었습니다.');
    } else {
      장바구니추가(data);
      setModalConfig({ isOpen: false, menu: null, cartItem: null });
      안내('장바구니에 담겼습니다.');
    }
  };

  const 총수량 = 장바구니.reduce((sum, item) => sum + item.qty, 0);
  const 총금액 = 장바구니.reduce((sum, item) => {
    const menu = menus.find(m => m.id === item.menuId);
    return sum + ((menu ? menu.price : 0) + (item.optionPrice || 0)) * item.qty;
  }, 0);

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', background: 낮은화면 ? '#000000' : bg, color: fg, overflow: 'hidden' }}>

      {낮은화면 && <div style={{ flex: '0 0 50%', background: '#000000' }} />}

      <div style={{ flex: 낮은화면 ? '0 0 50%' : '1', display: 'flex', flexDirection: 'column', background: bg, overflow: 'hidden' }}>

        {낮은화면 ? (
          <>
            <div style={{ height: '80px', display: 'flex', alignItems: 'center', padding: '0 30px', background: '#FFFFFF', flexShrink: 0, borderBottom: '1px solid #CCC' }}>
              <button onClick={처음으로} style={{ fontSize: '48px', background: 'transparent', border: 'none', cursor: 'pointer', padding: '0', color: '#000' }}>🏠</button>
            </div>

            <수어영역 안내텍스트="주문을 확인해주세요." />

            <div style={{ padding: '30px 0', textAlign: 'center', flexShrink: 0 }}>
              <h2 style={{ fontSize: '36px', fontWeight: 'bold', margin: 0, color: fg }}>주문을 확인해주세요.</h2>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '0 40px' }}>
              {장바구니.map((item, index) => {
                const menu = menus.find(m => m.id === item.menuId);
                if (!menu) return null;
                const isLast = index === 장바구니.length - 1;
                return (
                  <div key={item.uid} style={{ display: 'flex', alignItems: 'center', padding: '30px 0', borderBottom: isLast ? 'none' : '2px solid #D0D0D0' }}>
                    <div style={{ width: '130px', height: '130px', background: '#FFFFFF', borderRadius: '20px', border: '1px solid #DDD', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '30px', flexShrink: 0 }}>
                      <img src={menu.image} alt={menu.name} style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }} />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ fontSize: '32px', fontWeight: 'bold', color: fg }}>{menu.name}</div>
                      <div style={{ fontSize: '20px', color: 고대비 ? '#FFEB3B' : '#555', lineHeight: '1.4' }}>
                        {item.options?.length > 0 ? item.options.join(', ') : '옵션 없음'}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginRight: '16px' }}>
                        <button onClick={() => 장바구니수정(item.uid, item.qty - 1)} style={{ width: '56px', height: '56px', borderRadius: '50%', border: 'none', background: brownColor, color: btnTextColor, fontSize: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>−</button>
                        <span style={{ fontSize: '36px', fontWeight: 'bold', minWidth: '40px', textAlign: 'center', color: fg }}>{item.qty}</span>
                        <button onClick={() => 장바구니수정(item.uid, item.qty + 1)} style={{ width: '56px', height: '56px', borderRadius: '50%', border: 'none', background: brownColor, color: btnTextColor, fontSize: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>+</button>
                      </div>
                      <button onClick={() => 옵션변경클릭(item)} style={{ background: brownColor, color: btnTextColor, border: 'none', borderRadius: '12px', padding: '16px 24px', fontSize: '22px', fontWeight: 'bold', cursor: 'pointer' }}>옵션변경</button>
                      <button onClick={() => 장바구니제거(item.uid)} style={{ background: grayBtnColor, color: '#000000', border: 'none', borderRadius: '12px', padding: '16px 28px', fontSize: '24px', fontWeight: 'bold', cursor: 'pointer' }}>X</button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ background: brownColor, padding: '30px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: btnTextColor }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: '24px', width: '100px' }}>총 수량</span>
                  <span style={{ fontSize: '36px', fontWeight: 'bold' }}>{총수량}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: '24px', width: '100px' }}>총 금액</span>
                  <span style={{ fontSize: '40px', fontWeight: 'bold' }}>₩ {formatPrice(총금액)}</span>
                </div>
              </div>
              <button onClick={() => { if (장바구니.length === 0) return 안내('장바구니가 비어 있습니다.'); set화면('결제'); }}
                style={{ background: 고대비 ? '#000000' : yellowColor, color: 고대비 ? '#FFEB3B' : '#000000', border: 고대비 ? '2px solid #FFEB3B' : 'none', borderRadius: '16px', padding: '24px 60px', fontSize: '36px', fontWeight: 'bold', cursor: 'pointer' }}>
                결제하기
              </button>
            </div>
          </>

        ) : (
          <>
            <div style={{ height: '80px', display: 'flex', alignItems: 'center', padding: '0 40px', background: '#FFFFFF', flexShrink: 0 }}>
              <button onClick={처음으로} style={{ fontSize: '44px', background: 'transparent', border: 'none', cursor: 'pointer', padding: '0' }}>🏠</button>
            </div>

            <div style={{ padding: '30px 0', background: bg, flexShrink: 0 }}>
              <ProgressBar currentStep={2} 고대비={고대비} />
            </div>
            <수어영역 안내텍스트="주문을 확인해주세요." />

            <div style={{ background: brownColor, height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: btnTextColor, fontSize: '24px', fontWeight: 'bold' }}>메뉴</span>
            </div>

            <div style={{ padding: '40px 0 30px', textAlign: 'center', background: bg, flexShrink: 0 }}>
              <h2 style={{ fontSize: '42px', fontWeight: 'bold', margin: 0, color: fg }}>주문을 확인해주세요.</h2>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', background: bg, padding: '0 5%' }}>
              {장바구니.map((item, index) => {
                const menu = menus.find(m => m.id === item.menuId);
                if (!menu) return null;
                const isLast = index === 장바구니.length - 1;
                return (
                  <div key={item.uid} style={{ display: 'flex', alignItems: 'center', padding: '30px 0', borderBottom: isLast ? 'none' : `2px solid ${고대비 ? '#444' : '#D0D0D0'}` }}>
                    <div style={{ width: '110px', height: '110px', background: '#FFFFFF', borderRadius: '16px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '30px', overflow: 'hidden', flexShrink: 0 }}>
                      <img src={menu.image} alt={menu.name} style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '8px', color: fg }}>{menu.name}</div>
                      <div style={{ fontSize: '18px', color: 고대비 ? '#FFEB3B' : '#666', lineHeight: '1.4' }}>
                        {item.options?.length > 0 ? item.options.map((opt, i) => <div key={i}>{opt}</div>) : <div>옵션 없음</div>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginRight: '30px' }}>
                        <button onClick={() => 장바구니수정(item.uid, item.qty - 1)} style={{ width: '46px', height: '46px', borderRadius: '50%', border: 'none', background: brownColor, color: btnTextColor, fontSize: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>−</button>
                        <span style={{ fontSize: '32px', fontWeight: 'bold', minWidth: '36px', textAlign: 'center', color: fg }}>{item.qty}</span>
                        <button onClick={() => 장바구니수정(item.uid, item.qty + 1)} style={{ width: '46px', height: '46px', borderRadius: '50%', border: 'none', background: brownColor, color: btnTextColor, fontSize: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>+</button>
                      </div>
                      <button onClick={() => 옵션변경클릭(item)} style={{ background: brownColor, color: btnTextColor, border: 'none', borderRadius: '8px', padding: '14px 22px', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer' }}>옵션변경</button>
                      <button onClick={() => 장바구니제거(item.uid)} style={{ background: grayBtnColor, color: '#000000', border: 'none', borderRadius: '8px', padding: '14px 20px', fontSize: '22px', fontWeight: 'bold', cursor: 'pointer', marginLeft: '12px' }}>X</button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ background: brownColor, color: btnTextColor, padding: '20px 5%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '50px', flexShrink: 0 }}>
              <div style={{ fontSize: '26px' }}>총 수량 <span style={{ marginLeft: '14px', fontWeight: 'bold', fontSize: '30px' }}>{총수량}</span></div>
              <div style={{ fontSize: '26px' }}>가격 <span style={{ marginLeft: '14px', fontWeight: 'bold', fontSize: '30px' }}>₩ {formatPrice(총금액)}</span></div>
            </div>

            <div style={{ background: '#FFFFFF', padding: '24px 5%', display: 'flex', justifyContent: 'flex-end', flexShrink: 0 }}>
              <button onClick={() => { if (장바구니.length === 0) return 안내('장바구니가 비어 있습니다.'); set화면('결제'); }}
                style={{ width: '240px', height: '90px', background: yellowColor, border: 'none', borderRadius: '8px', fontSize: '32px', fontWeight: 'bold', cursor: 'pointer', color: '#000' }}>결제 하기</button>
            </div>
          </>
        )}
      </div>

      {modalConfig.isOpen && (
        <OptionModal menu={modalConfig.menu} initialCartItem={modalConfig.cartItem} 고대비={고대비}
          onClose={() => setModalConfig({ isOpen: false, menu: null, cartItem: null })}
          onAddToCart={handleModalConfirm} />
      )}
    </div>
  );
}