import React, { useState } from 'react';
import { useKiosk } from '../context/KioskContext';
import { COLORS } from '../components/tokens';
import { ProgressBar } from '../components/ProgressBar';
import { categories, menus, getMenusByCategoryId, formatPrice } from '../data';
import { OrderConfirmScreen } from './OrderConfirmScreen'; 
import { OptionModal } from './OptionModal';
import { 수어영역 } from '../components/Signlanguage';

export function MenuScreen() {
  const { 화면, 처음으로, 안내, 접근성, 접근성업데이트, set화면, 장바구니, 장바구니추가, 장바구니수정, 장바구니제거 } = useKiosk();
  
  const 고대비 = 접근성?.고대비 || false;
  const 낮은화면 = 접근성?.휠체어 || false;

  const [선택카테고리, set선택카테고리] = useState(categories[0].id);
  const [페이지, set페이지] = useState(0);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, menu: null, cartItem: null });
  const [배리어프리팝업, set배리어프리팝업] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);

  if (화면 === '주문확인') return <OrderConfirmScreen />;

  const bg = 고대비 ? '#000000' : '#E8E8E8';
  const cardBg = 고대비 ? '#000000' : '#FFFFFF';
  const fg = 고대비 ? '#FFEB3B' : '#000000';
  const primaryColor = 고대비 ? '#FFEB3B' : COLORS.primary; 
  const brownColor = 고대비 ? '#FFEB3B' : '#3D2418';
  const grayColor = 고대비 ? '#444' : '#BBB';

  const MENUS_PER_PAGE = 낮은화면 ? 6 : 8;

  const 카테고리메뉴 = getMenusByCategoryId(선택카테고리);
  const 총페이지 = Math.max(1, Math.ceil(카테고리메뉴.length / MENUS_PER_PAGE));
  const 현재페이지메뉴 = 카테고리메뉴.slice(페이지 * MENUS_PER_PAGE, (페이지 + 1) * MENUS_PER_PAGE);
  const 빈슬롯수 = MENUS_PER_PAGE - 현재페이지메뉴.length;
  const 빈슬롯 = Array(빈슬롯수).fill(null);

  const 카테고리클릭 = (catId) => { set선택카테고리(catId); set페이지(0); };
  const 메뉴클릭 = (menu) => {
    if (menu.soldOut) { 안내('품절된 메뉴입니다'); return; }
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

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', background: 낮은화면 ? '#000000' : bg, color: fg, overflow: 'hidden', boxSizing: 'border-box' }}>

      {/* 낮은화면: 상단 50% 검정 */}
      {낮은화면 && <div style={{ flex: '0 0 50%', background: '#000000' }} />}

      {/* 실제 컨텐츠 래퍼 */}
      <div style={{ flex: 낮은화면 ? '0 0 50%' : '1', display: 'flex', flexDirection: 'column', background: bg, overflow: 'hidden' }}>

        {/* ===== 낮은화면 레이아웃 ===== */}
        {낮은화면 ? (
          <>
            <div style={{ background: '#FFF', padding: '10px 24px', flexShrink: 0, display: 'flex', alignItems: 'center', borderBottom: '1px solid #CCC' }}>
              <button onClick={처음으로} style={{ fontSize: '32px', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, color: '#000' }}>🏠</button>
            </div>

            {/* 수어 영역 */}
            <수어영역 안내텍스트="음료를 선택해주세요." />

            <div style={{ flex: 1, display: 'flex', padding: '16px', gap: '16px', overflow: 'hidden' }}>
              {/* 좌측 세로 카테고리 */}
              <div style={{ width: '130px', display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' }}>
                {categories.map(cat => {
                  const active = cat.id === 선택카테고리;
                  return (
                    <button key={cat.id} onClick={() => 카테고리클릭(cat.id)} style={{
                      padding: '16px 8px', borderRadius: '8px',
                      border: active ? `2px solid ${primaryColor}` : '1px solid #CCC',
                      background: active ? primaryColor : cardBg,
                      color: active && 고대비 ? '#000' : fg,
                      fontSize: '16px', fontWeight: 'bold', cursor: 'pointer',
                      textAlign: 'center', wordBreak: 'keep-all',
                    }}>
                      {cat.name}
                    </button>
                  );
                })}
              </div>

              {/* 우측 3x2 메뉴 그리드 */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', gap: '16px' }}>
                  {현재페이지메뉴.map(menu => (
                    <button key={menu.id} onClick={() => 메뉴클릭(menu)} style={{
                      background: cardBg, border: `1px solid ${고대비 ? primaryColor : '#DDD'}`,
                      borderRadius: '12px', padding: '16px',
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      cursor: menu.soldOut ? 'not-allowed' : 'pointer',
                      opacity: menu.soldOut ? 0.4 : 1, position: 'relative',
                    }}>
                      {menu.soldOut && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold', borderRadius: '12px', zIndex: 1 }}>품절</div>}
                      <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px', minHeight: '80px' }}>
                        <img src={menu.image} alt={menu.name} style={{ maxHeight: '100px', maxWidth: '100%', objectFit: 'contain' }} />
                      </div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'center', color: fg, wordBreak: 'keep-all', marginBottom: '6px' }}>{menu.name}</div>
                      <div style={{ fontSize: '15px', fontWeight: 'bold', color: 고대비 ? primaryColor : '#666' }}>₩ {formatPrice(menu.price)}</div>
                    </button>
                  ))}
                  {빈슬롯.map((_, idx) => <div key={`empty-${idx}`} style={{ background: 'transparent', borderRadius: '12px' }} />)}
                </div>
                {총페이지 > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '30px', padding: '12px 0 0 0', flexShrink: 0 }}>
                    <button onClick={() => set페이지(Math.max(0, 페이지 - 1))} disabled={페이지 === 0} style={{ padding: '8px 24px', fontSize: '16px', borderRadius: '20px', background: grayColor, border: 'none', fontWeight: 'bold', cursor: 'pointer', color: 페이지 === 0 ? '#888' : '#000' }}>이전</button>
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: fg }}>{페이지 + 1} / {총페이지}</span>
                    <button onClick={() => set페이지(Math.min(총페이지 - 1, 페이지 + 1))} disabled={페이지 >= 총페이지 - 1} style={{ padding: '8px 24px', fontSize: '16px', borderRadius: '20px', background: grayColor, border: 'none', fontWeight: 'bold', cursor: 'pointer', color: 페이지 >= 총페이지 - 1 ? '#888' : '#000' }}>다음</button>
                  </div>
                )}
              </div>
            </div>

            {/* 하단 주문 바 */}
            <div style={{ height: '80px', background: brownColor, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px', flexShrink: 0 }}>
              <button onClick={() => setShowCartModal(true)} style={{ background: primaryColor, color: '#000', border: 'none', padding: '14px 28px', borderRadius: '8px', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer' }}>주문내역</button>
              <div style={{ color: '#FFF', fontSize: '24px', fontWeight: 'bold' }}>총 금액 <span style={{ marginLeft: '12px', fontSize: '28px' }}>₩ {formatPrice(총금액)}</span></div>
              <button onClick={() => { if (장바구니.length === 0) return 안내('장바구니가 비어 있습니다.'); set화면('주문확인'); }} style={{ background: primaryColor, color: '#000', border: 'none', padding: '14px 32px', borderRadius: '8px', fontSize: '22px', fontWeight: 'bold', cursor: 'pointer' }}>주문하기</button>
            </div>
          </>

        ) : (

        /* ===== 일반 레이아웃 ===== */
          <>
            <div style={{ flexShrink: 0, borderBottom: `1px solid ${grayColor}` }}>
              <div style={{ display: 'flex', alignItems: 'center', height: '80px', background: '#FFF', padding: '0 24px' }}>
                <button onClick={처음으로} style={{ fontSize: '44px', background: 'transparent', border: 'none', cursor: 'pointer', padding: '0', color: fg }}>🏠</button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0', background: bg }}>
                <div style={{ width: '100%', maxWidth: '700px' }}><ProgressBar currentStep={1} 고대비={고대비} /></div>
              </div>
              <수어영역 안내텍스트="음료를 선택해주세요." />
            </div>

            <div style={{ padding: '16px 18px 24px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                {카테고리1행.map(cat => {
                  const active = cat.id === 선택카테고리;
                  return <button key={cat.id} onClick={() => 카테고리클릭(cat.id)} style={{ flex: 1, height: '60px', padding: '6px', borderRadius: '10px', border: active ? `3px solid ${primaryColor}` : `1px solid ${grayColor}`, background: active ? primaryColor : cardBg, color: active && 고대비 ? '#000' : fg, fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cat.name}</button>;
                })}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                {카테고리2행.map(cat => {
                  const active = cat.id === 선택카테고리;
                  return <button key={cat.id} onClick={() => 카테고리클릭(cat.id)} style={{ flex: 1, height: '60px', padding: '6px', borderRadius: '10px', border: active ? `3px solid ${primaryColor}` : `1px solid ${grayColor}`, background: active ? primaryColor : cardBg, color: active && 고대비 ? '#000' : fg, fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cat.name}</button>;
                })}
                {빈카테고리.map((_, i) => <div key={`empty-cat-${i}`} style={{ flex: 1, height: '60px', borderRadius: '10px', border: `1px solid ${grayColor}`, background: cardBg }} />)}
              </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 18px', minHeight: 0, overflow: 'hidden' }}>
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', gap: '12px', minHeight: 0 }}>
                {현재페이지메뉴.map(menu => (
                  <button key={menu.id} onClick={() => 메뉴클릭(menu)} style={{ background: cardBg, border: `1px solid ${고대비 ? primaryColor : '#DDD'}`, borderRadius: '14px', padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: menu.soldOut ? 'not-allowed' : 'pointer', opacity: menu.soldOut ? 0.4 : 1, position: 'relative', overflow: 'hidden', minHeight: 0 }}>
                    {menu.soldOut && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', fontWeight: 'bold', borderRadius: '14px', zIndex: 1 }}>품절</div>}
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: 0, marginBottom: '8px' }}><img src={menu.image} alt={menu.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} /></div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'center', color: fg, marginBottom: '4px' }}>{menu.name}</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: 고대비 ? primaryColor : '#777' }}>₩ {formatPrice(menu.price)}</div>
                  </button>
                ))}
                {빈슬롯.map((_, idx) => <div key={`empty-${idx}`} style={{ background: cardBg, border: '1px solid #DDD', borderRadius: '14px', minHeight: 0 }} />)}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '60px', padding: '16px 0', flexShrink: 0 }}>
                <button onClick={() => set페이지(Math.max(0, 페이지 - 1))} disabled={페이지 === 0} style={{ width: '54px', height: '54px', borderRadius: '50%', background: grayColor, border: 'none', color: 페이지 === 0 ? '#CCC' : '#000', fontSize: '32px', fontWeight: 'bold', cursor: 페이지 === 0 ? 'default' : 'pointer' }}>&lt;</button>
                {총페이지 > 1 && <div style={{ fontSize: '20px', fontWeight: 'bold', color: brownColor, minWidth: '60px', textAlign: 'center' }}>{페이지 + 1} / {총페이지}</div>}
                <button onClick={() => set페이지(Math.min(총페이지 - 1, 페이지 + 1))} disabled={페이지 >= 총페이지 - 1} style={{ width: '54px', height: '54px', borderRadius: '50%', background: grayColor, border: 'none', color: 페이지 >= 총페이지 - 1 ? '#CCC' : '#000', fontSize: '32px', fontWeight: 'bold', cursor: 페이지 >= 총페이지 - 1 ? 'default' : 'pointer' }}>&gt;</button>
              </div>
            </div>

            <div style={{ flexShrink: 0 }}>
              <div style={{ background: 고대비 ? '#000' : brownColor, color: 고대비 ? primaryColor : '#FFF', padding: '16px 28px', display: 'flex', justifyContent: 'space-between', fontSize: '24px', fontWeight: 'bold' }}>
                <div>총 수량 <span style={{ marginLeft: '16px' }}>{총수량}</span></div>
                <div>총 금액 <span style={{ marginLeft: '16px' }}>₩ {formatPrice(총금액)}</span></div>
              </div>
              <div style={{ display: 'flex', background: cardBg, padding: '14px 18px', gap: '14px', alignItems: 'stretch', minHeight: '260px' }}>
                <div style={{ flex: 1, maxHeight: '240px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {장바구니.map(item => {
                    const menu = menus.find(m => m.id === item.menuId);
                    if (!menu) return null;
                    return (
                      <div key={item.uid} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: grayColor, padding: '10px', borderRadius: '8px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '18px', color: fg, fontWeight: 'bold' }}>{menu.name}</div>
                          <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>{item.options?.length > 0 ? item.options.join(', ') : ''}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button onClick={() => 장바구니수정(item.uid, item.qty - 1)} style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#000', border: 'none', color: '#FFF', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer' }}>−</button>
                          <span style={{ minWidth: '28px', textAlign: 'center', fontSize: '22px', fontWeight: 'bold', color: fg }}>{item.qty}</span>
                          <button onClick={() => 장바구니수정(item.uid, item.qty + 1)} style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#000', border: 'none', color: '#FFF', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer' }}>+</button>
                        </div>
                        <button onClick={() => 옵션변경클릭(item)} style={{ padding: '10px 16px', fontSize: '17px', borderRadius: '8px', background: brownColor, color: 고대비 ? '000' : '#FFF', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>옵션변경</button>
                      </div>
                    );
                  })}
                </div>
                <div style={{ width: '160px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {장바구니.length > 0 && <button onClick={() => { 장바구니.forEach(item => 장바구니제거(item.uid)); 안내('전체 취소'); }} style={{ padding: '14px 0', fontSize: '20px', borderRadius: '8px', background: grayColor, color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer', textAlign: 'center' }}>취소하기</button>}
                  <button onClick={() => { if (장바구니.length === 0) { 안내('장바구니가 비어 있습니다.'); return; } set화면('주문확인'); }} style={{ flex: 1, borderRadius: '8px', background: primaryColor, color: '#000', fontSize: '24px', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>주문하기</button>
                </div>
              </div>
              {!접근성?.휠체어 && (
                <div style={{ padding: '0 18px 18px', background: cardBg }}>
                  <button onClick={() => set배리어프리팝업(true)} style={{ padding: '14px 32px', borderRadius: '30px', background: '#FF7A00', color: '#FFF', fontSize: '22px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>배리어프리 모드</button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* 옵션 모달 */}
      {modalConfig.isOpen && (
        <OptionModal
          menu={modalConfig.menu} initialCartItem={modalConfig.cartItem} 고대비={고대비}
          onClose={() => setModalConfig({ isOpen: false, menu: null, cartItem: null })}
          onAddToCart={handleModalConfirm}
        />
      )}

      {/* 낮은화면 장바구니 모달 */}
      {showCartModal && 낮은화면 && (
        <div onClick={() => setShowCartModal(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000,
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: '5vh', alignItems: 'center'
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: cardBg, width: '92%', maxWidth: '600px', maxHeight: '40vh',
            borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden'
          }}>
            <div style={{ background: brownColor, padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ color: '#FFF', margin: 0, fontSize: '22px' }}>장바구니 확인</h3>
              <button onClick={() => setShowCartModal(false)} style={{ background: 'transparent', border: 'none', color: '#FFF', fontSize: '28px', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {장바구니.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', fontSize: '20px', color: '#666', fontWeight: 'bold' }}>장바구니가 비어있습니다.</div>
              ) : (
                장바구니.map(item => {
                  const menu = menus.find(m => m.id === item.menuId);
                  if (!menu) return null;
                  return (
                    <div key={item.uid} style={{ display: 'flex', alignItems: 'center', background: '#F5F5F5', padding: '14px', borderRadius: '12px', border: '1px solid #DDD' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{menu.name}</div>
                        <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>{item.options?.join(', ')}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{item.qty}개</span>
                        <button onClick={() => 장바구니제거(item.uid)} style={{ background: '#FF4444', color: '#FFF', border: 'none', padding: '8px 16px', fontSize: '16px', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer' }}>삭제</button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* 배리어프리 팝업 */}
      {배리어프리팝업 && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ background: '#FFF', borderRadius: '16px', width: '500px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.4)' }}>
            <div style={{ background: brownColor, padding: '16px 20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => set배리어프리팝업(false)} style={{ background: 'none', border: 'none', color: '#FFF', fontSize: '28px', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ padding: '40px 40px 50px', textAlign: 'center' }}>
              <p style={{ fontSize: '26px', fontWeight: 'bold', marginBottom: '40px', color: '#000' }}>
                배리어프리 모드로<br/>이동하시겠습니까?
              </p>
              <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                <button onClick={() => { set배리어프리팝업(false); set모드('쉬운'); 안내('배리어프리 모드로 전환합니다'); }}
                  style={{ width: '160px', height: '80px', background: primaryColor, border: 'none', borderRadius: '12px', fontSize: '28px', fontWeight: 'bold', cursor: 'pointer' }}>예</button>
                <button onClick={() => set배리어프리팝업(false)}
                  style={{ width: '160px', height: '80px', background: '#D0D0D0', border: 'none', borderRadius: '12px', fontSize: '28px', fontWeight: 'bold', cursor: 'pointer' }}>아니오</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}