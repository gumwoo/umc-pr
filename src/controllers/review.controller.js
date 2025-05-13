import { StatusCodes } from 'http-status-codes';
import { bodyToReview } from '../dtos/review.dto.js';
import { createReview, getStoreReviews, getUserReviews } from '../services/review.service.js';
import logger from '../utils/logger.js';

/**
 * 가게에 리뷰를 추가하는 컨트롤러
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 * @param {Function} next - Express 다음 미들웨어 함수
 */
export const handleCreateReview = async (req, res, next) => {
  logger.info('리뷰 추가 요청을 받았습니다', { path: req.path });
  logger.debug('요청 본문:', { body: req.body });
  
  try {
    // 사용자 인증 정보가 있다고 가정 (실제로는 인증 미들웨어를 통해 설정됨)
    // 테스트를 위해 임시로 사용자 ID 설정
    const userId = req.user?.id || 1; // 실제 구현에서는 인증된 사용자 ID를 사용해야 함
    
    const reviewData = bodyToReview(req.body, userId);
    const review = await createReview(reviewData, userId);
    
    logger.info('리뷰 추가 성공', { reviewId: review.id });
    res.status(StatusCodes.CREATED).success({
      message: '리뷰가 성공적으로 추가되었습니다.',
      review
    });
  } catch (error) {
    logger.error('리뷰 추가 처리 중 오류 발생', { error: error.message });
    next(error);
  }
};

/**
 * 가게의 리뷰 목록을 조회하는 컨트롤러
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 * @param {Function} next - Express 다음 미들웨어 함수
 */
export const handleListStoreReviews = async (req, res, next) => {
  try {
    const storeId = parseInt(req.params.storeId, 10);
    const cursor = req.query.cursor ? parseInt(req.query.cursor, 10) : null;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 5;
    
    logger.info('가게 리뷰 목록 조회 요청', { 
      storeId,
      cursor,
      limit
    });
    
    const result = await getStoreReviews(storeId, cursor, limit);
    
    logger.info('가게 리뷰 목록 조회 성공', { 
      storeId,
      count: result.data.length,
      hasMore: result.cursor !== null
    });
    
    res.status(StatusCodes.OK).success({
      data: result.data,
      pagination: {
        cursor: result.cursor
      }
    });
  } catch (error) {
    logger.error('가게 리뷰 목록 조회 중 오류 발생', { 
      error: error.message,
      storeId: req.params.storeId
    });
    next(error);
  }
};

/**
 * 내가 작성한 리뷰 목록을 조회하는 컨트롤러
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 * @param {Function} next - Express 다음 미들웨어 함수
 */
export const handleListMyReviews = async (req, res, next) => {
  try {
    // 사용자 인증 정보가 있다고 가정 (실제로는 인증 미들웨어를 통해 설정됨)
    // 테스트를 위해 임시로 사용자 ID 설정
    const userId = req.user?.id || 1; // 실제 구현에서는 인증된 사용자 ID를 사용해야 함
    
    const cursor = req.query.cursor ? parseInt(req.query.cursor, 10) : null;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 5;
    
    logger.info('내 리뷰 목록 조회 요청', { 
      userId,
      cursor,
      limit
    });
    
    const result = await getUserReviews(userId, cursor, limit);
    
    logger.info('내 리뷰 목록 조회 성공', { 
      userId,
      count: result.data.length,
      hasMore: result.cursor !== null
    });
    
    res.status(StatusCodes.OK).success({
      data: result.data,
      pagination: {
        cursor: result.cursor
      }
    });
  } catch (error) {
    logger.error('내 리뷰 목록 조회 중 오류 발생', { 
      error: error.message
    });
    next(error);
  }
};