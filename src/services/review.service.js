import logger from '../utils/logger.js';
import { addReview, getReviewsByStoreId, getReviewsByUserId } from '../repositories/review.repository.js';
import { getStoreById } from '../repositories/store.repository.js';
import { reviewToResponse, reviewsToResponseWithCursor } from '../dtos/review.dto.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';

/**
 * 가게에 리뷰를 추가하는 서비스
 * @param {Object} reviewData - 리뷰 데이터
 * @param {number} userId - 사용자 ID
 * @returns {Promise<Object>} 생성된 리뷰 정보
 */
export const createReview = async (reviewData, userId) => {
  logger.info('리뷰 생성 서비스 시작', { storeId: reviewData.store_id, userId });
  
  // 가게 존재 여부 확인
  const store = await getStoreById(reviewData.store_id);
  if (!store) {
    logger.warn('존재하지 않는 가게에 리뷰를 추가하려고 시도', { storeId: reviewData.store_id });
    throw new NotFoundError(`가게 ID ${reviewData.store_id}에 해당하는 가게가 존재하지 않습니다.`);
  }
  
  try {
    // 리뷰 점수 검증 (0.0 ~ 5.0 사이의 값으로 제한)
    if (reviewData.score < 0 || reviewData.score > 5) {
      logger.warn('유효하지 않은 리뷰 점수', { score: reviewData.score });
      throw new BadRequestError('리뷰 점수는 0에서 5 사이의 값이어야 합니다.');
    }
    
    // 리뷰 추가
    const review = await addReview({
      ...reviewData,
      user_id: userId
    });
    
    logger.info('리뷰 생성 성공', { reviewId: review.id });
    return reviewToResponse(review);
  } catch (error) {
    logger.error('리뷰 생성 서비스 오류', { error: error.message });
    throw error;
  }
};

/**
 * 가게의 리뷰 목록을 조회하는 서비스
 * @param {number} storeId - 가게 ID
 * @param {number|null} cursor - 페이지네이션 커서 (이전 페이지의 마지막 리뷰 ID)
 * @param {number} limit - 한 페이지에 조회할 리뷰 수
 * @returns {Promise<Object>} 조회된 리뷰 목록과 다음 페이지 커서
 */
export const getStoreReviews = async (storeId, cursor, limit) => {
  logger.info('가게 리뷰 목록 조회 서비스 시작', { storeId, cursor, limit });
  
  // 가게 존재 여부 확인
  const store = await getStoreById(storeId);
  if (!store) {
    logger.warn('존재하지 않는 가게의 리뷰를 조회하려고 시도', { storeId });
    throw new NotFoundError(`가게 ID ${storeId}에 해당하는 가게가 존재하지 않습니다.`);
  }
  
  try {
    // 리뷰 목록 조회
    const reviews = await getReviewsByStoreId(storeId, cursor, limit);
    
    // DTO 변환
    const result = reviewsToResponseWithCursor(reviews, limit);
    
    logger.info('가게 리뷰 목록 조회 성공', { 
      storeId, 
      count: result.data.length,
      hasMore: result.cursor !== null
    });
    
    return result;
  } catch (error) {
    logger.error('가게 리뷰 목록 조회 서비스 오류', { error: error.message, storeId });
    throw error;
  }
};

/**
 * 내가 작성한 리뷰 목록을 조회하는 서비스
 * @param {number} userId - 사용자 ID
 * @param {number|null} cursor - 페이지네이션 커서 (이전 페이지의 마지막 리뷰 ID)
 * @param {number} limit - 한 페이지에 조회할 리뷰 수
 * @returns {Promise<Object>} 조회된 리뷰 목록과 다음 페이지 커서
 */
export const getUserReviews = async (userId, cursor, limit) => {
  logger.info('내 리뷰 목록 조회 서비스 시작', { userId, cursor, limit });
  
  try {
    // 내가 작성한 리뷰 목록 조회
    const reviews = await getReviewsByUserId(userId, cursor, limit);
    
    // DTO 변환
    const result = reviewsToResponseWithCursor(reviews, limit);
    
    logger.info('내 리뷰 목록 조회 성공', { 
      userId, 
      count: result.data.length,
      hasMore: result.cursor !== null
    });
    
    return result;
  } catch (error) {
    logger.error('내 리뷰 목록 조회 서비스 오류', { error: error.message, userId });
    throw error;
  }
};