/**
 * 클라이언트 요청 본문에서 리뷰 데이터로 변환
 * @param {Object} body - 요청 본문
 * @param {number} userId - 사용자 ID
 * @returns {Object} 리뷰 데이터 객체
 */
export const bodyToReview = (body, userId) => {
  return {
    content: body.content,
    score: body.score,
    image_url: body.imageUrl || null,
    store_id: body.storeId,
    user_id: userId
  };
};

/**
 * 리뷰 데이터를 응답 형식으로 변환
 * @param {Object} review - 리뷰 데이터
 * @returns {Object} 응답 형식의 리뷰 데이터
 */
export const reviewToResponse = (review) => {
  return {
    id: review.id,
    content: review.content,
    score: review.score,
    image_url: review.image_url,
    store: {
      id: review.store.id,
      name: review.store.name
    },
    user: {
      id: review.user.id,
      name: review.user.name
    },
    created_at: review.created_at
  };
};

/**
 * 리뷰 목록을 커서 페이지네이션이 포함된 응답 형식으로 변환
 * @param {Array} reviews - 리뷰 목록
 * @param {number} limit - 요청한 리뷰 개수 제한
 * @returns {Object} 페이지네이션이 포함된 응답 데이터
 */
export const reviewsToResponseWithCursor = (reviews, limit) => {
  // 다음 페이지가 있는지 확인 (요청한 개수보다 많은 결과가 있는 경우)
  const hasNextPage = reviews.length > limit;
  
  // 실제로 반환할 데이터 (limit까지만)
  const limitedReviews = hasNextPage ? reviews.slice(0, limit) : reviews;
  
  // 리뷰 데이터 변환
  const data = limitedReviews.map(review => ({
    id: review.id,
    nickname: review.user.name,
    rating: review.score,
    createdAt: review.created_at,
    content: review.content
  }));
  
  // 다음 페이지 커서 설정 (페이지가 있으면 마지막 항목의 ID, 없으면 null)
  const nextCursor = hasNextPage && limitedReviews.length > 0 
    ? limitedReviews[limitedReviews.length - 1].id 
    : null;
  
  return {
    data: data,
    cursor: nextCursor
  };
};
