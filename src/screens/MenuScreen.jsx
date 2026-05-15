import React, { useState } from 'react';
import { useKiosk } from '../context/KioskContext';
import { COLORS } from '../components/tokens';
import { ProgressBar } from '../components/ProgressBar';
import { categories, menus, getMenusByCategoryId, formatPrice } from '../data';
import { OrderConfirmScreen } from './OrderConfirmScreen'; 
import { OptionModal } from './OptionModal';
import { 수어영역 } from '../components/Signlanguage';

export function MenuScreen() {
  const { 화면, 처음으로, 안내, 접근성, set화면, 장바구니, 장바구니추가, 장바구니수정, 장바구니제거 } = useKiosk();
  const 고대비 = 접근성?.고대비 || false;
  const 낮은화면 = 접근성?.휠체어 || false;
  const 배율맵 = { normal: 1.5, large: 1.8, xlarge: 2.3 };
  const 낮은화면배율맵 = { normal: 1.4, large: 1.6, xlarge: 1.8 };
  const 배율 = 낮은화면 ? 낮은화면배율맵[접근성?.글씨크기 || 'normal'] : 배율맵[접근성?.글씨크기 || 'normal'];
  const [선택카테고리, set선택카테고리] = useState(categories[0].id);
  const [페이지, set페이지] = useState(0);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, menu: null, cartItem: null });
  const [showCartModal, setShowCartModal] = useState(false);

  if (화면 === '주문확인') return <OrderConfirmScreen />;

  const bg = 고대비 ? '#000000' : '#E8E8E8';
  const cardBg = 고대비 ? '#000000' : '#FFFFFF';
  const fg = 고대비 ? '#FFEB3B' : '#000000';
  const primaryColor = 고대비 ? '#FFEB3B' : COLORS.primary;
  const brownColor = 고대비 ? '#FFEB3B' : '#3D2418';
  const grayColor = 고대비 ? '#444' : '#BBB';

  const MENUS_PER_PAGE = 낮은화면 ? 8 : 8;

  const 카테고리메뉴 = getMenusByCategoryId(선택카테고리);
  const 총페이지 = Math.max(1, Math.ceil(카테고리메뉴.length / MENUS_PER_PAGE));
  const 현재페이지메뉴 = 카테고리메뉴.slice(페이지 * MENUS_PER_PAGE, (페이지 + 1) * MENUS_PER_PAGE);
  const 빈슬롯수 = MENUS_PER_PAGE - 현재페이지메뉴.length;
  const 빈슬롯 = Array(빈슬롯수).fill(null);

  const 카테고리클릭 = (catId) => { set선택카테고리(catId); set페이지(0); };
  const 메뉴클릭 = (menu) => {
    if (menu.soldOut) { 안내('품절된 메뉴입니다'); return; }
    const currentCategory = categories.find(c => c.id === 선택카테고리);
    if (currentCategory?.name === '디저트' || currentCategory?.name === '푸드') {
      장바구니추가({ menuId: menu.id, qty: 1, options: [], optionPrice: 0 });
      안내('장바구니에 담겼습니다.');
      return;
    }
    setModalConfig({ isOpen: true, menu, cartItem: null });
  };
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

  const 카테고리1행 = categories.slice(0, 4);
  const 카테고리2행 = categories.slice(4, 8);
  const 빈카테고리 = Array(4 - 카테고리2행.length).fill(null);

  const 페이지버튼크기 = `${54 * 배율}px`;
  const 수량버튼크기 = `${36 * 배율}px`;
  const 상단바높이 = `${80 * 배율}px`;
  const 카테고리높이 = `${44 * 배율}px`;
  const 하단바높이 = `${80 * 배율}px`;
  const 취소주문버튼너비 = `${120 * 배율}px`;

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', background: 낮은화면 ? '#000000' : bg, color: fg, overflow: 'hidden', boxSizing: 'border-box' }}>

      {낮은화면 && <div style={{ flex: '0 0 50%', background: '#000000' }} />}

      <div style={{ flex: 낮은화면 ? '0 0 50%' : '1', display: 'flex', flexDirection: 'column', background: bg, overflow: 'hidden' }}>

        {낮은화면 ? (
          <>
            <div style={{ background: 고대비 ? '#000000' : '#FFF'
, padding: '10px 24px', flexShrink: 0, display: 'flex', alignItems: 'center', borderBottom: '1px solid #CCC' }}>
              <button onClick={처음으로} style={{ fontSize: `${32 * 배율}px`, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, color: '#000' }}>🏠</button>
            </div>
            <수어영역 안내텍스트="음료를 선택해주세요." />
            <div style={{ flex: 1, display: 'flex', padding: '16px', gap: '16px', overflow: 'hidden' }}>
              <div style={{ width: `${130 * 배율}px`, display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', flexShrink: 0 }}>
                {categories.map(cat => {
                  const active = cat.id === 선택카테고리;
                  return (
                    <button key={cat.id} onClick={() => 카테고리클릭(cat.id)} style={{
                      padding: '16px 8px', borderRadius: '8px',
                      border: active ? `2px solid ${primaryColor}` : '1px solid #CCC',
                      background: active ? primaryColor : cardBg,
                      color: active && 고대비 ? '#000' : fg,
                      fontSize: `${16 * 배율}px`, fontWeight: 'bold', cursor: 'pointer',
                      textAlign: 'center', wordBreak: 'keep-all',
                    }}>
                      {cat.name}
                    </button>
                  );
                })}
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', gap: '8px' }}>
                  {현재페이지메뉴.map(menu => (
                    <button key={menu.id} onClick={() => 메뉴클릭(menu)} style={{
                      background: cardBg, border: `1px solid ${고대비 ? primaryColor : '#DDD'}`,
                      borderRadius: '12px', padding: '8px',
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      cursor: menu.soldOut ? 'not-allowed' : 'pointer',
                      opacity: menu.soldOut ? 0.4 : 1, position: 'relative', overflow: 'hidden', minWidth: 0,
                    }}>
                      {menu.soldOut && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: `${16 * 배율}px`, fontWeight: 'bold', borderRadius: '12px', zIndex: 1 }}>품절</div>}
                      <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '6px', minHeight: '50px' }}>
                        <img src={menu.image} alt={menu.name} style={{ maxHeight: '70px', maxWidth: '100%', objectFit: 'contain' }} />
                      </div>
                      <div style={{ fontSize: `${14 * 배율}px`, fontWeight: 'bold', textAlign: 'center', color: fg, wordBreak: 'keep-all', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', width: '100%' }}>{menu.name}</div>
                      <div style={{ fontSize: `${12 * 배율}px`, fontWeight: 'bold', color: 고대비 ? primaryColor : '#666' }}>₩ {formatPrice(menu.price)}</div>
                    </button>
                  ))}
                  {빈슬롯.map((_, idx) => <div key={`empty-${idx}`} style={{ background: 'transparent', borderRadius: '12px' }} />)}
                </div>
                {총페이지 > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '30px', padding: '12px 0 0 0', flexShrink: 0 }}>
                    <button onClick={() => set페이지(Math.max(0, 페이지 - 1))} disabled={페이지 === 0} style={{ padding: '8px 24px', fontSize: `${16 * 배율}px`, borderRadius: '20px', background: grayColor, border: 'none', fontWeight: 'bold', cursor: 'pointer', color: 페이지 === 0 ? '#888' : '#000' }}>이전</button>
                    <span style={{ fontSize: `${18 * 배율}px`, fontWeight: 'bold', color: fg }}>{페이지 + 1} / {총페이지}</span>
                    <button onClick={() => set페이지(Math.min(총페이지 - 1, 페이지 + 1))} disabled={페이지 >= 총페이지 - 1} style={{ padding: '8px 24px', fontSize: `${16 * 배율}px`, borderRadius: '20px', background: grayColor, border: 'none', fontWeight: 'bold', cursor: 'pointer', color: 페이지 >= 총페이지 - 1 ? '#888' : '#000' }}>다음</button>
                  </div>
                )}
              </div>
            </div>
            <div style={{ height: 하단바높이, background: 고대비 ? '#000000' : brownColor, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px', flexShrink: 0, border: 고대비 ? '2px solid #FFEB3B' : 'none' }}>
              <button onClick={() => setShowCartModal(true)} style={{ background: 고대비 ? '#FFEB3B' : primaryColor, color: '#000', border: 'none', padding: `${14 * 배율}px ${28 * 배율}px`, borderRadius: '8px', fontSize: `${20 * 배율}px`, fontWeight: 'bold', cursor: 'pointer' }}>주문내역</button>
              <div style={{ color: 고대비 ? '#FFFFFF' : '#FFF', fontSize: `${24 * 배율}px`, fontWeight: 'bold' }}>총 금액 <span style={{ marginLeft: '12px', fontSize: `${28 * 배율}px` }}>₩ {formatPrice(총금액)}</span></div>
              <button onClick={() => { if (장바구니.length === 0) return 안내('장바구니가 비어 있습니다.'); set화면('주문확인'); }} style={{ background: 고대비 ? '#FFEB3B' : primaryColor, color: '#000', border: 'none', padding: `${14 * 배율}px ${32 * 배율}px`, borderRadius: '8px', fontSize: `${22 * 배율}px`, fontWeight: 'bold', cursor: 'pointer' }}>주문하기</button>
             </div>
          </>
        ) : (
          <>
            <div style={{ flexShrink: 0, borderBottom: `1px solid ${grayColor}` }}>
              <div style={{ display: 'flex', alignItems: 'center', height: 상단바높이, background: 고대비 ? '#000000' : '#FFF', padding: '0 24px' }}>
                <button onClick={처음으로} style={{ fontSize: `${44 * 배율}px`, background: 'transparent', border: 'none', cursor: 'pointer', padding: '0', color: fg }}>🏠</button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0', background: bg }}>
                <div style={{ width: '100%', maxWidth: '700px' }}><ProgressBar currentStep={1} 고대비={고대비} 배율={배율} /></div>
              </div>
              <수어영역 안내텍스트="음료를 선택해주세요." />
            </div>

            <div style={{ padding: '10px 18px 6px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                {카테고리1행.map(cat => {
                  const active = cat.id === 선택카테고리;
                  return <button key={cat.id} onClick={() => 카테고리클릭(cat.id)} style={{ flex: 1, height: 카테고리높이, padding: '6px', borderRadius: '10px', border: active ? `3px solid ${primaryColor}` : `1px solid ${grayColor}`, background: active ? primaryColor : cardBg, color: active && 고대비 ? '#000' : fg, fontSize: `${20 * 배율}px`, fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cat.name}</button>;
                })}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                {카테고리2행.map(cat => {
                  const active = cat.id === 선택카테고리;
                  return <button key={cat.id} onClick={() => 카테고리클릭(cat.id)} style={{ flex: 1, height: 카테고리높이, padding: '6px', borderRadius: '10px', border: active ? `3px solid ${primaryColor}` : `1px solid ${grayColor}`, background: active ? primaryColor : cardBg, color: active && 고대비 ? '#000' : fg, fontSize: `${20 * 배율}px`, fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cat.name}</button>;
                })}
                {빈카테고리.map((_, i) => <div key={`empty-cat-${i}`} style={{ flex: 1, height: 카테고리높이, borderRadius: '10px', border: `1px solid ${grayColor}`, background: cardBg }} />)}
              </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 18px', minHeight: 0, overflow: 'hidden' }}>
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', gap: '12px', minHeight: 0 }}>
                {현재페이지메뉴.map(menu => (
                  <button key={menu.id} onClick={() => 메뉴클릭(menu)} style={{ background: cardBg, border: `1px solid ${고대비 ? primaryColor : '#DDD'}`, borderRadius: '14px', padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: menu.soldOut ? 'not-allowed' : 'pointer', opacity: menu.soldOut ? 0.4 : 1, position: 'relative', overflow: 'hidden', minHeight: 0 }}>
                    {menu.soldOut && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: `${26 * 배율}px`, fontWeight: 'bold', borderRadius: '14px', zIndex: 1 }}>품절</div>}
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: 0, marginBottom: '8px' }}><img src={menu.image} alt={menu.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} /></div>
                    <div style={{ fontSize: `${14 * 배율}px`, fontWeight: 'bold', textAlign: 'center', color: fg, wordBreak: 'keep-all', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', width: '100%' }}>{menu.name}</div>
                    <div style={{ fontSize: `${12 * 배율}px`, fontWeight: 'bold', color: 고대비 ? primaryColor : '#777' }}>₩ {formatPrice(menu.price)}</div>
                  </button>
                ))}
                {빈슬롯.map((_, idx) => <div key={`empty-${idx}`} style={{ background: cardBg, border: '1px solid #DDD', borderRadius: '14px', minHeight: 0 }} />)}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '60px', padding: '12px 0', flexShrink: 0, background: bg }}>
                <button onClick={() => set페이지(Math.max(0, 페이지 - 1))} disabled={페이지 === 0} style={{ width: 페이지버튼크기, height: 페이지버튼크기, borderRadius: '50%', background: grayColor, border: 'none', color: 페이지 === 0 ? '#CCC' : '#000', fontSize: `${32 * 배율}px`, fontWeight: 'bold', cursor: 페이지 === 0 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>&lt;</button>
                {총페이지 > 1 && <div style={{ fontSize: `${20 * 배율}px`, fontWeight: 'bold', color: brownColor, minWidth: '60px', textAlign: 'center' }}>{페이지 + 1} / {총페이지}</div>}
                <button onClick={() => set페이지(Math.min(총페이지 - 1, 페이지 + 1))} disabled={페이지 >= 총페이지 - 1} style={{ width: 페이지버튼크기, height: 페이지버튼크기, borderRadius: '50%', background: grayColor, border: 'none', color: 페이지 >= 총페이지 - 1 ? '#CCC' : '#000', fontSize: `${32 * 배율}px`, fontWeight: 'bold', cursor: 페이지 >= 총페이지 - 1 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>&gt;</button>
              </div>
            </div>

            <div style={{ flexShrink: 0 }}>
              <div style={{ background: 고대비 ? '#000' : brownColor, color: 고대비 ? primaryColor : '#FFF', padding: '16px 28px', display: 'flex', justifyContent: 'space-between', fontSize: `${24 * 배율}px`, fontWeight: 'bold' }}>
                <div>총 수량 <span style={{ marginLeft: '16px' }}>{총수량}</span></div>
                <div>총 금액 <span style={{ marginLeft: '16px' }}>₩ {formatPrice(총금액)}</span></div>
              </div>
              <div style={{ display: 'flex', background: cardBg, padding: '10px 18px', gap: '10px', alignItems: 'stretch', minHeight: '160px', maxHeight: '160px', overflow: 'hidden' }}>
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {장바구니.map(item => {
                    const menu = menus.find(m => m.id === item.menuId);
                    if (!menu) return null;
                    return (
                      <div key={item.uid} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: grayColor, padding: '8px 10px', borderRadius: '8px' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: `${16 * 배율}px`, color: fg, fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{menu.name}</div>
                          <div style={{ fontSize: `${12 * 배율}px`, color: '#666', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.options?.length > 0 ? item.options.join(', ') : ''}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                          <button onClick={() => 장바구니수정(item.uid, item.qty - 1)} style={{ width: 수량버튼크기, height: 수량버튼크기, borderRadius: '50%', background: '#000', border: 'none', color: '#FFF', fontSize: `${18 * 배율}px`, fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>−</button>
                          <span style={{ minWidth: `${24 * 배율}px`, textAlign: 'center', fontSize: `${18 * 배율}px`, fontWeight: 'bold', color: fg }}>{item.qty}</span>
                          <button onClick={() => 장바구니수정(item.uid, item.qty + 1)} style={{ width: 수량버튼크기, height: 수량버튼크기, borderRadius: '50%', background: '#000', border: 'none', color: '#FFF', fontSize: `${18 * 배율}px`, fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>+</button>
                        </div>
                        <button onClick={() => 옵션변경클릭(item)} style={{ padding: `6px ${10 * 배율}px`, fontSize: `${14 * 배율}px`, borderRadius: '8px', background: brownColor, color: 고대비 ? '#000' : '#FFF', border: 'none', fontWeight: 'bold', cursor: 'pointer', flexShrink: 0 }}>옵션변경</button>
                      </div>
                    );
                  })}
                </div>
                <div style={{ width: 취소주문버튼너비, display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
                  {장바구니.length > 0 && <button onClick={() => { 장바구니.forEach(item => 장바구니제거(item.uid)); 안내('전체 취소'); }} style={{ padding: '8px 0', fontSize: `${16 * 배율}px`, borderRadius: '8px', background: grayColor, color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer', textAlign: 'center' }}>취소하기</button>}
                  <button onClick={() => { if (장바구니.length === 0) { 안내('장바구니가 비어 있습니다.'); return; } set화면('주문확인'); }} style={{ flex: 1, borderRadius: '8px', background: primaryColor, color: '#000', fontSize: `${20 * 배율}px`, fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>주문하기</button>
                </div>
              </div>
              <div style={{ background: cardBg, padding: '10px 18px', borderTop: `1px solid ${grayColor}`, height: `${70 * 배율}px` }} />
            </div>
          </>
        )}
      </div>

      {modalConfig.isOpen && (
        <OptionModal menu={modalConfig.menu} initialCartItem={modalConfig.cartItem} 고대비={고대비}
          onClose={() => setModalConfig({ isOpen: false, menu: null, cartItem: null })}
          onAddToCart={handleModalConfirm} />
      )}

      {showCartModal && 낮은화면 && (
      <div onClick={() => setShowCartModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: '5vh', alignItems: 'center' }}>
        <div onClick={e => e.stopPropagation()} style={{ background: 고대비 ? '#000000' : cardBg, width: '92%', maxWidth: '600px', maxHeight: '40vh', borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: 고대비 ? '2px solid #FFEB3B' : 'none' }}>
          <div style={{ background: 고대비 ? '#FFEB3B' : brownColor, padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ color: '#000000', margin: 0, fontSize: `${22 * 배율}px` }}>장바구니 확인</h3>
            <button onClick={() => setShowCartModal(false)} style={{ background: 'transparent', border: 'none', color: '#000000', fontSize: `${28 * 배율}px`, cursor: 'pointer' }}>✕</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', background: 고대비 ? '#000000' : cardBg }}>
            {장바구니.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', fontSize: `${20 * 배율}px`, color: 고대비 ? '#FFEB3B' : '#666', fontWeight: 'bold' }}>장바구니가 비어있습니다.</div>
            ) : (
              장바구니.map(item => {
                const menu = menus.find(m => m.id === item.menuId);
                if (!menu) return null;
                return (
                  <div key={item.uid} style={{ display: 'flex', alignItems: 'center', background: 고대비 ? '#000000' : '#F5F5F5', padding: '14px', borderRadius: '12px', border: 고대비 ? '1px solid #FFEB3B' : '1px solid #DDD' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: `${18 * 배율}px`, fontWeight: 'bold', color: 고대비 ? '#FFEB3B' : '#000' }}>{menu.name}</div>
                      <div style={{ fontSize: `${14 * 배율}px`, color: 고대비 ? '#FFEB3B' : '#666', marginTop: '4px' }}>{item.options?.join(', ')}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ fontSize: `${18 * 배율}px`, fontWeight: 'bold', color: 고대비 ? '#FFEB3B' : '#000' }}>{item.qty}개</span>
                      <button onClick={() => 장바구니제거(item.uid)} style={{ background: 고대비 ? '#FFEB3B' : '#FF4444', color: '#000000', border: 'none', padding: `${8 * 배율}px ${16 * 배율}px`, fontSize: `${16 * 배율}px`, fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer' }}>삭제</button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    )}

    </div>
  );
}