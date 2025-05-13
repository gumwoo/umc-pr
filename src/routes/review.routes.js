import express from 'express';
import { handleCreateReview, handleListStoreReviews, handleListMyReviews } from '../controllers/review.controller.js';
import logger from '../utils/logger.js';

const router = express.Router();

// 가게에 리뷰 추가하기 API
router.post('/', async (req, res, next) => {
  logger.info('리뷰 추가 요청 수신', { 
    path: req.path, 
    method: req.method
  });
  
  try {
    await handleCreateReview(req, res, next);
  } catch (error) {
    logger.error('리뷰 추가 처리 중 오류 발생', { 
      error: error.message,
      stack: error.stack
    });
    
    next(error);
  }
});

// 가게의 리뷰 목록 조회 API
router.get('/store/:storeId', async (req, res, next) => {
  logger.info('가게 리뷰 목록 조회 요청 수신', { 
    path: req.path, 
    method: req.method,
    storeId: req.params.storeId,
    cursor: req.query.cursor,
    limit: req.query.limit
  });
  
  try {
    await handleListStoreReviews(req, res, next);
  } catch (error) {
    logger.error('가게 리뷰 목록 조회 중 오류 발생', { 
      error: error.message,
      stack: error.stack,
      storeId: req.params.storeId
    });
    
    next(error);
  }
});

// 내가 작성한 리뷰 목록 조회 API
router.get('/my', async (req, res, next) => {
  logger.info('내 리뷰 목록 조회 요청 수신', { 
    path: req.path, 
    method: req.method,
    cursor: req.query.cursor,
    limit: req.query.limit
  });
  
  try {
    await handleListMyReviews(req, res, next);
  } catch (error) {
    logger.error('내 리뷰 목록 조회 중 오류 발생', { 
      error: error.message,
      stack: error.stack
    });
    
    next(error);
  }
});

export default router;
