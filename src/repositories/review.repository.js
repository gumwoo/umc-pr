import prisma from '../prisma.js';
import logger from '../utils/logger.js';

/**
 * 리뷰 추가
 * @param {Object} data - 리뷰 데이터
 * @returns {Promise<Object>} 생성된 리뷰 정보
 */
export const addReview = async (data) => {
  try {
    const review = await prisma.review.create({
      data: {
        content: data.content,
        score: data.score,
        image_url: data.image_url,
        store_id: data.store_id,
        user_id: data.user_id
      },
      include: {
        store: true,
        user: true
      }
    });
    
    logger.info('리뷰 추가 성공', { reviewId: review.id, storeId: data.store_id, userId: data.user_id });
    return review;
  } catch (err) {
    logger.error('리뷰 추가 중 오류 발생', { error: err.message, data });
    throw new Error(`리뷰를 추가하는 데 실패했습니다: ${err.message}`);
  }
};

/**
 * 가게 ID로 리뷰 목록 조회
 * @param {number} storeId - 가게 ID
 * @param {number|null} cursor - 페이지네이션 커서 (이전 페이지의 마지막 리뷰 ID)
 * @param {number} limit - 한 페이지에 조회할 리뷰 수
 * @returns {Promise<Array>} 리뷰 목록
 */
export const getReviewsByStoreId = async (storeId, cursor, limit) => {
  try {
    // 쿼리 조건 구성
    const whereCondition = {
      store_id: storeId
    };
    
    // 커서가 있는 경우, 해당 ID보다 작은 항목만 조회 (ID 내림차순이므로)
    if (cursor) {
      whereCondition.id = {
        lt: cursor
      };
    }
    
    // 리뷰 조회
    const reviews = await prisma.review.findMany({
      where: whereCondition,
      include: {
        user: true
      },
      orderBy: {
        id: 'desc' // 최신순으로 정렬
      },
      take: limit + 1 // 다음 페이지 확인을 위해 limit보다 하나 더 조회
    });
    
    logger.info('가게별 리뷰 목록 조회 성공', { 
      storeId, 
      count: reviews.length,
      cursor,
      limit
    });
    
    return reviews;
  } catch (err) {
    logger.error('가게별 리뷰 목록 조회 중 오류 발생', { error: err.message, storeId });
    throw new Error(`가게별 리뷰 목록을 조회하는 데 실패했습니다: ${err.message}`);
  }
};

/**
 * 사용자 ID로 리뷰 목록 조회
 * @param {number} userId - 사용자 ID
 * @param {number|null} cursor - 페이지네이션 커서 (이전 페이지의 마지막 리뷰 ID)
 * @param {number} limit - 한 페이지에 조회할 리뷰 수
 * @returns {Promise<Array>} 리뷰 목록
 */
export const getReviewsByUserId = async (userId, cursor, limit) => {
  try {
    // 쿼리 조건 구성
    const whereCondition = {
      user_id: userId
    };
    
    // 커서가 있는 경우, 해당 ID보다 작은 항목만 조회 (ID 내림차순이므로)
    if (cursor) {
      whereCondition.id = {
        lt: cursor
      };
    }
    
    // 리뷰 조회
    const reviews = await prisma.review.findMany({
      where: whereCondition,
      include: {
        store: true,
        user: true
      },
      orderBy: {
        id: 'desc' // 최신순으로 정렬
      },
      take: limit + 1 // 다음 페이지 확인을 위해 limit보다 하나 더 조회
    });
    
    logger.info('사용자별 리뷰 목록 조회 성공', { 
      userId, 
      count: reviews.length,
      cursor,
      limit
    });
    
    return reviews;
  } catch (err) {
    logger.error('사용자별 리뷰 목록 조회 중 오류 발생', { error: err.message, userId });
    throw new Error(`사용자별 리뷰 목록을 조회하는 데 실패했습니다: ${err.message}`);
  }
};
