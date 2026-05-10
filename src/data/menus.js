// 메뉴 데이터베이스
// 메뉴 추가/수정/삭제는 이 파일만 고치면 됨
// 필드 설명:
//   id: 고유 번호 (중복 X)
//   categoryId: 어느 카테고리에 속하는지 (categories.js의 id 참조)
//   name: 메뉴 이름
//   price: 가격 (원)
//   image: 이모지 (나중에 사진 경로로 교체 가능)
//   description: 메뉴 설명 (선택)
//   soldOut: 품절 여부
export const menus = [
  // ── 커피 ──
  { id: 101, categoryId: 1, name: '아메리카노', price: 4500, image: '/public/americano.png', description: '에스프레소와 물의 조화', soldOut: false },
  { id: 102, categoryId: 1, name: '카페라떼', price: 5000, image: '/public/cafe_latte.png', description: '부드러운 우유와 에스프레소', soldOut: false },
  { id: 103, categoryId: 1, name: '카푸치노', price: 5000, image: '/public/cappuccino.png', description: '풍성한 우유 거품', soldOut: false },
  { id: 104, categoryId: 1, name: '바닐라라떼', price: 5500, image: '/public/vanilla_latte.png', description: '달콤한 바닐라 시럽', soldOut: false },
  { id: 105, categoryId: 1, name: '카라멜마키아토', price: 5800, image: '/public/macchiato.png', description: '카라멜의 달콤함', soldOut: false },

  // ── 논커피 ──
  { id: 201, categoryId: 2, name: '초코라떼', price: 5500, image: '/public/choco_latte.png', description: '진한 초콜릿', soldOut: false },
  { id: 202, categoryId: 2, name: '녹차라떼', price: 5500, image: '/public/match_latte.png', description: '고소한 녹차', soldOut: false },
  { id: 203, categoryId: 2, name: '미숫가루', price: 5500, image: '/public/misugaru.png', description: '달콤한 고구마', soldOut: false },
  { id: 204, categoryId: 2, name: '딸기라떼', price: 5800, image: '/public/strawberry_latte.png', description: '상큼한 딸기', soldOut: false },

  // ── 스무디 (Only Ice) ──
  { id: 301, categoryId: 3, name: '딸기요거트스무디', price: 6500, image: '/public/strawberry_smoothie.png', description: '신선한 딸기와 요거트', soldOut: false },
  { id: 302, categoryId: 3, name: '블루베리요거트스무디', price: 6500, image: '/public/blueberry_smoothie.png', description: '블루베리의 풍미', soldOut: false },
  { id: 303, categoryId: 3, name: '망고스무디', price: 6500, image: '/public/mango_smoothie.png', description: '달콤한 망고', soldOut: false },
  { id: 304, categoryId: 3, name: '플레인요거트', price: 5800, image: '🥛', description: '깔끔한 요거트', soldOut: false },
  { id: 305, categoryId: 3, name: '초코스무디', price: 6500, image: '/public/choco_smoothie.png', description: '진한 초코', soldOut: false },

  // ── 디저트 ──
  { id: 401, categoryId: 4, name: '치즈케이크', price: 6000, image: '🍰', description: '부드러운 뉴욕 치즈케이크', soldOut: false },
  { id: 402, categoryId: 4, name: '티라미수', price: 6500, image: '🍰', description: '이탈리안 정통 티라미수', soldOut: false },
  { id: 403, categoryId: 4, name: '크로플', price: 5500, image: '🥐', description: '바삭한 크로아상 와플', soldOut: false },
  { id: 404, categoryId: 4, name: '쿠키', price: 3500, image: '🍪', description: '수제 초코칩 쿠키', soldOut: false },

  // ── 푸드 ──
  { id: 501, categoryId: 5, name: '햄치즈샌드위치', price: 7000, image: '🥪', description: '신선한 햄과 치즈', soldOut: false },
  { id: 502, categoryId: 5, name: '베이글', price: 5000, image: '🥯', description: '쫄깃한 베이글', soldOut: false },
  { id: 503, categoryId: 5, name: '에그타르트', price: 4500, image: '🥧', description: '포르투갈식 에그타르트', soldOut: false },
];