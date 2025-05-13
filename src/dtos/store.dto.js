/**
 * 클라이언트 요청 본문에서 가게 데이터로 변환
 * @param {Object} body - 요청 본문
 * @returns {Object} 가게 데이터 객체
 */
export const bodyToStore = (body) => {
  return {
    name: body.name,
    address: body.address,
    contact: body.contact || null,
    category_id: body.categoryId,
    region_id: body.regionId,
    description: body.description || null,
    opening_hours: body.openingHours || null
  };
};

/**
 * 가게 데이터를 응답 형식으로 변환
 * @param {Object} store - 가게 데이터
 * @returns {Object} 응답 형식의 가게 데이터
 */
export const storeToResponse = (store) => {
  return {
    id: store.id,
    name: store.name,
    address: store.address,
    contact: store.contact,
    category: {
      id: store.category.id,
      name: store.category.name
    },
    region: {
      id: store.region.id,
      name: store.region.name
    },
    description: store.description,
    opening_hours: store.opening_hours,
    created_at: store.created_at
  };
};
