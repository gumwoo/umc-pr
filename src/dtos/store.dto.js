export const bodyToStore = (body) => {
  return {
    regionId: body.regionId,
    name: body.name || "",
    address: body.address || "",
    category: body.category || 1, // 기본 카테고리
    score: 0, // 신규 가게의 기본 점수
    reviewCount: 0 // 신규 가게의 기본 리뷰 수
  };
};

export const responseFromStore = (store) => {
  return {
    storeId: store.id,
    regionId: store.region_id,
    name: store.name,
    address: store.address,
    category: store.category,
    score: store.score,
    reviewCount: store.review_count
  };
};
